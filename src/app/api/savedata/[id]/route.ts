import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { SavedData } from "@/types/db";
import { NextResponse } from "next/server";

export const GET = auth(async (req,{params} )=> {
    const id =( await params)?.id;
    if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if(!id){
        return NextResponse.json({message:"Помилка : Не надано id"}, {status: 400});
    }
    try {
         const [result] = await pool.query('SELECT * FROM saved_data WHERE id = ?', [id]);
        
        const typedResult = result as SavedData[];
        const row = typedResult[0];
        if(!row){
            return NextResponse.json({message:"Помилка : Не знайдено даних для редагування з id " + id }, {status: 404});
        }
        const parsedObject = JSON.parse(row.data);
        return NextResponse.json(parsedObject);
    }
    catch (err) {
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})

export const DELETE = auth(async (req,{params} )=> {
    const id =( await params)?.id;
    if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if(!id){
        return NextResponse.json({message:"Помилка : Не надано id"}, {status: 400});
    }
    try {
        await pool.query('DELETE FROM saved_data WHERE id = ?', [id]);
        return NextResponse.json({message:"Дані видалено"});
    }
    catch (err) {
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})