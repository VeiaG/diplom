
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export const GET = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const [programs] = await pool.query('SELECT * FROM educational_program');
        console.log('Fetching Programs', new Date().toLocaleTimeString());

        return NextResponse.json({ programs });
    }
    catch(err){
        return NextResponse.json({ error: (err as Error).message || (err as {code :string})?.code }, { status: 500 });
    }
})
export const POST = auth( async (req) => {
    try {
        if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (req.auth.user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const {subdivision_id,educationalProgram,specialtyName} = await req.json();
        if (
            !subdivision_id || 
            !educationalProgram || 
            !specialtyName
        ) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        console.log('Creating Program', subdivision_id, educationalProgram, specialtyName, new Date().toLocaleTimeString());
        // Insert into table and return the inserted row
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO educational_program (subdivision_id,educationalProgram,specialtyName) VALUES (?, ?, ?)', [subdivision_id,educationalProgram,specialtyName]);
        if (!result.insertId) throw new Error("Failed to insert educational_program");

        const [programs] = await pool.query('SELECT * FROM educational_program WHERE id = ?', [result.insertId]);
        if (!Array.isArray(programs) || programs.length === 0) throw new Error("educational_program not found");

        return NextResponse.json({ program: programs[0] });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})