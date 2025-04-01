import InitButton from '@/components/initButton';
import { isInitialized } from '@/lib/initDB'
import { redirect } from 'next/navigation';
import React from 'react'

const InitPage = async () => {
    const isInit = await isInitialized();
    if(isInit){
        redirect('/')
    }
  return (
    <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center">База даних не ініціалізована</h1>
        <InitButton/>
    </div>
  )
}

export default InitPage