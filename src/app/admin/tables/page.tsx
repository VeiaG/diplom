import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, GraduationCap, Landmark, School } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const TablesPage = () => {

  return (
    <div className='py-4 gap-4 h-screen flex flex-col justify-center items-center'>
      <h1 className='text-4xl font-bold text-center'>Редагування таблиць</h1>
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className='py-8 flex flex-col gap-4 items-center'>
            <Landmark className='h-16 w-16'/>
            <h1 className='text-2xl font-bold'>
              Навчальні підрозділи
            </h1>
            <Button asChild variant='outline' className='w-full' >
              <Link href="/admin/tables/subdivisions">
                Редагувати
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='py-8 flex flex-col gap-4 items-center'>
            <GraduationCap className='h-16 w-16'/>
            <h1 className='text-2xl font-bold'>
              Ступені вищої освіти
            </h1>
            <Button asChild variant='outline' className='w-full' >
              <Link href="/admin/tables/degrees">
                Редагувати
              </Link>
          </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='py-8 flex flex-col gap-4 items-center'>
            <BookOpen className='h-16 w-16'/>
            <h1 className='text-2xl font-bold'>
              Довідка
            </h1>
            <Button asChild variant='outline' className='w-full'>
                <Link href="/admin/tables/directory">
                    Редагувати
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='py-8 flex flex-col gap-4 items-center'>
            <School className='h-16 w-16'/>
            <h1 className='text-2xl font-bold'>
              Спеціальності та освітні програми
            </h1>
            <Button asChild variant='outline' className='w-full'>
                <Link href="/admin/tables/programs">
                    Редагувати
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
        
        
       
        <code>

        </code>
      </div>
  )
}

export default TablesPage