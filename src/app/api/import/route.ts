import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
// import { promises as fs } from 'fs';
// @ts-expect-error : no types for this package
import XlsxPopulate from "xlsx-populate";
import { Degree, Directory, EducationalProgram, Subdivision } from "@/types/db";

const DEGREE_MAX_ROWS = 101;
const SUBDIVISION_MAX_ROWS = 100;
const PROGRAM_MAX_ROWS = 900;
const DIRECTORY_MAX_ROWS = 1500;

// const A = -1; //not used , starting from B always
const B = 0;
const C = 1;
const D = 2;
// const E = 3;
const F = 4;
// const G = 5;
const H = 6;
const I = 7;
const J = 8;
const K = 9;
const L = 10;
const M = 11;
const N = 12;
const O = 13;
const P = 14;
const Q = 15;
const R = 16;
const S = 17;
const T = 18;
const U = 19;
const V = 20;
const W = 21;
const X = 22;
const Y = 23;
const Z = 24;
const AA = 25;
const AB = 26;
const AC = 27;



function JSDateToExcelDate(date: Date): number {
    // Отримання компонентів дати саме з локального часу
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Правильне створення UTC дати без впливу на часовий пояс
    const excelDate = Date.UTC(year, month - 1, day);

    const ExcelSerialNumber = 25569.0 + excelDate / (1000 * 60 * 60 * 24);

    // Виправлення специфічних випадків для Excel (1900 рік)
    if (year == 1900 && month == 2 && day == 29) {
        return 60;
    }

    if (ExcelSerialNumber <= 60) {
        return ExcelSerialNumber - 1;
    }

    return ExcelSerialNumber;
}

