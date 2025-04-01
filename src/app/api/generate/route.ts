import { NextResponse } from "next/server";
import { generateFile, getVariables } from '@/lib/getVariables';
import archiver from 'archiver';
import { auth } from "@/auth";

export const POST = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const initialData = await req.json();

        // Перевірка на обов'язкові поля
        const requiredFields = ['directory_id', 'subdivision', 'directory_id'];
        if (!requiredFields.every(field => field in initialData && initialData[field] !== '')) {
            return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
        }

        // Мапинг змінних у файлах в об'єкт
        const data = await getVariables(initialData);

        // Список файлів для генерації
        const fileNames = ['TempContractEdu2024.docx'];
        const endFileNames = [`_Договір_навчання_${new Date().getFullYear()}.docx`];
        const endPrefix = initialData?.pib_vstup.replace(' ', '_');
        

        if(initialData?.financing === 'phys'){
            fileNames.push('TempContractPhysical2024.docx');
            endFileNames.push(`_Договір_фіз_особа_${new Date().getFullYear()}.docx`);
        }
        if(initialData?.financing === 'jur'){
            fileNames.push('TempContractOf2024.docx');
            endFileNames.push(`_Договір_юр_особа_${new Date().getFullYear()}.docx`);

        }


        // Використовуємо ReadableStream для потокової передачі архіву
        const stream = new ReadableStream({
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
