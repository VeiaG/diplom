import { Degree, Directory, Subdivision } from "@/types/db";
import { pool } from "./db";
import { promises as fs } from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

import path from 'path';

export type AdmissionData = {
    year: string;
    pib_vstup: string;
    passport_vstup: string;
    address_vstup: string;
    ipn_vstup: string;
    phone_vstup: string;
    
    pib_legal: string;
    passport_legal: string;
    address_legal: string;
    ipn_legal: string;
    phone_legal: string;
  
    education_form: string; // денна = "денною", заочна = "заочною"
  
    education_program: string;
    education_specialty: string;
    degree: string;
    accreditation: string; // true = "акредитована", else "не акредитована"
    accreditation_term: string; // toLocaleDateString()
    credits: string;
  
    financing: string;
  
    pib_vstup_short: string; // Ім'я + ПРІЗВИЩЕ_КАПСОМ
    pib_legal_short: string;

    paidEntire:string,
    paidEntireW:string,

    y1Paid:string,
    y1PaidW:string,
    yy1:string,

    y2Paid:string,
    y2PaidW:string,
    yy2:string,

    y3Paid:string,
    y3PaidW:string,
    yy3:string,

    y4Paid:string,
    y4PaidW:string,
    yy4:string,

    y1DuePay:string,

    anualPayDue:string,
    semesterPayDue:string,

    dean: string;

    jur_name: string;
    jur_pib: string;
    jur_status: string;
    jur_pib_short: string;
    jur_req: string;
    

  };

