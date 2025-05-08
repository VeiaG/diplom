import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { BetweenHorizonalStart, Download, FileText, FileUp, Users } from 'lucide-react'

const MenuItem = ({ title, icon, link,description }:{
  title: string,
  description?: string,
  icon: React.ReactNode
  link: string
}) => {
  return (
   <Link href={link} className='group h-full relative'>
     <Card className='flex flex-col items-center justify-start group-hover:shadow-xl group-hover:scale-[1.01] transition-all h-full' >
      <CardContent className='py-8 flex flex-col gap-0 items-start'>
        <div className='rounded-full bg-secondary p-4 aspect-square'>
        {icon}
        </div>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p>
          {description}
        </p>
      </CardContent>
    </Card>
   </Link>
  )
}

const AdminPage = () => {
  return (
    <div className='py-8 space-y-4 flex flex-col'>
     <h1 className="text-4xl font-bold">Адмін панель</h1>
     <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>
            Управління застосунком
            </CardTitle>
           
          </CardHeader>
          <CardContent className='grid grid-cols-3 gap-2 items-stretch'>
            <MenuItem 
              title="Користувачі"
              description="Управління користувачами застосунку"
              icon={<Users/>}
              link="/admin/users"
            />
            <MenuItem 
              title="Звіти"
              description="Управління звітами бази даних"
              icon={<Download/>}
              link="/admin/report"
            />
              
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
            БД та генерація
            </CardTitle>
           
          </CardHeader>
          <CardContent className='grid grid-cols-3 gap-2 items-stretch'>
              <MenuItem
                title="Редагувати таблиці"
                description="Редагування таблиць бази даних"
                icon={<BetweenHorizonalStart/>}
                link="/admin/tables"
              />
              <MenuItem
              title="Контракти"
              description="Управління шабонами контрактів"
              icon={<FileText/>}
              link="/admin/templates"
            />
            <MenuItem
              title="Імпорт даних"
              description="Імпорт та експорт даних в базу даних"
              icon={<FileUp/>}
              link="/admin/import"
            />
              
            </CardContent>
        </Card>
     </div>
    </div>
  )
}

export default AdminPage