function excelDateToJSDate(serial:number):Date {
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;                                        
    const date_info = new Date(utc_value * 1000);
 
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    let total_seconds = Math.floor(86400 * fractional_day);
 
    const seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addDegrees = async (sheet: any) => {
    // Завантажуємо дані з бази
    const [degreeData] = await pool.query("SELECT * FROM degree");
    const typedDegree = degreeData as Degree[];
    // Додаємо дані у стовпець "B", починаючи з другого рядка
    typedDegree.forEach((degree, index) => {
        sheet.cell(`B${index + 2}`).value(degree.name);
    });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addSubdivisions = async (sheet: any) => {
    // Завантажуємо дані з бази
    const [subdivisionData] = await pool.query("SELECT * FROM subdivisions");
    const typedSubdivision = subdivisionData as Subdivision[];
    // Додаємо дані у стовпець "B", починаючи з другого рядка
    typedSubdivision.forEach((subdivision, index) => {
        sheet.cell(`B${index + 2}`).value(subdivision.name);
        sheet.cell(`C${index + 2}`).value(subdivision.dean);
        sheet.cell(`D${index + 2}`).value(subdivision.degree);
    });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addPrograms = async (sheet: any) => {
    // Завантажуємо дані з бази
    const [programData] = await pool.query(`
        SELECT ep.*, s.name as subdivisionName 
        FROM educational_program ep 
        JOIN subdivisions s ON ep.subdivision_id = s.id
    `);
    const typedProgram = programData as (EducationalProgram & {
        subdivisionName: string;
    })[];
    // Додаємо дані у стовпець "B", починаючи з другого рядка
    typedProgram.forEach((program, index) => {
        sheet.cell(`B${index + 2}`).value(program.educationalProgram);
        sheet.cell(`C${index + 2}`).value(program.specialtyName);
        sheet.cell(`D${index + 2}`).value(program.subdivisionName);
    });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addDirectory = async (sheet: any) => {
    const [directoryData] = await pool.query(`
        SELECT d.*, s.name as subdivisionName, deg.name as degreeName
        FROM directory_with_program d
        JOIN subdivisions s ON d.subdivision_id = s.id
        JOIN degree deg ON d.degree_id = deg.id
    `);
    const typedDirectory = directoryData as (Directory & {
        subdivisionName: string;
        degreeName: string;
    })[];

    typedDirectory.forEach((directory, index) => {
        sheet.cell(`B${index + 2}`).value(directory.subdivisionName);
        sheet.cell(`D${index + 2}`).value(directory.degreeName);
        sheet.cell(`F${index + 2}`).value(directory.educationalProgram);
        //now static values starting from H
        sheet.cell(`H${index + 2}`).value(directory.educationForm);
        sheet
            .cell(`I${index + 2}`)
            .value(directory.accreditation ? "Так" : "Ні");

        sheet
            .cell(`J${index + 2}`)
            .value(
                directory?.accreditationPeriod
                    ? JSDateToExcelDate(directory?.accreditationPeriod)
                    : ""
            );

        sheet.cell(`K${index + 2}`).value(directory.educationScope);
        sheet.cell(`L${index + 2}`).value(directory.studyPeriod);
        sheet.cell(`M${index + 2}`).value(directory.paidCostEntireCourse);
        sheet
            .cell(`N${index + 2}`)
            .value(directory.paidCostEntireCourseWritten);

        //first year
        sheet.cell(`O${index + 2}`).value(directory.firstYearPeriod);
        sheet.cell(`P${index + 2}`).value(directory.firstYearCost);
        sheet.cell(`Q${index + 2}`).value(directory.firstYearCostWritten);
        //second year
        sheet.cell(`R${index + 2}`).value(directory.secondYearPeriod);
        sheet.cell(`S${index + 2}`).value(directory.secondYearCost);
        sheet.cell(`T${index + 2}`).value(directory.secondYearCostWritten);
        //third year
        sheet.cell(`U${index + 2}`).value(directory.thirdYearPeriod);
        sheet.cell(`V${index + 2}`).value(directory.thirdYearCost);
        sheet.cell(`W${index + 2}`).value(directory.thirdYearCostWritten);
        //fourth year
        sheet.cell(`X${index + 2}`).value(directory.fourthYearPeriod);
        sheet.cell(`Y${index + 2}`).value(directory.fourthYearCost);
        sheet.cell(`Z${index + 2}`).value(directory.fourthYearCostWritten);

        //remaining data
        sheet
            .cell(`AA${index + 2}`)
            .value(JSDateToExcelDate(directory.firstYearPayDue));
        sheet.cell(`AB${index + 2}`).value(directory.anualPayDue);
        sheet.cell(`AC${index + 2}`).value(directory.semesterPayDue);
    });
};
export const GET = auth(async (req) => {
    try {
        if (!req.auth)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        // Шлях до Excel-заготовки
        const templatePath = path.join(
            process.cwd(),
            "/src/files",
            "ExcelTemplate.xlsx"
        );

        // Завантажуємо Excel-заготовку
        const workbook = await XlsxPopulate.fromFileAsync(templatePath);

        // Аркуш Ступені Освіти
        const sheet = workbook.sheet("Ступені Освіти");
        if (!sheet) {
            return NextResponse.json(
                { error: "Аркуш Ступені Освіти не знайдено" },
                { status: 404 }
            );
        }
        await addDegrees(sheet);

        //Аркуш Навчальні підрозділи
        const sheetSubdivision = workbook.sheet("Навчальні підрозділи");
        if (!sheetSubdivision) {
            return NextResponse.json(
                { error: "Аркуш Навчальні підрозділи не знайдено" },
                { status: 404 }
            );
        }
        await addSubdivisions(sheetSubdivision);

        // Аркуш Спеціальності
        const sheetSpecialty = workbook.sheet("Спеціальності");
        if (!sheetSpecialty) {
            return NextResponse.json(
                { error: "Аркуш Спеціальності не знайдено" },
                { status: 404 }
            );
        }

        await addPrograms(sheetSpecialty);

        //Аркуш Довідка
        const sheetReference = workbook.sheet("Довідка");
        if (!sheetReference) {
            return NextResponse.json(
                { error: "Аркуш Довідка не знайдено" },
                { status: 404 }
            );
        }

        await addDirectory(sheetReference);

        //Аркуш Вітання
        const sheetGreeting = workbook.sheet("Вітання");
        if (!sheetGreeting) {
            return NextResponse.json(
                { error: "Аркуш Вітання не знайдено" },
                { status: 404 }
            );
        }
        sheetGreeting.cell("N9").value("Так");
        sheetGreeting.cell("N10").value(new Date().toLocaleDateString("uk-UA"));

        // Експортуємо Excel у буфер
        const buffer = await workbook.outputAsync();

        // Відправляємо користувачеві оновлений файл
        return new NextResponse(buffer, {
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition":
                    'attachment; filename="Updated_TEST.xlsx"',
            },
        });
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


const clearDB = async () => {
    // Disable foreign key checks
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Очищуємо таблиці БД перед імпортом  ( AUTO_INCREMENT повинен також скидатися)
    await pool.query("TRUNCATE TABLE degree");
    await pool.query("TRUNCATE TABLE subdivisions");
    await pool.query("TRUNCATE TABLE educational_program");
    await pool.query("TRUNCATE TABLE directory");
    
    // Enable foreign key checks
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
}
export const POST = auth(async (req) => {
    try {
        if (!req.auth)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        
         // Отримання FormData
         const formData = await req.formData();
         const file = formData.get('file');
 
         if (!file || !(file instanceof Blob)) {
             return NextResponse.json(
                 { error: "Файл не надіслано або некоректний формат" },
                 { status: 400 }
             );
         }
 
         // Зчитування даних з файлу
         const buffer = await file.arrayBuffer();
         const workbook = await XlsxPopulate.fromDataAsync(buffer);

        //Починаємо імпорт даних, в порядку (як при експорті)

        //Аркуш Ступені Освіти
        const sheet = workbook.sheet("Ступені Освіти");
        if (!sheet) {
            return NextResponse.json(
                { error: "Аркуш Ступені Освіти не знайдено" },
                { status: 404 }
            );
        }

        const degrees = sheet.range(`B2:B${DEGREE_MAX_ROWS}`).value().filter((el:string[])=>el[B]).map((el:string[])=>({
            name:el[B]
        })) as Omit<Degree,'id'>[];
        // console.log('DEGREES',degrees);

        //Аркуш Навчальні підрозділи
        const sheetSubdivision = workbook.sheet("Навчальні підрозділи");
        if (!sheetSubdivision) {
            return NextResponse.json(
                { error: "Аркуш Навчальні підрозділи не знайдено" },
                { status: 404 }
            );
        }
        const subidivisions:Omit<Subdivision,'id'>[] = sheetSubdivision.range(`B2:D${SUBDIVISION_MAX_ROWS}`).value()
        .filter((el:string[])=>el[B] && el[C] && el[D])
        .map((el:string[])=>({name:el[B],dean:el[C],degree:el[D]}) )

        // console.log('SUBDIVISIONS',subidivisions);

        // Аркуш Спеціальності
        const sheetSpecialty = workbook.sheet("Спеціальності");
        if (!sheetSpecialty) {
            return NextResponse.json(
                { error: "Аркуш Спеціальності не знайдено" },
                { status: 404 }
            );
        }

        const programs:Omit<EducationalProgram,'id'>[] = sheetSpecialty.range(`B2:D${PROGRAM_MAX_ROWS}`).value()
        .filter((el:string[])=>el[B] && el[C] && el[D])
        .map((el:string[])=>({
            educationalProgram:el[B],
            specialtyName:el[C],
            subdivision_id:subidivisions.findIndex(s=>s.name===el[D])+1 //+1 because of 1-indexed
        }) )
        // console.log('PROGRAMS',programs);

        //Аркуш Довідка
        const sheetReference = workbook.sheet("Довідка");
        if (!sheetReference) {
            return NextResponse.json(
                { error: "Аркуш Довідка не знайдено" },
                { status: 404 }
            );
        }

        const directory:Omit<Directory,'id'>[] = sheetReference.range(`B2:AC${DIRECTORY_MAX_ROWS}`).value()
        .filter((el:string[])=>{
            //check if B , D , F , H , I , L , M is not empty
            return el[B] && el[D] && el[F] && el[H] && el[I] && el[L] && el[M]
        })
        .map((el:string[]):Omit<Directory,'id'>=>{
            return {
            subdivision_id:subidivisions.findIndex(s=>s.name===el[B])+1,
            degree_id:degrees.findIndex(d=>d.name===el[D])+1,
            educationalProgramID:programs.findIndex(p=>p.educationalProgram===el[F])+1,
            
            educationForm:el[H] as ('денна' | 'заочна'),
            accreditation:el[I]==='Так' ? true : false,
            accreditationPeriod:el[I] === "Так" ? excelDateToJSDate(parseInt(el[J])) : undefined,
            educationScope:parseInt(el[K])  || 0,
            studyPeriod:el[L],
            paidCostEntireCourse:parseInt(el[M])  || 0,
            paidCostEntireCourseWritten:el[N],
            //first year
            firstYearPeriod:el[O]  || '',
            firstYearCost:parseInt(el[P])  || '',
            firstYearCostWritten:el[Q]  || '',
            //second year
            secondYearPeriod:el[R]  || '',
            secondYearCost:parseInt(el[S])  || '',
            secondYearCostWritten:el[T]  || '',
            //third year
            thirdYearPeriod:el[U]  || '',
            thirdYearCost:parseInt(el[V])  || '',
            thirdYearCostWritten:el[W]  || '',
            //fourth year
            fourthYearPeriod:el[X] || '',
            fourthYearCost:parseInt(el[Y]) || '',
            fourthYearCostWritten:el[Z] || '',
            //remaining data
            firstYearPayDue:excelDateToJSDate(parseInt(el[AA])),
            anualPayDue:el[AB],
            semesterPayDue:el[AC]


        }} )
        // console.log('DIRECTORY',directory);

        //Вставляємо дані в БД
        await clearDB();
        for (const degree of degrees) {
            await pool.query("INSERT INTO degree SET ?", degree);
        }
        for (const subdivision of subidivisions) {
            await pool.query("INSERT INTO subdivisions SET ?", subdivision);
        }
        for (const program of programs) {
            await pool.query("INSERT INTO educational_program SET ?", program);
        }

        for (const dir of directory) {
            await pool.query("INSERT INTO directory SET ?", dir);
        }

            
        return NextResponse.json({ message: "Дані успішно імпортовано" });
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
