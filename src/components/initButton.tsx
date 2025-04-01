'use client';
import React, { useState } from 'react'
import { Button } from './ui/button';

const InitButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async ()=>{
        setIsLoading(true)
        //initialize database here
        const req =await  fetch('/api/init', );
        if(req.status === 500){
            console.error('Failed to initialize database')
            return;
        }

        setIsLoading(false)
        window.location.reload();
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