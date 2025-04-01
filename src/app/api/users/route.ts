
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { User } from "@/types/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
type UserWithoutPassword = Omit<User, 'password'>;



export const GET = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        if(req.auth.user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        //get all users
        const [result] = await pool.query('SELECT id, username, email , role , subdivision_id FROM users') as [UserWithoutPassword[], FieldPacket[]];
        const users = result;
        return NextResponse.json({users});
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})

export const POST = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if(req.auth.user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { username, email, password, role, subdivision_id } = await req.json();
        if(typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string'){
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        if(role !== 'admin' && role !== 'user'){
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const [result] = await pool.query<ResultSetHeader>('INSERT INTO users (username, email, password, role, subdivision_id) VALUES (?, ?, ?, ?, ?)', [username, email, password, role, subdivision_id]);
        if (!result.insertId) throw new Error("Failed to insert subdivision");
        const [user] = await pool.query('SELECT id, username, email, password, role, subdivision_id FROM users WHERE id = ?', [result.insertId]);
        if (!Array.isArray(user) || user.length === 0) throw new Error("User not found");

        return NextResponse.json({ user: user[0] });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }

})