'use client';
import React, { useEffect } from 'react'
import { DBDataTable } from '@/components/db-data-table';
import { columns } from './columns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, Plus } from 'lucide-react';
import { Degree } from '@/types/db';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
  
const AddDegree= ({
    setValues
}:{
    setValues:React.Dispatch<React.SetStateAction<Degree[]>>
}) => {
    const [isOpened,setIsOpened] = React.useState(false);
    const [name,setName] = React.useState('');
    
    const handleCreate = ()=>{
        //check if all fields are filled
        if(!name){
            toast.error('Заповніть всі поля');
            return;
        }
        //send data to server
        toast.promise(fetch('/api/degrees',{
            method:'POST',
            body:JSON.stringify({name}),
        }).then(async (res)=>{
            if(res.ok){
                const data = await res.json();
                setValues((prev)=>[...prev,data.degree]);
                setIsOpened(false);
                //reset fields
                setName('');
            }
            else{
                const error = await res.json();
                throw new Error(error.error || 'Помилка при створенні');
            }
        }),{
            loading:'Створення...',
            success:'Ступінь створено',
            error(data){
                return data.message;
            }
        })
    }
    return (
        <Dialog open={isOpened} onOpenChange={setIsOpened}>
        <DialogTrigger asChild>
            <Button variant='outline'>
                <Plus/>
                <span>
                    Додати ступінь
                </span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Новий ступінь</DialogTitle>
            <DialogDescription>
                Введіть ім&apos;я нового ступеня
            </DialogDescription>
            </DialogHeader>
            <Label className='space-y-4'>
                <span>Назва підрозділу</span>
                <Input value={name} onChange={(e)=>setName(e.target.value)}  />
            </Label>
            
            <Button onClick={handleCreate}>
                Створити новий запис
            </Button>

        </DialogContent>
        </Dialog>

    )
}
const TablesPage = () => {
    const [degrees,setDegrees] = React.useState<Degree[]>([]);
    const [error,setError] = React.useState('');
    useEffect(()=>{
        // fetch subdivisions
        fetch('/api/degrees')
        .then(async (res)=>{
            if(res.ok){
                const data = await res.json();
                setDegrees(data.degrees);
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
      <h1 className='text-4xl font-bold'>Таблиця ступеней вищої освіти</h1>
      {error && <span className='text-red-500'>{error}</span>}
        <AddDegree setValues={setDegrees}/>
        <DBDataTable columns={columns } data={degrees } tableName='degree'
            setValues={setDegrees}
        />
        <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Увага</AlertTitle>
            <AlertDescription>
                Після видалення записів , пов&apos;язані рядки в інших таблицях стануть пустими , що може призвести до помилок. <br/>
            </AlertDescription>
        </Alert>

      </div>
  )
}

export default TablesPage