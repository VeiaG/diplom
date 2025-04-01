"use client"

import { CellContext, ColumnDef } from "@tanstack/react-table"
import { EducationalProgram } from "@/types/db"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { EditableTextCell } from "@/components/db-data-table"
import SubdivisionComboBox from "@/components/subdivision-combo-box"



export const columns: ColumnDef<EducationalProgram>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Обрати всі"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Обрати рядок"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id:'educationalProgram',
    header:"Освітня програма",
    accessorKey: 'educationalProgram',
    cell: (props) => (
      <EditableTextCell {...(props as CellContext<EducationalProgram, string>)} />
    ),
  },
  {
    id:'specialtyName',
    header:"Спеціальність",
    accessorKey: 'specialtyName',
    cell: (props) => (
      <EditableTextCell {...(props as CellContext<EducationalProgram, string>)} />
    ),
  },
  {
    id:'subdivision_id',
    header: 'Підрозділ',
    accessorKey: 'subdivision_id',
    cell: ({ row ,column, table}) => {
      return <SubdivisionComboBox 
        value={row.original.subdivision_id?.toString() || ''}
        setValue={(value) => {
          table.options.meta?.updateData(row.index, column.id, parseInt(value))
        }}

      />
    }
  },
  {
    id: "actions",
    enableHiding:false,
    enableSorting:false,
    cell: ({ row,table }) => { 
      return (
        <div className="flex gap-0.5 items-center text-red-500 cursor-pointer select-none"
        onClick={() => {
          toast.promise(fetch('/api/db',{
            method: 'DELETE',
            body: JSON.stringify({
              tableName: 'educational_program',
              ids: [row.original.id]
            })
          }).then(async (res) => {
            if(res.ok){
                // remove row from table
                table.options.meta?.setValues((prev) => {
                  return prev.filter((item) => item.id !== row.original.id);
                });
            }
            else{
               const error = await res.json();
                throw new Error(error.error || 'Помилка при видалені');
            }
          }),{
            loading: 'Видалення...',
            success: 'Рядок видалено',
            error(data) {
              return data.message
            },
          })
        }}
    >
        <Trash2 className="h-4" />
        Видалити
    </div>
      )
    },
  },
]
