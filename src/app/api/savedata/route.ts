
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { AllVstupData, Degree, Directory, NormalizedSavedData, SavedData, Subdivision, User, VstupData } from "@/types/db";
import { FieldPacket } from "mysql2";
import { NextResponse } from "next/server";
type UserWithoutPassword = Omit<User, 'password'>;

const getUserByID = async (id?: string):Promise<UserWithoutPassword | undefined> => {
    if(!id){
        return;
    }
    const [result] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [id]) as [UserWithoutPassword[], FieldPacket[]];
    const user = result[0];
    return user;
}
const getSubdivisionByID = async (id?: string):Promise<Subdivision | undefined> => {
    if(!id){
        return;
    }
    const [result] = await pool.query('SELECT * FROM subdivisions WHERE id = ?', [id]) as [Subdivision[], FieldPacket[]];
    const subdivision = result[0];
    return subdivision;
}
const getDirectoryByID = async (id?: string):Promise<Directory | undefined> => {
    if(!id){
        return;
    }
    const [result] = await pool.query('SELECT * FROM directory_with_program WHERE id = ?', [id]) as [Directory[], FieldPacket[]];
    const directory = result[0];
    return directory;
}

const getDegreeByID = async (id?: string):Promise<Degree | undefined> => {
    if(!id){
        return;
    }
    const [result] = await pool.query('SELECT * FROM degree WHERE id = ?', [id]) as [Degree[], FieldPacket[]];
    const degree = result[0];
    return degree;
}


export const GET = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        //get all saved data
        const [result] = await pool.query('SELECT * FROM saved_data');

        const typedResult = result as SavedData[];

        const data:NormalizedSavedData[] = await Promise.all(typedResult.map(async (row)=>{
            const parsedObject:VstupData = JSON.parse(row.data);

            //convertion to unknown and then to string , because we don't need to create separate type , not populated (we woudn't use it in other places)
            const populatedSubdivision = await getSubdivisionByID(parsedObject.subdivision as unknown as string) ;

            const populatedDegree = await getDegreeByID(parsedObject.degree as unknown as string) ;

            const populatedDirectory = await getDirectoryByID(parsedObject.directory_id as unknown as string) ;


            return {
                id: row.id,
                user_id: await getUserByID(row?.user_id),
                data:parsedObject,
                created_at: row.created_at,
                updated_at: row.updated_at,
                populated:{
                    subdivision: populatedSubdivision,
                    degree: populatedDegree,
                    directory: populatedDirectory
                }
            }

        }));

        return NextResponse.json(data);
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }
})

export const POST = auth( async (req) => {
    try{
        if(!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userID = req.auth.user.id;
        if(!userID){
            return NextResponse.json({error: 'User ID is missing'}, {status: 400});
        }

        const object:{
            data:AllVstupData,
            id:string | null
        } = await req.json();
        const data:AllVstupData = object.data;
        if(!data){
            return NextResponse.json({error: 'Data is missing'}, {status: 400});
        }
        if (!['jur', 'phys', 'budget'].includes(data.financing)) {
            return NextResponse.json({ error: 'Invalid financing type' }, { status: 400 });
        }

        //removing unnecessary fields from data
        const cleanedData = {
            subdivision: data.subdivision,
            pib_vstup: data.pib_vstup,
            passport_vstup: data.passport_vstup,
            address_vstup: data.address_vstup,
            ipn_vstup: data.ipn_vstup,
            phone_vstup: data.phone_vstup,
            pib_legal: data.pib_legal,
            passport_legal: data.passport_legal,
            address_legal: data.address_legal,
            ipn_legal: data.ipn_legal,
            phone_legal: data.phone_legal,
            degree: data.degree,
            education_form: data.education_form,
            directory_id: data.directory_id,

            financing : data.financing as 'jur' | 'phys' | 'budget',
            payment_term: data.financing !== 'budget' ? data.payment_term : undefined,
            jur_name: data.financing === 'jur' ? data.jur_name : undefined,
            jur_pib: data.financing === 'jur' ? data.jur_pib : undefined,
            jur_pos: data.financing === 'jur' ? data.jur_pos : undefined,
            jur_id: data.financing === 'jur' ? data.jur_id : undefined,
            jur_phone: data.financing === 'jur' ? data.jur_phone : undefined,
            jur_email: data.financing === 'jur' ? data.jur_email : undefined,
            jur_account: data.financing === 'jur' ? data.jur_account : undefined,
            jur_bank_code: data.financing === 'jur' ? data.jur_bank_code : undefined,
            jur_status: data.financing === 'jur' ? data.jur_status : undefined,
        //     jur_name: initialData?.jur_name || '[jur_not_found]',
        // jur_pib: initialData?.jur_pib || '[jur_not_found]',
        // jur_pib_short: getShortName(initialData?.jur_pib || '[jur_not_found]'),
        // jur_pos: initialData?.jur_pos || '[jur_not_found]',
        // jur_id: initialData?.jur_id || '[jur_not_found]',
        // jur_phone: initialData?.jur_phone || '[jur_not_found]',
        // jur_email: initialData?.jur_email || '[jur_not_found]',
        // jur_account: initialData?.jur_account || '[jur_not_found]',
        // jur_bank_code: initialData?.jur_bank_code || '[jur_not_found]',
        // jur_status: initialData?.jur_status || '[jur_not_found]',

        }

        const saveJSON = JSON.stringify(cleanedData);
        const objectToSave:SavedData = {
            data: saveJSON,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: userID
        }
        
        if(object.id){
            await pool.query('UPDATE saved_data SET ? WHERE id = ?', [objectToSave, object.id]);
        }
        else{
            await pool.query('INSERT INTO saved_data SET ?', objectToSave);
        }
        
        return NextResponse.json({message:'success'});
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: (err as Error).message || (err as { code: string })?.code }, { status: 500 });
    }

})