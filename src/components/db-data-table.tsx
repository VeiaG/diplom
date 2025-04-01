"use client"

import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { JSX, useCallback, useEffect, useRef, useState } from "react"
import { Check, Trash2 } from "lucide-react"
import { DataTablePagination } from "./data-table-pagination"

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
      updateData: (rowIndex: number, columnId: string, value: unknown) => void,
      setValues: React.Dispatch<React.SetStateAction<TData[]>>
    }
  }

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    tableName:string,
    setValues: React.Dispatch<React.SetStateAction<TData[]>>
}
function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

export function DBDataTable<TData, TValue>({
  columns,
  data,
  tableName,
  setValues,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({})
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    initialState:{
      pagination:{
        pageSize:8,
      },
    },
    state:{
        rowSelection
    },
    meta: {
        updateData: async (rowIndex, columnId, value) => {
          const row = data[rowIndex];
          if (!row) return;

          //check if value is the same
          //@ts-expect-error : proper checking , idk how to do types for that
          if (row[columnId] === value) return ;
          skipAutoResetPageIndex();
          toast.promise(fetch('/api/db', {
            method: 'PUT',
            //@ts-expect-error : id is always defined
            body: JSON.stringify({tableName, id: row.id, data: {[columnId]: value}}),
            headers: {
              'Content-Type': 'application/json'
            }
          } 
          ).then(async (res) => {
            if(res.ok){
                setValues((prev) => {
                    return prev.map((item, index) => {
                        if (index === rowIndex) {
                          //if columndID is 'accreditation' and value is false, then set accreditationPeriod to NULL
                            if (columnId === 'accreditation' && !value) {
                              return {
                                  ...item,
                                  [columnId]: value,
                                  accreditationPeriod: null
                              }
                          }
                            return {
                                ...item,
                                [columnId]: value
                            }
                        }
                        return item;
                    })
                });
            }
            else{
               const error = await res.json();
              throw new Error(error.error || 'Помилка при збережені змін');
            }
          }),{
            loading: 'Збереження змін...',
            success: 'Зміни збережено',
            error(data) {
              return data.message
            },
          })
        },
        setValues
      },
  })

  return (
    <>
    <div className="rounded-md border relative">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}
                    className=" text-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Немає записів
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex w-full gap-4 items-center text-sm text-muted-foreground p-4">
        {table.getFilteredSelectedRowModel().rows.length} з{" "}
        {table.getFilteredRowModel().rows.length} рядків обрано.
        <div className="flex gap-0.5 items-center text-red-500 cursor-pointer select-none"
            onClick={() => {
                //@ts-expect-error : id is always defined
                const idsForDelete = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);
                if(!idsForDelete.length) return;
                toast.promise(fetch('/api/db',{
                    method: 'DELETE',
                    body: JSON.stringify({
                      tableName: tableName,
                      ids: idsForDelete
                    })
                  }).then(async (res) => {
                    if(res.ok){
                        // remove row from table
                        table.options.meta?.setValues((prev) => {
                            //@ts-expect-error : id is always defined
                            return prev.filter((item) => !idsForDelete.includes(item.id));
                        });
                        // clear selection
                        setRowSelection({});
                    }
                    else{
                       const error = await res.json();
                        throw new Error(error.error || 'Помилка при видалені');
                    }
                  }),{
                    loading: 'Видалення рядків...',
                    success: 'Рядки видалено',
                    error(data) {
                      return data.message
                    },
                  })
            }}
        >
            <Trash2 className="h-4" />
            Видалити
        </div>
      </div>
      
    </div>
    <DataTablePagination table={table} />
    </>
  )
}


export const EditableTextCell = <T extends object>({
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
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
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