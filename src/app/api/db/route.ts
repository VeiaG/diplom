
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

const dateFields = ['accreditationPeriod','firstYearPayDue']
export const PUT = auth(async (req) => {
    try {
        if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (req.auth.user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { tableName, id, data } = await req.json();
        if (!tableName || !id || !data) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        console.log(tableName, id, data);

        const setClause:string[] = [];
        const values = [];

        Object.keys(data).forEach((key) => {
            let value = data[key];

            if (typeof value === 'string') {
                // Перевіряємо, чи поле є датою
                if (dateFields.includes(key)) {
                    const parsedDate = new Date(value);
                    if (isNaN(parsedDate.getTime())) {
                        throw new Error(`Invalid date format for field ${key}`);
                    }
                    value = parsedDate.toISOString().slice(0, 19).replace('T', ' ');
                }
                setClause.push(`${key} = ?`);
                values.push(value);
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                setClause.push(`${key} = ?`);
                values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
                //якщо key =accreditation і value = false , то accreditationPeriod = NULL
                if(key === 'accreditation' && !value){
                    setClause.push(`accreditationPeriod = NULL`);
                }
            } else if (value === null) {
                // Якщо value = null, теж записуємо NULL
                setClause.push(`${key} = NULL`);
            }
        });
        
        if (setClause.length === 0) {
            return NextResponse.json({ error: "Немає даних для оновлення" }, { status: 400 });
        }

        values.push(id); // Додаємо ID в кінець для WHERE
        const query = `UPDATE ${tableName} SET ${setClause.join(', ')} WHERE id = ?`;
        console.log(query, values);
        await pool.query(query, values);

        return NextResponse.json({ message: 'success' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
});
export const DELETE = auth(async (req) => {
    try {
        if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (req.auth.user.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { tableName, ids } = await req.json();
        if (!tableName || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        console.log(tableName, ids);

        // Delete rows from table
        // Використовуємо плейсхолдери для ID
        const placeholders = ids.map(() => "?").join(",");
        const query = `DELETE FROM ${tableName} WHERE id IN (${placeholders})`;
        console.log(query , ids);
        const [result] = await pool.query<ResultSetHeader>(query, ids);
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Жодні рядки не видалені" }, { status: 404 });
        }


        return NextResponse.json({ message: 'success' });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})
