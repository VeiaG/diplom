import { NextResponse } from "next/server";
import { generateFile, getVariables } from '@/lib/getVariables';
import archiver from 'archiver';
import { auth } from "@/auth";
import { EDU_FILE_NAME, JUR_FILE_NAME, PHYS_FILE_NAME } from "@/globals";

export const POST = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const initialData = await req.json();
        const requiredFields = ['directory_id', 'subdivision', 'directory_id']; // Перевірка на обов'язкові поля
        if (!requiredFields.every(field => field in initialData && initialData[field] !== '')) {
            return NextResponse.json({ error: "Обов'язкові поля відсутні" }, { status: 400 });
        }
        const data = await getVariables(initialData); // Мапинг змінних у файлах в об'єкт
        const fileNames = [EDU_FILE_NAME]; // Список файлів для генерації
        const endFileNames = [`_Договір_навчання_${new Date().getFullYear()}.docx`];
        const endPrefix = initialData?.pib_vstup.replace(' ', '_');
        if(initialData?.financing === 'phys'){
            fileNames.push(PHYS_FILE_NAME);
            endFileNames.push(`_Договір_фіз_особа_${new Date().getFullYear()}.docx`);
        }
        if(initialData?.financing === 'jur'){
            fileNames.push(JUR_FILE_NAME);
            endFileNames.push(`_Договір_юр_особа_${new Date().getFullYear()}.docx`);
        }
        const stream = new ReadableStream({ // Використовуємо ReadableStream для потокової передачі архіву
            async start(controller) {
                const archive = archiver('zip', { zlib: { level: 9 } });
                archive.on('data', (chunk) => controller.enqueue(chunk));
                archive.on('end', () => controller.close());
                archive.on('error', (err) => controller.error(err));
                // Додаємо файли до архіву
                for (const fileName of fileNames) {
                    const buffer = await generateFile(data, fileName);
                    archive.append(buffer, { name: endPrefix + 
                        endFileNames[fileNames.indexOf(fileName)] 
                     });
                }
                archive.finalize();
            }
        });
        return new NextResponse(stream, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="contracts.zip"`,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
});
