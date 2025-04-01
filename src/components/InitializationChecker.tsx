//test if db is initialized , using isInitialized function from intiDB.tsx
//if not, redirect to /init

import { isInitialized } from "@/lib/initDB"
import { redirect } from "next/navigation";

const InitializationChecker = async () => {
    const isInited = await isInitialized();
    console.log('Database is initialized:', isInited)

    if (!isInited) {
        redirect('/init')
    }
    return <>
    </>
}   
export default InitializationChecker