const getShortName = (name:string) => {
    //Отримати ім'я та прізвище з ПІБ , у вигляді 'Ім'я ПРІЗВИЩЕ_КАПСОМ'
    const [surname, namePart] = name.split(' ');

    return `${namePart} ${surname.toUpperCase()}`;
}
const formatDate = (date:Date)=> {
    const months = [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year} р.`;
}

export const getVariables =async (initialData:{
    [key:string]:string 
}) => {
    const [directory] = await pool.query('SELECT * FROM directory_with_program WHERE id = ?', [initialData?.directory_id  ]);
    const typedDirectory = directory as Directory[];
    if(typedDirectory.length === 0){
        throw new Error('directory not found');
    }
    const curDirectory = typedDirectory[0];
    //Отримання поточного degree

    const [degree] = await pool.query('SELECT * FROM degree WHERE id = ?', [curDirectory.degree_id]);
    const typedDegree = degree as Degree[];
    if(typedDegree.length === 0){
        throw new Error('degree not found');
    }
    const currentDegree = typedDegree[0];


    const [subdivision] = await pool.query('SELECT * FROM subdivisions WHERE id = ?', [curDirectory.subdivision_id]);
    const typedSubdivision = subdivision as Subdivision[];
    if(typedSubdivision.length === 0){
        throw new Error('subdivision not found');
    }
    const currentSubdivision = typedSubdivision[0];

    const data:AdmissionData = {
        year: new Date().getFullYear().toString(),
        pib_vstup: initialData?.pib_vstup || '[ПІБ ВСТУПНИКА НЕ ЗНАЙДЕНО]',
        passport_vstup: initialData?.passport_vstup || '[ПАСПОРТ ВСТУПНИКА НЕ ЗНАЙДЕНО]',
        address_vstup: initialData?.address_vstup || '[АДРЕСА ВСТУПНИКА НЕ ЗНАЙДЕНО]',
        ipn_vstup: initialData?.ipn_vstup || '[ІПН ВСТУПНИКА НЕ ЗНАЙДЕНО]',
        phone_vstup: initialData?.phone_vstup || '[ТЕЛЕФОН ВСТУПНИКА НЕ ЗНАЙДЕНО]',

        pib_legal: initialData?.pib_legal || '',
        passport_legal: initialData?.passport_legal || '',
        address_legal: initialData?.address_legal || '',
        ipn_legal: initialData?.ipn_legal || '',
        phone_legal: initialData?.phone_legal || '',
        education_form: (initialData?.education_form === 'денна') ? 'денною' :
                        (initialData?.education_form === 'заочна') ? 'заочною' : '[ФОРМА НАВЧАННЯ НЕ ВКАЗАНА]',

        
        education_program: curDirectory.educationalProgram || '[ОСВІТНЯ ПРОГРАМА НЕ ЗНАЙДЕНА]',
        education_specialty: curDirectory.specialtyName || '[СПЕЦІАЛЬНІСТЬ НЕ ЗНАЙДЕНА]',
        degree: currentDegree.name || '[РІВЕНЬ НЕ ЗНАЙДЕНО]',
        accreditation: curDirectory.accreditation ? 'акредитована' : 'не акредитована',
        accreditation_term: curDirectory.accreditationPeriod?.toLocaleDateString('uk-UA') || ' ',
        credits: curDirectory.educationScope.toString() || '[КРЕДИТИ НЕ ВКАЗАНО]',
        
        financing: initialData?.financing === 'budget' ? 'державного бюджету' : 
                    (initialData?.financing === 'phys' || initialData?.financing === 'jur' ) ? "коштів фізичних та/або юридичних осіб"
                    : '[ФІНАНСУВАННЯ НЕ ВКАЗАНО]',

        pib_vstup_short: getShortName(initialData?.pib_vstup || '[ПІБ ВСТУПНИКА НЕ ЗНАЙДЕНО]'),
        pib_legal_short: getShortName(initialData?.pib_legal || ''),

        paidEntire: curDirectory.paidCostEntireCourse.toLocaleString('uk-UA') || '[СУМА ЗА ВСІ КУРСИ НЕ ВКАЗАНА]',
        paidEntireW: curDirectory.paidCostEntireCourseWritten || '[СУМА ЗА ВСІ КУРСИ НЕ ВКАЗАНА]',

        y1Paid: curDirectory.firstYearCost.toLocaleString('uk-UA') || '[СУМА ЗА ПЕРШИЙ РІК НЕ ВКАЗАНА]',
        y1PaidW: curDirectory.firstYearCostWritten || '[СУМА ЗА ПЕРШИЙ РІК НЕ ВКАЗАНА]',
        yy1: curDirectory.firstYearPeriod || '[ПЕРШИЙ РІК НЕ ВКАЗАНО]',

        y2Paid: curDirectory.secondYearCost.toLocaleString('uk-UA') || '[СУМА ЗА ДРУГИЙ РІК НЕ ВКАЗАНА]',
        y2PaidW: curDirectory.secondYearCostWritten || '[СУМА ЗА ДРУГИЙ РІК НЕ ВКАЗАНА]',
        yy2: curDirectory.secondYearPeriod || '[ДРУГИЙ РІК НЕ ВКАЗАНО]',

        y3Paid: curDirectory.thirdYearCost.toLocaleString('uk-UA') || '',
        y3PaidW: curDirectory.thirdYearCostWritten || '',
        yy3: curDirectory.thirdYearPeriod || '',

        y4Paid: curDirectory.fourthYearCost.toLocaleString('uk-UA') || '',
        y4PaidW: curDirectory.fourthYearCostWritten || '',
        yy4: curDirectory.fourthYearPeriod || '',

        //y1Due Pay - дата в такому форматі : 1 вересня 2024 р.
        y1DuePay: formatDate(curDirectory.firstYearPayDue) || '[ТЕРМІН ОПЛАТИ ЗА ПЕРШИЙ РІК НЕ ВКАЗАНО]',

        anualPayDue: initialData?.payment_term === "щороку" ? curDirectory.anualPayDue : "",
        semesterPayDue: initialData?.payment_term === "кожного семестру" ? curDirectory.semesterPayDue : "",


        dean: currentSubdivision.dean || '[ДЕКАНА НЕ ЗНАЙДЕНО]',


        jur_name: initialData?.jur_name || '[НАЗВА ЮРИДИЧНОЇ ОСОБИ НЕ ВКАЗАНА]',
        jur_pib: initialData?.jur_pib || '[ПІБ ПРЕДСТАВНИКА ЮРИДИЧНОЇ ОСОБИ НЕ ВКАЗАНО]',
        jur_status: initialData?.jur_status || '[ПОСАДА ПРЕДСТАВНИКА ЮРИДИЧНОЇ ОСОБИ НЕ ВКАЗАНА]',
        jur_pib_short: initialData?.jur_pib_short || '[ІП ПРЕДСТАВНИКА ЮРИДИЧНОЇ ОСОБИ НЕ ВКАЗАНО]',
        jur_req: initialData?.jur_req
        || '[ЮРИДИЧНІ ДАНІ НЕ ВКАЗАНІ]',


    }
    return data;
}


export const generateFile = async (variables: AdmissionData , fileName:string) => {
    const filePath = path.join(process.cwd(), "/src/files", fileName);


    const content = await fs.readFile(filePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.render(variables);

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    return buffer;
}


export const getOriginalFile = async (fileName:string) => {
    const filePath = path.join(process.cwd(), "/src/files", fileName);


    const content = await fs.readFile(filePath, 'binary');

    const buffer = Buffer.from(content, 'binary');
    return buffer;
}