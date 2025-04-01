import { Column, Table } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, EyeOff, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string,
  table: Table<TData>
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  table
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }
  const moveColumnLeft = () => {
    // Get only visible columns
    const visibleLeafColumns = table.getVisibleLeafColumns()
    const currentVisibleIndex = visibleLeafColumns.findIndex((c) => c.id === column.id)

    if (currentVisibleIndex > 0) {
      const targetColumn = visibleLeafColumns[currentVisibleIndex - 1]
      table.setColumnOrder((old) => {
        const newOrder = [...old]
        const currentPosition = newOrder.indexOf(column.id)
        const targetPosition = newOrder.indexOf(targetColumn.id)

        // Remove current column and insert it at target position
        newOrder.splice(currentPosition, 1)
        newOrder.splice(targetPosition, 0, column.id)

        return newOrder
      })
    }
  }

  const moveColumnRight = () => {
    // Get only visible columns
    const visibleLeafColumns = table.getVisibleLeafColumns()
    const currentVisibleIndex = visibleLeafColumns.findIndex((c) => c.id === column.id)

    if (currentVisibleIndex < visibleLeafColumns.length - 1) {
      const targetColumn = visibleLeafColumns[currentVisibleIndex + 1]
      table.setColumnOrder((old) => {
        const newOrder = [...old]
        const currentPosition = newOrder.indexOf(column.id)
        const targetPosition = newOrder.indexOf(targetColumn.id)

        // Remove current column and insert it at target position
        newOrder.splice(currentPosition, 1)
        newOrder.splice(targetPosition, 0, column.id)

        return newOrder
      })
    }
  }
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
        
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Зростання
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Спадання
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <X className="h-3.5 w-3.5 text-muted-foreground/70" />
            Звичайний
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            Приховати
          </DropdownMenuItem>
          <div className="flex gap-2 justify-between p-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={moveColumnLeft}
              disabled={table.getVisibleLeafColumns().findIndex((c) => c.id === column.id) === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={moveColumnRight}
              disabled={
                table.getVisibleLeafColumns().findIndex((c) => c.id === column.id) ===
                table.getVisibleLeafColumns().length - 1
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
