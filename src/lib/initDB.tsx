//initialize database using types from db.d.ts
import { pool } from "@/lib/db";
import { Directory, EducationalProgram, Subdivision, User } from "@/types/db";
import { hash } from "bcryptjs";

const init = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS initialized(
        id INT AUTO_INCREMENT PRIMARY KEY
    )
    `;
    await pool.query(sql);
};
const seedUsers = async () => {
    //add admin user with password 'admin'
    const user: Partial<User> = {
        username: "Administrator",
        email: "admin@example.com",
        password: await hash("admin", 10),
        role: "admin",
    };
    await pool.query("INSERT INTO users SET ?", user);

    const testUser: Partial<User> = {
        username: "TestUser",
        email: "test",
        password: await hash("test", 10),
        role: "user",
        subdivision_id: 1,
    };
    await pool.query("INSERT INTO users SET ?", testUser);
};

const initUsers = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        subdivision_id INT, 
        role ENUM('admin', 'user') DEFAULT 'user'
    )
    `;

    //add foreign key to subdivision_id, but it can be null
    const alterSql = `
        ALTER TABLE users
        ADD CONSTRAINT fk_subdivision_id
        FOREIGN KEY (subdivision_id)
        REFERENCES subdivisions(id)
        ON DELETE SET NULL
    `;

    await pool.query(sql);

    await pool.query(alterSql);

    await seedUsers();
};
const seedSubdivisions = async () => {
    const subdivisions: Partial<Subdivision>[] = [
        {
            name: "Факультет біотехнології та екологічного контролю",
            dean: "Наталія ГРЕГІРЧАК",
        },
        {
            name: "Навчально-науковий інженерно-технічний інститут імені акад.І.С.Гулого",
            dean: "Сергій БЛАЖЕНКО",
        },
        {
            name: "Навчально-науковий інститу харчових технологій",
            dean: "Оксана КОЧУБЕЙ-ЛИТВИНЕНКО",
        },
        {
            name: "Навчально-науковий інститут економіки і управління",
            dean: "Олег ШЕРЕМЕТ",
        },
        {
            name: "Факультет автоматизації і комп'ютерних систем",
            dean: "Андрій ФОРСЮК",
        },
        {
            name: "Факультет готельно-ресторанного та туристичного бізнесу імені проф.В.Ф.Доценка",
            dean: "Віта ЦИРУЛЬНІКОВА",
        },
    ];
    await pool.query("INSERT INTO subdivisions(name, dean) VALUES ?", [
        subdivisions.map((subdivision) => [subdivision.name, subdivision.dean]),
    ]);
};
const initSubdivisions = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS subdivisions(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dean VARCHAR(255) NOT NULL,
        degree VARCHAR(255) DEFAULT 'доктор філософії'
    )
    `;
    await pool.query(sql);
    //insert subdivisions
    await seedSubdivisions();

    // await pool.query('INSERT INTO subdivisions(name, dean) VALUES ?', [subdivisions.map(subdivision=>[subdivision.name, subdivision.dean])])
};

const seedDirectory = async () => {
    const directories: Directory[] = [
        {
            subdivision_id: 2,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 1, // Електроенергетика, електротехніка та електромеханіка
            accreditation: true,
            accreditationPeriod: new Date(2027, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень ",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "П'ятдесят одна тисячa триста гривень ",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "П'ятдесят одна тисячa триста гривень ",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "П'ятдесят одна тисячa триста гривень ",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 2,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 2, // Машини та апарати харчових, мікробіологічних та фармацевтичних виробництв
            accreditation: true,
            accreditationPeriod: new Date(2027, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 2,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 3, // Теплоенергетика та енергоефективні технології
            accreditation: true,
            accreditationPeriod: new Date(2028, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 2,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID: 1, // Електроенергетика, електротехніка та електромеханіка
            accreditation: true,
            accreditationPeriod: new Date(2027, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten: "Сто п'ятдесят чотири тисячі чотириста гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 2,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID: 2, // Машини та апарати харчових, мікробіологічних та фармацевтичних виробництв
            accreditation: true,
            accreditationPeriod: new Date(2027, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten: "Сто п'ятдесят чотири тисячі чотириста гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 2,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID: 3, // Теплоенергетика та енергоефективні технології
            accreditation: true,
            accreditationPeriod: new Date(2028, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten: "Сто п'ятдесят чотири тисячі чотириста гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 3,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 4, // Харчові технології
            accreditation: true,
            accreditationPeriod: new Date(2029, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 3,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID: 4, // Харчові технології
            accreditation: true,
            accreditationPeriod: new Date(2029, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten: "Сто п'ятдесят чотири тисячі чотириста гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 4,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 5, // Економіка
            accreditation: false,
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 4,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 6, // Маркетинг
            accreditation: false,
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 4,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 7, // Менеджмент
            accreditation: false,
            accreditationPeriod: undefined,
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "П'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 4,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID: 5, // Економіка
            accreditation: false,
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten: "Сто п'ятдесят чотири тисячі чотириста гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 4,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID: 6, // Маркетинг
            accreditation: false,
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten: "Сто п'ятдесят чотири тисячі чотириста гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 4,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID: 7, // Менеджмент
            accreditation: false,
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten: "Сто п'ятдесят чотири тисячі чотириста гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 5,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 8, // Автоматизація та комп'ютерно інтегровані технології
            accreditation: true,
            accreditationPeriod: new Date(2028, 6, 1),
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "п'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "п'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "п'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 5,
            degree_id: 1,
            educationForm: "денна",
            educationalProgramID: 9, // Комп'ютерні науки
            accreditation: false,
            educationScope: 60,
            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",
            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",
            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "п'ятдесят одна тисяча триста гривень",
            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "п'ятдесят одна тисяча триста гривень",
            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "п'ятдесят одна тисяча триста гривень",
            firstYearPayDue: new Date(2024, 8, 1),
            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 5,
            degree_id: 1,
            educationForm: "заочна",
            educationalProgramID:8, // Автоматизація та комп'ютерно інтегровані технології
            accreditation: true,
            accreditationPeriod: new Date(2028, 6, 1), // 01.07.2028
            educationScope: 60,

            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten:
                "Сто п'ятдесят чотири тисячі чотириста гривень",

            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            firstYearPayDue: new Date(2024, 8, 1), // 1 вересня 2024 р.

            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 5,
            degree_id: 1, // Впиши свій ID
            educationForm: "заочна",
            educationalProgramID:9, // Комп'ютерні науки
            accreditation: false,
            // accreditationPeriod: null,
            educationScope: 60,

            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten:
                "Сто п'ятдесят чотири тисячі чотириста гривень",

            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            firstYearPayDue: new Date(2024, 8, 1), // 1 вересня 2024 р.

            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 1,
            degree_id: 1, // Впиши свій ID
            educationForm: "денна",
           educationalProgramID:10,
            accreditation: true,
            accreditationPeriod: new Date(2027, 6, 1), // 01.07.2027
            educationScope: 60,

            studyPeriod: "2024-2028",
            paidCostEntireCourse: 205200,
            paidCostEntireCourseWritten: "Двісті п'ять тисяч двісті гривень",

            firstYearPeriod: "2024-2025",
            firstYearCost: 51300,
            firstYearCostWritten: "П'ятдесят одна тисячa триста гривень",

            secondYearPeriod: "2025-2026",
            secondYearCost: 51300,
            secondYearCostWritten: "п'ятдесят одна тисяча триста гривень",

            thirdYearPeriod: "2026-2027",
            thirdYearCost: 51300,
            thirdYearCostWritten: "п'ятдесят одна тисяча триста гривень",

            fourthYearPeriod: "2027-2028",
            fourthYearCost: 51300,
            fourthYearCostWritten: "п'ятдесят одна тисяча триста гривень",

            firstYearPayDue: new Date(2024, 8, 1), // 1 вересня 2024 р.

            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
        {
            subdivision_id: 1,
            degree_id: 1, // Впиши свій ID
            educationForm: "заочна",
            educationalProgramID:10,
            accreditation: true,
            accreditationPeriod: new Date(2027, 6, 1), // 01.07.2027
            educationScope: 60,

            studyPeriod: "2024-2028",
            paidCostEntireCourse: 154400,
            paidCostEntireCourseWritten:
                "Сто п'ятдесят чотири тисячі чотириста гривень",

            firstYearPeriod: "2024-2025",
            firstYearCost: 38600,
            firstYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            secondYearPeriod: "2025-2026",
            secondYearCost: 38600,
            secondYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            thirdYearPeriod: "2026-2027",
            thirdYearCost: 38600,
            thirdYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            fourthYearPeriod: "2027-2028",
            fourthYearCost: 38600,
            fourthYearCostWritten: "Тридцять вісім тисяч шістсот гривень",

            firstYearPayDue: new Date(2024, 8, 1), // 1 вересня 2024 р.

            anualPayDue: "до 01.09 кожного поточного н.р.",
            semesterPayDue: "кожного семестру до 01.09 та 01.02 поточного н.р.",
        },
    ];
    // now we need to insert all the data into the database
    for (const directory of directories) {
        await pool.query("INSERT INTO directory SET ?", directory);
    }
};
const initDirectory = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS directory(
        id INT AUTO_INCREMENT PRIMARY KEY,
        subdivision_id INT, 
        degree_id INT,
        educationForm ENUM('денна', 'заочна') NOT NULL,
        educationalProgramID INT ,
        accreditation BOOLEAN NOT NULL,
        accreditationPeriod DATE NULL DEFAULT NULL,
        educationScope INT NOT NULL,
        studyPeriod VARCHAR(255) NOT NULL,
        paidCostEntireCourse INT NOT NULL,
        paidCostEntireCourseWritten VARCHAR(255) NOT NULL,
        firstYearPeriod VARCHAR(255) NOT NULL,
        firstYearCost VARCHAR(255) NOT NULL,
        firstYearCostWritten VARCHAR(255) NOT NULL,
        secondYearPeriod VARCHAR(255) NOT NULL,
        secondYearCost VARCHAR(255) NOT NULL,
        secondYearCostWritten VARCHAR(255) NOT NULL,
        thirdYearPeriod VARCHAR(255) NOT NULL,
        thirdYearCost VARCHAR(255) NOT NULL,
        thirdYearCostWritten VARCHAR(255) NOT NULL,
        fourthYearPeriod VARCHAR(255) NOT NULL,
        fourthYearCost VARCHAR(255) NOT NULL,
        fourthYearCostWritten VARCHAR(255) NOT NULL,
        firstYearPayDue DATE NOT NULL,
        anualPayDue VARCHAR(255) NOT NULL,
        semesterPayDue VARCHAR(255) NOT NULL
    )
    `;
    await pool.query(sql);
    //add foreign key to subdivisions
    await pool.query(
        "ALTER TABLE directory ADD FOREIGN KEY (subdivision_id) REFERENCES subdivisions(id) ON DELETE SET NULL"
    );

    //add foreign key to degree
    await pool.query(
        "ALTER TABLE directory ADD FOREIGN KEY (degree_id) REFERENCES degree(id) ON DELETE SET NULL"
    );

    //add fk to educational_program
    await pool.query(
        "ALTER TABLE directory ADD FOREIGN KEY (educationalProgramID) REFERENCES educational_program(id) ON DELETE SET NULL"
    );
    await seedDirectory();
};

