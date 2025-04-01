"use client"

import { DataTableColumnHeader } from "@/components/column-header"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NormalizedSavedData } from "@/types/db"
import { saveAs } from "file-saver"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSWRConfig } from "swr"

const financingMap:{
  [key: string]: string
} = {
  budget: 'Бюджет',
  phys: 'Контракт фіз. особа',
  jur: 'Контракт юр. особа',
}
const financingBadgeMap: { [key: string]: "secondary" | "outline" | "default" } = {
  budget: 'default',
  phys: 'outline',
  jur: 'secondary',
}



export const columnsMap:{
  [key: string]: string
}= {
  pib_vstup: 'ПІБ вступника',
  pib_legal: 'ПІБ представника',
  financing: 'Фінансування',
  subdivision: 'Підрозділ',
  specialty: 'Спеціальність',
  date: 'Дата створення',
  degree:'Ступінь',
  date_updated:'Дата оновлення',
}

export const columns: ColumnDef<NormalizedSavedData>[] = [
  {
    id:'pib_vstup',
    accessorKey: "data.pib_vstup",
    header: ({ column ,table}) => (
      <DataTableColumnHeader column={column} title="ПІБ вступника" table={table} />
    ),

  },
  {
    id:'pib_legal',
    accessorKey: "data.pib_legal",
    header: ({ column ,table}) => (
      <DataTableColumnHeader column={column} title="ПІБ представника" table={table} />
    ),
  },
  {
    id:"subdivision",
    accessorKey: "populated.subdivision.name",
    header: ({ column ,table}) => (
      <DataTableColumnHeader column={column} title="Підрозділ" table={table} />
    ),
  },
  {
    id:"specialty",
    accessorKey:  "populated.directory.specialtyName",
    header: ({ column,table}) => (
      <DataTableColumnHeader column={column} title="Спеціальність" table={table}/>
    ),
  },
  {
    id:"financing",
    accessorKey: "populated.data.financing",
    header: ({ column,table }) => (
      <DataTableColumnHeader column={column} title="Фінансування" table={table}/>
    ),
    filterFn: (row, columnId, filterValue) => {
      return row.original.data.financing === filterValue
    },
    cell: ({ row }) => {
      return (
        <Badge variant={
          financingBadgeMap[row.original.data.financing as keyof typeof financingBadgeMap]
        }>{financingMap[row.original.data.financing]}</Badge>
      )
    }
  },
  {
    id:"degree",
    accessorKey: "populated.degree.name",
    header: ({ column , table }) => (
      <DataTableColumnHeader column={column} title="Ступінь" table={table} />
    ),
    
  },
  {
    id:"date",
    accessorKey:"created_at",
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} title="Дата створення" table={table} />
    ),
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString('uk-UA')
    }
  },
  {
    id:"date_updated",
    accessorKey:"created_at",
    header: ({ column,table }) => (
      <DataTableColumnHeader column={column} title="Дата оновлення" table={table} />
    ),
    cell: ({ row }) => {
      return new Date(row.original.updated_at).toLocaleDateString('uk-UA')
    }
  },
  {
    id: "actions",
    enableHiding:false,
    enableSorting:false,
    cell: ({ row }) => { 
      const endPrefix = row.original?.data.pib_vstup?.toString()?.replace(' ', '_');
      const handleDownload = (route:string,fileName:string) => {
              fetch(`/api/generate/${route}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(row.original.data),
              })
              .then(res => {
                  if (!res.ok) throw new Error('Помилка завантаження');
                  return res.blob();
              })
              .then(blob => {
                  
                  saveAs(blob, `${endPrefix}${fileName}`);
              })
              .catch(err => console.error(err));
          };
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router= useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { mutate } = useSWRConfig()


      const handleDelete =async ()=>{
        toast.promise(
          fetch(`/api/savedata/${row.original.id}`, {
            method: 'DELETE',
          }).then((res)=>{
            if(res.ok){
              mutate('/api/savedata');// Оновлюємо дані в таблиці
              return 
            }
            throw new Error('Помилка видалення')
          }),
          {
            loading: 'Видалення...',
            success: 'Дані видалено',
            error: 'Помилка видалення',
          });
        
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Відкрити меню опцій</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Дії</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={()=>{
                handleDownload('', `_Договори_${new Date().getFullYear()}.zip`)
              }}
            >
              Завантажити контракти
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={()=>{
                router.push(`/add?id=${row.original.id}`)
              }}
            >Редагувати</DropdownMenuItem>
            <DropdownMenuItem
              onClick={()=>{
                handleDelete()
              }}
            >Видалити</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
