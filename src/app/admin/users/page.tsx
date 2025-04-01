'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/password-input';
import SubdivisionComboBox from '@/components/subdivision-combo-box';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { columns } from './columns';
import { DBDataTable } from '@/components/db-data-table';
import { UserWithoutPassword } from '@/types/db';

const NewUserForm = ({setUsers}:{
  setUsers:React.Dispatch<React.SetStateAction<UserWithoutPassword[]>>
})=>{
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [subdivision, setSubdivision] = useState('');

  const handleAddUser = ()=>{
    if(!username || !email || !password || !role ){
      toast.error('Заповніть всі поля');
      return;
    }
    const data = {
      username,
      email,
      password,
      role,
      subdivision_id: parseInt(subdivision) || null
    }

    toast.promise(fetch('/api/users',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(async (res)=>{
      if(res.ok){
        const data = await res.json();
        setUsers((prev)=>[...prev,data.user]);
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('user');
        setSubdivision('');
      }
      else{
        const error = await res.json();
        throw new Error(error.error || 'Помилка додавання користувача');
      }
    }),{
      loading: 'Додаємо користувача...',
      success: 'Користувача успішно додано',
      error(data){
        return data.error || 'Помилка додавання користувача';
      }
    })


  }
  return (
    <Card>
      <CardHeader>
      <CardTitle>Додати нового користувача</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <Label className='space-y-2'>
          <span>Ім&apos;я</span>
          <Input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Сидоренко Микола"/>
        </Label>
        <Label className='space-y-2'>
          <span>Email</span>
          <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email@example.com'/>
        </Label>
        <Label className='space-y-2'>
          <span>Пароль</span> 
          <PasswordInput value={password} onChange={value=>setPassword(value)} placeholder='12345678'/>
        </Label>
        <Label className='space-y-2'>
          <span>Роль</span>
          <Select value={role} onValueChange={value=>setRole(value)}>
            <SelectTrigger >
              <SelectValue placeholder="Оберіть роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Користувач</SelectItem>
              <SelectItem value="admin">Адміністратор</SelectItem>
            </SelectContent>
          </Select>

        </Label>
        <Label className='space-y-2'>
          <span className='flex items-center gap-2'>Підрозділ
          <HoverCard>
            <HoverCardTrigger><Info className='h-4 w-4'/></HoverCardTrigger>
            <HoverCardContent>
              <span>
                Ця опція впливає лише на стандартний фільтр за підрозділом , користувачі всеодно можуть переглядати всі дані
              </span>
            </HoverCardContent>
          </HoverCard>

          </span>
          <SubdivisionComboBox value={subdivision} setValue={value=>setSubdivision(value)} className='w-full'/>
        </Label>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddUser}
        >Додати користувача</Button>
      </CardFooter>
    </Card>
  )
}

const UsersPage = () => {
  const [users,setUsers] = useState<UserWithoutPassword[]>([]);
  const [error,setError] = React.useState('');
    useEffect(()=>{
        // fetch subdivisions
        fetch('/api/users')
        .then(async (res)=>{
            if(res.ok){
                const data = await res.json();
                setUsers(data.users);
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
      <h1 className='text-4xl font-bold'>Управління користувачами</h1>
      {error && <span className='text-red-500'>{error}</span>}
      <DBDataTable columns={columns} data={users} tableName='users' 
        setValues={setUsers} 
      />
      <NewUserForm
        setUsers={setUsers}
      />

    </div>
  )
}

export default UsersPage