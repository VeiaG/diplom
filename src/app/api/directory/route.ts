import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { Directory } from "@/types/db";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
    try {
        if (!req.auth)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const [directory] = await pool.query(
            "SELECT * FROM directory_with_program"
        );

        console.log("Fetching directory", new Date().toLocaleTimeString());

        return NextResponse.json({ directory });
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    (err as Error).message || (err as { code: string })?.code,
            },
            { status: 500 }
        );
    }
});

export const POST = auth(async (req) => {
    try {
        if (!req.auth)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        if (req.auth.user.role !== "admin")
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const value: Directory = await req.json();
        if (
            !value.subdivision_id ||
            !value.degree_id ||
            !value.educationForm ||
            !value.educationalProgramID ||
            !value.educationScope ||
            !value.studyPeriod ||
            !value.paidCostEntireCourse ||
            !value.paidCostEntireCourseWritten ||
            !value.firstYearPeriod ||
            !value.firstYearCost ||
            !value.firstYearCostWritten ||
            !value.secondYearPeriod ||
            !value.secondYearCost ||
            !value.secondYearCostWritten ||
            !value.thirdYearPeriod ||
            !value.thirdYearCost ||
            !value.thirdYearCostWritten ||
            !value.fourthYearPeriod ||
            !value.fourthYearCost ||
            !value.fourthYearCostWritten ||
            !value.firstYearPayDue ||
            !value.anualPayDue ||
            !value.semesterPayDue
        ) {
            //console what's missing
            console.log(value);
            return NextResponse.json(
                { error: "Немає усіх полів" },
                { status: 400 }
            );
        }

        // Динамічне формування запиту
        const keys = Object.keys(value) as (keyof Directory)[];
        const placeholders = keys.map(() => "?").join(",");

        await pool.query(
            `INSERT INTO directory (${keys.join(
                ","
            )}) VALUES (${placeholders})`,
            keys.map((key) => {
                if (key === "accreditation") return value[key] ? 1 : 0; // Приводимо Boolean до INT
                if(  key === "accreditationPeriod"){
                    return value.accreditation ? new Date(value[key] || new Date()) : null; // Дати в потрібному форматі
                }
                if (
                    key === "firstYearPayDue"
                ) {
                    return new Date(value[key] || new Date()); // Дати в потрібному форматі
                }
                return value[key]; // Інші значення
            })
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                error:
                    (err as Error).message || (err as { code: string })?.code,
            },
            { status: 500 }
        );
    }
});
