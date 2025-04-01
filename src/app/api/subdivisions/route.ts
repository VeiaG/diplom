
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export const GET = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [subdivisions] = await pool.query('SELECT * FROM subdivisions');
        console.log('Fetching subdivisions', new Date().toLocaleTimeString());

        return NextResponse.json({ subdivisions });
    }
    catch(err){
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as {code :string})?.code }, { status: 500 });
    }
})

export const POST = auth( async (req) => {
    try {
        if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (req.auth.user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const {name,dean,degree} = await req.json();
        if (!name || !dean || !degree) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        console.log(name, dean, degree);
        // Insert into table and return the inserted row
       
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO subdivisions (name, dean, degree) VALUES (?, ?, ?)', [name, dean, degree]);
        if (!result.insertId) throw new Error("Failed to insert subdivision");
        const [subdivisions] = await pool.query('SELECT * FROM subdivisions WHERE id = ?', [result.insertId]);
        if (!Array.isArray(subdivisions) || subdivisions.length === 0) throw new Error("Subdivision not found");

        return NextResponse.json({ subdivision: subdivisions[0] });


    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})