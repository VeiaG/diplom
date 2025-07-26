export type User ={
    id: number,
    username: string,
    email: string,
    password: string,
    subdivision_id?: number,
    role: 'admin' | 'user'
}
export type UserWithoutPassword = Omit<User, 'password'>;

export type Subdivision = {
    id: number,
    name: string,
    dean:string,
    degree: string,
}
export type EducationalProgram = {
    id?:number,
    subdivision_id:number, // FK to subdivisions
    educationalProgram:string,
    specialtyName:string,
}

export type Directory = {
    id?: number, //id is optional , because it's AUTO_INCREMENT , so we don't need to specify it when inserting
    subdivision_id?: number,//foreign key to subdivisions
    degree_id?: number,//foreign key to degrees
    educationForm: 'денна' | 'заочна', //enum
    educationalProgramID?: number ,//foreign key to educationalPrograms
    // we can assume that we have that fields , as we should ALWAYS propagate them from ID
    educationalProgram?:string,
    specialtyName?:string,

    accreditation: boolean ,// is the program accredited
    accreditationPeriod?: Date ,// when the accreditation expires
    educationScope: number , // Обсяг  освітньої  програми

    studyPeriod: string , // e.g. "2024-2028" etc
    paidCostEntireCourse: number , // cost of the entire course
    paidCostEntireCourseWritten: string , // cost of the entire course in words

    firstYearPeriod: string , // e.g. "2024-2025" etc
    firstYearCost: string | number , // cost of the first year
    firstYearCostWritten: string , // cost of the first year in words

    secondYearPeriod: string , // e.g. "2025-2026" etc
    secondYearCost: string | number , // cost of the second year
    secondYearCostWritten: string , // cost of the second year in words

    thirdYearPeriod: string , // e.g. "2026-2027" etc
    thirdYearCost: string | number , // cost of the third year
    thirdYearCostWritten: string , // cost of the third year in words

    fourthYearPeriod: string , // e.g. "2027-2028" etc
    fourthYearCost: string | number , // cost of the fourth year
    fourthYearCostWritten: string , // cost of the fourth year in words

    firstYearPayDue: Date // when the first year payment is due

    anualPayDue: string // when the anual payment is due  ( "до 01.09 кожного поточного н.р.")
    semesterPayDue: string // when the semester payment is due ( "кожного семестру до 01.09 та 01.02 поточного н.р.")
}
export type Degree = {
    id: number,
    name: string,
}
export type SavedData = {
    id?:string //autoincrement
    user_id?:string //saved by user
    data:string //json string with data
    created_at:Date //date of creation
    updated_at:Date //date of last update
}

type VstupFormData = {
    subdivision: string, // id of the subdivision
    pib_vstup: string,
    passport_vstup: string,
    address_vstup: string,
    ipn_vstup: string,
    phone_vstup: string,
    pib_legal: string,
    passport_legal: string,
    address_legal: string,
    ipn_legal: string,
    phone_legal: string,
    degree: string,
    education_form: string,
    directory_id: string,
}
type VstupJurData = VstupFormData & {
    financing: 'jur',
    payment_term: string,
    jur_name: string,
    jur_pib: string,
    jur_pos: string,
    jur_id: string,
    jur_phone: string,
    jur_email: string,
    jur_account: string,
    jur_bank_code: string,
    jur_pib_short: string,
    jur_status: string,
    jur_req: string,
}
type VstupPhysData = VstupFormData & {
    financing: 'phys',
    payment_term: string,
}
type VstupBudgetData = VstupFormData & {
    financing: 'budget',
}
export type VstupData = VstupJurData | VstupPhysData | VstupBudgetData;

type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type PrettifiedVstupData = Prettify<VstupData>;

export type AllVstupData = Omit<VstupJurData,'financing'> & Omit<VstupPhysData,'financing'> & Omit<VstupBudgetData,'financing'> & {financing: string};



export type NormalizedSavedData = {
    id?: string,
    user?: Omit<User, 'password'>,
    data: VstupData,
    created_at: Date,
    updated_at: Date,
    populated:{
        subdivision?: Subdivision,
        degree?: Degree,
        directory?: Directory
    }
}