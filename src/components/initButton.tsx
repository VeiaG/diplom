'use client';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const InitButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = async ()=>{
        setIsLoading(true)
        //initialize database here
        const req =await  fetch('/api/init', );
        if(req.status === 500){
            console.error('Failed to initialize database')
            return;
        }

        setIsLoading(false)
        //go to / 
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/')
    }
  return (
    <Button
        disabled={isLoading}
        onClick={handleClick}
    >
        {
            isLoading ? 'Ініціалізація...' : 'Ініціалізувати'
        }
    </Button>
  )
}

export default InitButton