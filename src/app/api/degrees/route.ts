
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export const GET = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const [degrees] = await pool.query('SELECT * FROM degree');
        console.log('Fetching degree', new Date().toLocaleTimeString());

        return NextResponse.json({ degrees });
    }
    catch(err){
        return NextResponse.json({ error: (err as Error).message || (err as {code :string})?.code }, { status: 500 });
    }
})
export const POST = auth( async (req) => {
    try {
        if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (req.auth.user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const {name} = await req.json();
        if (!name) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        // Insert into table and return the inserted row
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO degree (name) VALUES (?)', [name]);
        if (!result.insertId) throw new Error("Failed to insert degree");

        const [degrees] = await pool.query('SELECT * FROM degree WHERE id = ?', [result.insertId]);
        if (!Array.isArray(degrees) || degrees.length === 0) throw new Error("Degree not found");

        return NextResponse.json({ degree: degrees[0] });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})