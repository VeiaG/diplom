"use client"
 
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table"
 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { columnsMap } from "@/app/columns"
import SubdivisionComboBox from "./subdivision-combo-box"
import EducationalProgramComboBox from "./educational-combo-box"
import { useDirectory } from "@/hooks/useDirectory"
import { useSubdivisions } from "@/hooks/useSubdivisions"
import Link from "next/link"
import { Eye, Plus, Search } from "lucide-react"

import { Label } from "./ui/label"
import { DataTablePagination } from "./data-table-pagination"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { FinancingCombobox } from "./financing-combo-box"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
}
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnOrder, setColumnOrder] = React.useState<string[]>(columns.map(c => c.id!));

  const {data:session} = useSession({
          required: true
      });

  

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    autoResetPageIndex:false,
    initialState:{
      pagination:{
        pageSize:8,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
    },
  })
  const [filtersOpened, setFiltersOpened] = React.useState(false)


  const {directory,isLoading:directoryLoading,error} = useDirectory();
  const {subdivisions} = useSubdivisions();
  //remove duplicates from directory, where specialtyName is the same
  const filteredDirectory  = directory?.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.specialtyName === item.specialtyName
    ))
  ).filter((item)=>{
    const itemSubdivisionName = subdivisions?.find((sub)=>sub.id === item.subdivision_id)?.name;
    if(!table.getColumn("subdivision")?.getFilterValue()){
      return true;
    }
    if((table.getColumn("subdivision")?.getFilterValue() as string) !== "" && itemSubdivisionName !== table.getColumn("subdivision")?.getFilterValue()){
      return false;
    }
    return true;
  })

  // update columns filter by subdivision
  React.useEffect(()=>{
      const subdivisionColumn = table.getColumn("subdivision");
      if(subdivisionColumn){
        const subdivisionValue = subdivisions?.find((sub)=>sub.id === session?.user?.subdivision_id)?.name;
        subdivisionColumn.setFilterValue(subdivisionValue ?? '');
        
      }
  },[session, table , subdivisions])

  //retrive column filters and orders from local storage, once on mount
  React.useEffect(()=>{
    const columnOrder = localStorage.getItem('columnOrder');
    if(columnOrder){
      setColumnOrder(JSON.parse(columnOrder));
    }
    const columnVisibility = localStorage.getItem('columnVisibility');
    if(columnVisibility){
      setColumnVisibility(JSON.parse(columnVisibility));
    }
  },[])

  //save column filters and orders to local storage , and column visibility
  React.useEffect(()=>{
    localStorage.setItem('columnOrder',JSON.stringify(columnOrder));
    localStorage.setItem('columnVisibility',JSON.stringify(columnVisibility));
  },[columnFilters,columnOrder,columnVisibility])

  

  return (
    <div >
      <div className="flex items-center py-4 gap-2">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4" />
        <Input
          placeholder="Пошук по імені вступника"
          value={(table.getColumn("pib_vstup")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("pib_vstup")?.setFilterValue(event.target.value)
          }
          className="w-full pl-8"
        />
        </div>
        
        <Button variant="outline" onClick={() => {
          table.getColumn("pib_vstup")?.setFilterValue("")
          table.getColumn("subdivision")?.setFilterValue("")
          table.getColumn("specialty")?.setFilterValue("")
          table.getColumn("financing")?.setFilterValue("")
        }} className="ml-auto">
            Скинути фільтри
        </Button>
        <Button variant="outline" onClick={() => {
          setFiltersOpened(!filtersOpened)
        }} >
           Фільтри
          </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Eye/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .sort((a, b) => {
                //sort by order
                return columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id);
              })
              .map((column) => {
                // console.log(column);
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnsMap[column.id] || column.id} 
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
       
        <Button asChild variant="outline" size="icon" className="shrink-0">
              <Link href="/add">
                <Plus/>
              </Link>
        </Button>
      </div>
      <div className={cn("grid  overflow-hidden transition-all duration-300 ", !filtersOpened ? "grid-rows-animate-height-closed" : "grid-rows-animate-height-open")}>
       <div className="min-h-0 ">
       <div className="flex gap-2 min-h-0 pb-2">
             <Label className="space-y-2">
              <span>Підрозділ</span>
              <SubdivisionComboBox
                  value={(table.getColumn("subdivision")?.getFilterValue() as string) ?? ""}
                  setValue={(value) =>{
                    table.getColumn('specialty')?.setFilterValue('')
                    table.getColumn("subdivision")?.setFilterValue(value)
                  }
                  }
                  accessorKey="name"
                  className="min-w-[256px]"
                />
             </Label>
              <Label className="space-y-2">
                <span>
                  Спеціальність
                </span>
                <EducationalProgramComboBox 
                  accessorKey="specialtyName"
                  values={filteredDirectory}
                  value={(table.getColumn("specialty")?.getFilterValue() as string) ?? ""}
                  setValue={(value) =>
                    table.getColumn("specialty")?.setFilterValue(value)
                  }
                  disabled={directoryLoading || error}
                  className="min-w-[256px]"
                  placeholder="Оберіть спеціальність..."
                  titleKey="specialtyName"
                  descriptionKey="educationalProgram"
                />
              </Label>
              <Label className="space-y-2">
                <span>
                  Фінансування
                </span>
                <FinancingCombobox 
                  value={
                    (table.getColumn("financing")?.getFilterValue() as string) ?? ""
                  }
                  className="min-w-[256px]"
                  onValueChange={(value) =>
                    table.getColumn("financing")?.setFilterValue(value)
                  }
                />
              </Label>
            </div>
       </div>
      </div>
      {/* <div className="flex flex-col gap-2">
        {
           table.getAllColumns()
           .filter((column)=>column.getIsVisible())
           .sort((a, b) => {
            //sort by order
            return columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id);
          })
           .map((column,index) => {
              return <div key={column.id} className="rounded-md border p-2 flex items-center justify-between">
                <div>{columnsMap[column.id] || column.id} </div>
                <div className="flex flex-col gap-2 *:border">
                  <button
                    onClick={()=>{

                      reorderColumn(column.id,table.getAllColumns()[index-1]?.id)
                    }}
                  >up</button>
                  <button
                    onClick={()=>{
                      reorderColumn(column.id,table.getAllColumns()[index+1]?.id)
                    }}
                  >down</button>
                </div>
              </div>
           })
        }
      </div> */}
      <div className="rounded-md border">
      <Table >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
          {
            isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Завантаження...
                </TableCell>
              </TableRow>
            )
          }
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
          ) : !isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Немає даних
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
