import { NextResponse } from "next/server";
import { getOriginalFile } from '@/lib/getVariables';
import { auth } from "@/auth";
import { EDU_ASPIRANTS_FILE_NAME } from "@/globals";
import path from "path";
import { promises as fs } from 'fs';

export const GET = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


        const buffer = await getOriginalFile(EDU_ASPIRANTS_FILE_NAME);


        return new NextResponse(new ReadableStream({
            start(controller) {
                controller.enqueue(buffer);
                controller.close();
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${EDU_ASPIRANTS_FILE_NAME}"`,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})
export const POST = auth(async (req) => {
    try {
        // Перевірка авторизації
        if (!req.auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Отримання файлу з тіла запиту
        const formData = await req.formData();
        const file = formData.get("file");

        // Перевірка наявності файлу
        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        // Визначення назви файлу
        const  fileName = EDU_ASPIRANTS_FILE_NAME;
        
        // Шлях до файлу
        const filePath = path.join(process.cwd(), "/src/files", fileName);

        // Перетворення Blob в Buffer для запису
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Запис файлу
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ 
            success: true, 
            message: `File ${fileName} has been updated successfully` 
        });
    } catch (err) {
        console.error("Error updating file:", err);
        return NextResponse.json({ 
            error: (err as Error).message || (err as { code: string })?.code 
        }, { status: 500 });
    }
});