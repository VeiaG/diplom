"use client"

import { CellContext, ColumnDef } from "@tanstack/react-table"
import {  Directory } from "@/types/db"
import { toast } from "sonner"
import { Check, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { EditableTextCell } from "@/components/db-data-table"
import { JSX, useEffect, useRef, useState } from "react"
import { Select, SelectTrigger , SelectValue , SelectContent, SelectItem } from "@/components/ui/select"
import SubdivisionComboBox from "@/components/subdivision-combo-box"
import { DegreeComboBox } from "@/components/degree-combo-box"
import { DatePicker } from "@/components/date-picker"
import { ProgramsComboBox } from "@/components/educational-program-combo-box"

export const EditableTextAreaCell = <T extends object>({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<T, string>): JSX.Element => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    table.options.meta?.updateData(index, id, value);
    setIsEditing(false);
  };
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleEdit = ()=>{
    setIsEditing(true);
    setTimeout(()=>{
      inputRef.current?.focus();
    },0)
  }
  if(!isEditing){
    return (
      <div onDoubleClick={handleEdit} className=" select-none">
        {value}
      </div>
    )
  }
  return (
    <div className="flex gap-2 items-center flex-col h-auto">
      <textarea
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      className="w-full outline-none bg-transparent border-b border-foreground min-h-[80px] "
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          handleBlur();
        }
      }}
    />
      <Check onClick={handleBlur}
        className="h-5"
      />
    </div>
   
  );
};
export const EditableNumberCell = <T extends object>({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<T, number>): JSX.Element => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    table.options.meta?.updateData(index, id, value);
    setIsEditing(false);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleEdit = ()=>{
    setIsEditing(true);
    setTimeout(()=>{
      inputRef.current?.focus();
    },0)
  }
  if(!isEditing){
    return (
      <div onDoubleClick={handleEdit} className=" select-none">
        {value}
      </div>
    )
  }
  return (
    <div className="flex gap-2 items-center">
      <input
      type="number"
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(parseInt(e.target.value))}
      onBlur={handleBlur}
      className="w-full outline-none bg-transparent border-b border-foreground "
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          handleBlur();
        }
      }}
    />
      <Check onClick={handleBlur}
        className="h-5"
      />
    </div>
   
  );
};
export const columns: ColumnDef<Directory>[] = [
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
    id:'degree_id',
    header: 'Ступінь',
    accessorKey: 'degree_id',
    cell: ({ row ,column, table}) => {
      return <DegreeComboBox 
        value={row.original.degree_id?.toString() || ''}
        setValue={(value) => {
          table.options.meta?.updateData(row.index, column.id, parseInt(value))
        }}
      />
    }
  },
  {
    id:'educationalProgramID',
    header: 'Cпеціальність та освітня програма',
    accessorKey: 'educationalProgramID',
    cell: ({ row ,column, table}) => {
      return <ProgramsComboBox 
        value={row.original.educationalProgramID?.toString() || ''}
        setValue={(value) => {
          table.options.meta?.updateData(row.index, column.id, parseInt(value))
        }}
        filterBySubdivision={row.original.subdivision_id}
        disabled={row.original.subdivision_id === undefined}
        titleKey="educationalProgram"
      />
    }
  },
  // {
  //   id: "educationalProgram",
  //   header: "Освітня програма",
  //   accessorKey: "educationalProgram",
  //   cell: (props) => (
  //     <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />
  //   ),
  // },
  // {
  //   id: "specialtyName",
  //   header: "Спеціальність",
  //   accessorKey: "specialtyName",
  //   cell: (props) => (
  //     <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />
  //   ),
  // },
  {
    id: "educationForm",
    header: "Форма навчання",
    accessorKey: "educationForm",
    cell: ({ row , table , column }) => (
      <Select 
        value={row.original.educationForm}
        onValueChange={(value) => {
         table.options.meta?.updateData(row.index, column.id, value)
        }}
        >
        <SelectTrigger >
            <SelectValue placeholder="Оберіть форму навчання" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="денна">денна</SelectItem>
            <SelectItem value="заочна">заочна</SelectItem>
        </SelectContent>
        </Select>
    ),
  },
  {
    id: "accreditation",
    header: "Акредитація",
    accessorKey: "accreditation",
    cell: ({ row , table , column }) => (
      <Select 
        value={row.original.accreditation ? 'Так' : 'Ні'}
        onValueChange={(value) => {
         table.options.meta?.updateData(row.index, column.id, value === 'Так' ? true : false)
        }}
        >
        <SelectTrigger >
            <SelectValue placeholder="Оберіть акредитованість" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="Так">Так</SelectItem>
            <SelectItem value="Ні">Ні</SelectItem>
        </SelectContent>
        </Select>
    ),
  },
  {
    id: "accreditationPeriod",
    header: "Період акредитації",
    accessorKey: "accreditationPeriod",
    cell: ({ row,table,column }) => (
      row.original.accreditation ? (
        <DatePicker
          date={row.original.accreditationPeriod ? new Date(row.original.accreditationPeriod) : undefined}
          setDate={(date) => {
            table.options.meta?.updateData(row.index, column.id, date || null)
          }}
          />
        ) : ''
    ),
  },
  {
    id: "educationScope",
    header: "Обсяг освітньої програми",
    accessorKey: "educationScope",
    cell: (props) => <EditableNumberCell {...(props as CellContext<Directory, number>)} />,
  },
  {
    id: "studyPeriod",
    header: "Період навчання",
    accessorKey: "studyPeriod",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "paidCostEntireCourse",
    header: "Вартість всього курсу",
    accessorKey: "paidCostEntireCourse",
    cell: (props) => <EditableNumberCell {...(props as CellContext<Directory, number>)} />,
  },
  {
    id: "paidCostEntireCourseWritten",
    header: "Вартість всього курсу (прописом)",
    accessorKey: "paidCostEntireCourseWritten",
    cell: (props) => <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />,
  },
  //first year
  {
    id: "firstYearPeriod",
    header: "Перший рік (період)",
    accessorKey: "firstYearPeriod",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "firstYearCost",
    header: "Вартість першого року",
    accessorKey: "firstYearCost",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "firstYearCostWritten",
    header: "Вартість першого року (прописом)",
    accessorKey: "firstYearCostWritten",
    cell: (props) => <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />,
  },
  //second year
  {
    id: "secondYearPeriod",
    header: "Другий рік (період)",
    accessorKey: "secondYearPeriod",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "secondYearCost",
    header: "Вартість другого року",
    accessorKey: "secondYearCost",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "secondYearCostWritten",
    header: "Вартість другого року (прописом)",
    accessorKey: "secondYearCostWritten",
    cell: (props) => <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />,
  },
  //third year
  {
    id: "thirdYearPeriod",
    header: "Третій рік (період)",
    accessorKey: "thirdYearPeriod",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "thirdYearCost",
    header: "Вартість третього року",
    accessorKey: "thirdYearCost",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "thirdYearCostWritten",
    header: "Вартість третього року (прописом)",
    accessorKey: "thirdYearCostWritten",
    cell: (props) => <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />,
  },
  //fourth year
  {
    id: "fourthYearPeriod",
    header: "Четвертий рік (період)",
    accessorKey: "fourthYearPeriod",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "fourthYearCost",
    header: "Вартість четвертого року",
    accessorKey: "fourthYearCost",
    cell: (props) => <EditableTextCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "fourthYearCostWritten",
    header: "Вартість четвертого року (прописом)",
    accessorKey: "fourthYearCostWritten",
    cell: (props) => <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "firstYearPayDue",
    header: "Термін оплати першого року",
    accessorKey: "firstYearPayDue",
    cell: ({ row, table , column }) => (
      <DatePicker
          date={row.original.firstYearPayDue ? new Date(row.original.firstYearPayDue) : undefined}
          setDate={(date) => {
            table.options.meta?.updateData(row.index, column.id, date)
          }}
          />
    ),
  },
  {
    id: "anualPayDue",
    header: "Щорічний термін оплати",
    accessorKey: "anualPayDue",
    cell: (props) => <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />,
  },
  {
    id: "semesterPayDue",
    header: "Семестровий термін оплати",
    accessorKey: "semesterPayDue",
    cell: (props) => <EditableTextAreaCell {...(props as CellContext<Directory, string>)} />,
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
              tableName: 'directory',
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
  }
]
