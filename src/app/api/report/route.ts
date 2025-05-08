import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
// @ts-expect-error : no types for this package
import XlsxPopulate from "xlsx-populate";
import { pool } from "@/lib/db";



const getAllData = async () => {
    const [data] = await pool.query(`
        SELECT 
    sd.id AS saved_data_id,
    sd.created_at,
    sd.updated_at,
    sd.data,
    
    -- User data
    u.id AS user_id,
    u.username,
    u.email,
    u.role,
    
    -- Subdivision data
    sub.id AS subdivision_id,
    sub.name AS subdivision_name,
    sub.dean AS subdivision_dean,
    sub.degree AS subdivision_degree,
    
    -- Parse needed fields from JSON data for easier access
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.subdivision')) AS form_subdivision_id,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.degree')) AS form_degree_id,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.directory_id')) AS form_directory_id,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.pib_vstup')) AS pib_vstup,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.passport_vstup')) AS passport_vstup,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.address_vstup')) AS address_vstup,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.ipn_vstup')) AS ipn_vstup,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.phone_vstup')) AS phone_vstup,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.pib_legal')) AS pib_legal,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.passport_legal')) AS passport_legal,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.address_legal')) AS address_legal,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.ipn_legal')) AS ipn_legal,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.phone_legal')) AS phone_legal,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.education_form')) AS education_form,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.financing')) AS financing,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.payment_term')) AS payment_term,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.jur_name')) AS jur_name,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.jur_pib')) AS jur_pib,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.jur_status')) AS jur_status,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.jur_pib_short')) AS jur_pib_short,
    JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.jur_req')) AS jur_req,
    
    -- Degree data
    deg.id AS degree_id,
    deg.name AS degree_name,
    
    -- Directory data using the view with programs
    dir.id AS directory_id,
    dir.educationForm,
    dir.accreditation,
    dir.accreditationPeriod,
    dir.educationScope,
    dir.studyPeriod,
    dir.paidCostEntireCourse,
    dir.paidCostEntireCourseWritten,
    dir.firstYearPeriod,
    dir.firstYearCost,
    dir.firstYearCostWritten,
    dir.secondYearPeriod,
    dir.secondYearCost,
    dir.secondYearCostWritten,
    dir.thirdYearPeriod,
    dir.thirdYearCost,
    dir.thirdYearCostWritten,
    dir.fourthYearPeriod,
    dir.fourthYearCost,
    dir.fourthYearCostWritten,
    dir.firstYearPayDue,
    dir.anualPayDue,
    dir.semesterPayDue,
    dir.educationalProgram,
    dir.specialtyName
    
FROM 
    saved_data sd
LEFT JOIN 
    users u ON sd.user_id = u.id
LEFT JOIN 
    subdivisions sub ON JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.subdivision')) = sub.id
LEFT JOIN 
    degree deg ON JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.degree')) = deg.id
LEFT JOIN 
    directory_with_program dir ON JSON_UNQUOTE(JSON_EXTRACT(sd.data, '$.directory_id')) = dir.id
ORDER BY 
    sd.created_at DESC;
        `)
    return data
}

export const GET = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
         // Шлях до Excel-заготовки
        const templatePath = path.join(
            process.cwd(),
            "/src/files",
            "EmptyExcel.xlsx"
        );

        const workbook = await XlsxPopulate.fromFileAsync(templatePath);
        const sheet = workbook.sheet("Result");
        if(!sheet) {
            return NextResponse.json({ error: "Sheet not found" }, { status: 500 });
        }

        const data = await getAllData();
        if(!data) {
            return NextResponse.json({ error: "No data found" }, { status: 500 });
        }

        // Заповнення заголовків
        //@ts-expect-error: no type
        Object.keys(data[0]).forEach((key, index) => {
            sheet.cell(1, index + 1).value(key);
        });
        // Заповнення даних
        //@ts-expect-error: no type
        data?.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                if (typeof value === "string") {
                    sheet.cell(rowIndex + 2, colIndex + 1).value(value);
                } else if (typeof value === "number") {
                    sheet.cell(rowIndex + 2, colIndex + 1).value(value);
                } else if (value instanceof Date) {
                    sheet.cell(rowIndex + 2, colIndex + 1).value(value.toLocaleDateString('uk-UA'));
                } else {
                    sheet.cell(rowIndex + 2, colIndex + 1).value(JSON.stringify(value));
                }
            });
        });

        const buffer = await workbook.outputAsync();

        // Відправляємо користувачеві оновлений файл
        return new NextResponse(buffer, {
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition":
                    'attachment; filename="report.xlsx"',
            },
        });;


        


        return 
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})