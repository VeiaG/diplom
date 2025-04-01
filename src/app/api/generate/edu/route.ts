import { NextResponse } from "next/server";
import { generateFile, getVariables } from '@/lib/getVariables';
import { auth } from "@/auth";

export const POST = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const initialData = await req.json();

        // Перевірка на обов'язкові поля
        const requiredFields = ['directory_id', 'subdivision'];
        if (!requiredFields.every(field => field in initialData && initialData[field] !== '')) {
            return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
        }

        // Мапинг змінних у файлах в об'єкт
        const data = await getVariables(initialData);

        // Файл для генерації
        const fileName = 'TempContractEdu2024.docx';

        // Отримуємо буфер файлу
        const buffer = await generateFile(data, fileName);

        return new NextResponse(new ReadableStream({
            start(controller) {
                controller.enqueue(buffer);
                controller.close();
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})
