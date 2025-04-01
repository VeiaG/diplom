'use client';
import React, { useEffect } from 'react'
import { DBDataTable } from '@/components/db-data-table';
import { columns } from './columns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, Plus } from 'lucide-react';
import { Directory } from '@/types/db';


import { Button } from '@/components/ui/button';
import Link from 'next/link';
  

const TablesPage = () => {
    const [directory,setDirectory] = React.useState<Directory[]>([]);
    const [error,setError] = React.useState('');
    useEffect(()=>{
        // fetch subdivisions
        fetch('/api/directory')
        .then(async (res)=>{
            if(res.ok){
                const data = await res.json();
                setDirectory(data.directory);
            }
            else{
                const error = await res.json();
                setError(error.error || 'Помилка при завантаженні даних');
            }
        }).catch((err)=>{
            setError(err.message);
        })
    },[])
  return (
    <div className='py-4 space-y-4'>
      <h1 className='text-4xl font-bold'>Таблиця довідкової інформації ( спеціальності )</h1>
      {error && <span className='text-red-500'>{error}</span>}
        {/* <AddSubdivision setValues={setDirectory}/> */}
        <Button asChild variant='outline'>
            <Link href='/admin/tables/directory/add'>
                <Plus/>
                <span>
                    Додати новий запис
                </span>
            </Link>
        </Button>
        <DBDataTable columns={columns } data={directory } tableName='directory'
            setValues={setDirectory}
        />
        <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Увага</AlertTitle>
            <AlertDescription>
                Після видалення записів , пов&apos;язані рядки в інших таблицях стануть пустими , що може призвести до помилок. <br/>
                Наприклад збережені дані про студентів можуть вказувати на неіснуючий запис про довідку.
            </AlertDescription>
        </Alert>

      </div>
  )
}

export default TablesPage