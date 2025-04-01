'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react'
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggler';
import Link from 'next/link';

const Navigation = () => {
    const {data:session} = useSession({
        required: true
    });
  return (
    <div className='w-full sticky top-0 bg-background py-4 border-b '>
        <div className="container mx-auto flex gap-2 items-center justify-between">
            <div>
                Привіт, <b>{session?.user?.username}</b>
            </div>
            <div className="flex gap-2 items-center">
                    <Button variant='link' size='sm' asChild>
                        <Link href='/docs'>Документація</Link>
                    </Button>
                {
                    session?.user.role === 'admin' && (
                        <Button variant='link' size='sm' asChild>
                            <Link href='/admin'>Адміністрування</Link>
                        </Button>
                    )
                }
            <ThemeToggle/>
            <Button onClick={() => signOut()} variant='outline' size="sm">
                <LogOut/>
            </Button>
            </div>
        </div>
    </div>
  )
}

export default Navigation