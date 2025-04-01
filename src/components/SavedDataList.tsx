'use client';
import { NormalizedSavedData} from "@/types/db";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { columns } from "@/app/columns";

  


// @ts-expect-error : can't specify types for fetcher
const fetcher = (...args) => fetch(...args).then(res => {
    if (!res.ok) {
        return res.json().then(data => {
            // Якщо є помилка в відповіді API, кидаємо її
            throw new Error(data.error || 'Unknown error');
        });
    }
    return res.json();
});


const SavedDataList = () => {
    const { data, error, isLoading } = useSWR<NormalizedSavedData[]>('/api/savedata', fetcher);
  
    
    return (
    <div className="container mx-auto py-10">

        {
            error && <p className="text-red-500 font-bold">Error: {error.message}</p>
        }
        {
            <DataTable columns={columns} data={data || []} isLoading={isLoading}/>
        }
    </div>
  )
}

export default SavedDataList