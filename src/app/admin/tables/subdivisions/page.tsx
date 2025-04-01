'use client';
import React, { useEffect } from 'react'
import { DBDataTable } from '@/components/db-data-table';
import { columns } from './columns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, Plus } from 'lucide-react';
import { Subdivision } from '@/types/db';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
  
const AddSubdivision = ({
    setValues
}:{
    setValues:React.Dispatch<React.SetStateAction<Subdivision[]>>
}) => {
    const [isOpened,setIsOpened] = React.useState(false);
    const [name,setName] = React.useState('');
    const [dean,setDean] = React.useState('');
    const [degree,setDegree] = React.useState('');
    
    const handleCreate = ()=>{
        //check if all fields are filled
        if(!name || !dean || !degree){
            toast.error('Заповніть всі поля');
            return;
        }
        //send data to server
        toast.promise(fetch('/api/subdivisions',{
            method:'POST',
            body:JSON.stringify({name,dean,degree}),
        }).then(async (res)=>{
            if(res.ok){
                const data = await res.json();
                setValues((prev)=>[...prev,data.subdivision]);
                setIsOpened(false);
                //reset fields
                setName('');
                setDean('');
                setDegree('');
            }
            else{
                const error = await res.json();
                throw new Error(error.error || 'Помилка при створенні');
            }
        }),{
            loading:'Створення...',
            success:'Підрозділ створено',
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
                    Додати підрозділ
                </span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Новий підрозділ</DialogTitle>
            <DialogDescription>
                Заповніть дані про новий підрозділ
            </DialogDescription>
            </DialogHeader>
            <Label className='space-y-4'>
                <span>Назва підрозділу</span>
                <Textarea value={name} onChange={(e)=>setName(e.target.value)} className='w-full min-h-[64px] resize-none' />
            </Label>
            <Label className='space-y-4'>
                <span>Декан</span>
                <Input type="text" value={dean} onChange={(e)=>setDean(e.target.value)} className='w-full'/>
            </Label>
            <Label className='space-y-4'>
                <span>Ступінь</span>
                <Input type="text" value={degree} onChange={(e)=>setDegree(e.target.value)} className='w-full'/>
            </Label>
            <Button onClick={handleCreate}>
                Створити новий запис
            </Button>

        </DialogContent>
        </Dialog>

    )
}
const TablesPage = () => {
    const [subdivisions,setSubdivisions] = React.useState<Subdivision[]>([]);
    const [error,setError] = React.useState('');
    useEffect(()=>{
        // fetch subdivisions
        fetch('/api/subdivisions')
        .then(async (res)=>{
            if(res.ok){
                const data = await res.json();
                setSubdivisions(data.subdivisions);
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
      <h1 className='text-4xl font-bold'>Таблиця підрозділів</h1>
      {error && <span className='text-red-500'>{error}</span>}
        <AddSubdivision setValues={setSubdivisions}/>
        <DBDataTable columns={columns } data={subdivisions } tableName='subdivisions'
            setValues={setSubdivisions}
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