const initDegree = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS degree(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )
    `;
    await pool.query(sql);
    //seed the table with data
    // add 'доктор філософії'
    await pool.query("INSERT INTO degree SET ?", { name: "доктор філософії" });
};

const initSavedData = async () => {
    //create table for saved data
    const sql = `
    CREATE TABLE IF NOT EXISTS saved_data(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        data TEXT NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
    )
    `;

    await pool.query(sql);
    //add foreign key to users
    await pool.query(
        "ALTER TABLE saved_data ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL"
    );
};



const seedEducationalProgram = async () => {
    const programs: EducationalProgram[] = [
    {
        subdivision_id: 2,
        educationalProgram: "Електроенергетика, електротехніка та електромеханіка",
        specialtyName: "141 Електроенергетика, електротехніка та електромеханіка",
    },
    {
        subdivision_id: 2,
        educationalProgram: "Машини та апарати харчових, мікробіологічних та фармацевтичних виробництв",
        specialtyName: "133 Галузева машинобудування",
    },
    {
        subdivision_id: 2,
        educationalProgram: "Теплоенергетика та енергоефективні технології",
        specialtyName: "144 Теплоенергетика",
    },
    {
        subdivision_id: 3,
        educationalProgram: "Харчові технології",
        specialtyName: "181 Харчові технології",
    },
    {
        subdivision_id: 4,
        educationalProgram: "Економіка",
        specialtyName: "051 Економіка",
    },
    {
        subdivision_id: 4,
        educationalProgram: "Маркетинг",
        specialtyName: "075 Маркетинг",
    },
    {
        subdivision_id: 4,
        educationalProgram: "Менеджмент",
        specialtyName: "073 Менеджмент",
    },
    {
        subdivision_id: 5,
        educationalProgram: "Автоматизація та комп'ютерно інтегровані технології",
        specialtyName: "174 Автоматизація, комп'ютерно-інтегровані технології та робототехніка",
    },
    {
        subdivision_id: 5,
        educationalProgram: "Комп'ютерні науки",
        specialtyName: "122 Комп'ютерні науки",
    },
    {
        subdivision_id: 1,
        educationalProgram: "Біотехнологія",
        specialtyName: "162 Біотехнології та біоінженерія",
    }
];
    // now we need to insert all the data into the database
    for (const program of programs) {
        await pool.query("INSERT INTO educational_program SET ?", program);
    }
};
const initEducationalProgram = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS educational_program(
        id INT AUTO_INCREMENT PRIMARY KEY,
        subdivision_id INT,
        educationalProgram VARCHAR(255) NOT NULL,
        specialtyName VARCHAR(255) NOT NULL
    )
    `;
    await pool.query(sql);
    //add foreign key to subdivisions
    await pool.query(
        "ALTER TABLE educational_program ADD FOREIGN KEY (subdivision_id) REFERENCES subdivisions(id) ON DELETE SET NULL"
    );
    await seedEducationalProgram();
};

const createDirectoryWithProgramsView = async ()=>{
    await pool.query(`
        CREATE OR REPLACE VIEW directory_with_program AS
        SELECT d.*, ep.educationalProgram, ep.specialtyName
        FROM directory d
        LEFT JOIN educational_program ep 
        ON d.educationalProgramID = ep.id
    `);
    
}

export const initDB = async () => {
    try {
        await init();

        await initDegree();
        await initSubdivisions();

        await initEducationalProgram(); // обов'язково перед directory  , бо є зовнішні ключі
        await initDirectory();
        // створюємо view для пропагації даних
        await createDirectoryWithProgramsView();
        
        await initUsers();
        await initSavedData();

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};
export const isInitialized = async () => {
    //if table initialized exists, then the database is initialized
    // throw new Error("Не працює , потім чекнути заново , завжди false");
    try {
        const [rows] = await pool.query('SHOW TABLES LIKE "initialized"');
        return (rows as User[]).length > 0;
    } catch (e) {
        console.error(e);
        return false;
    }
};