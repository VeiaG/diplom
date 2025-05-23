"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const financingOptions = [
  {
    value: "budget",
    label: "Бюджет",
  },
  {
    value: "phys",
    label: "Контракт фіз. особа",
  },
  {
    value: "jur",
    label: "Контракт юр. особа",
  },
]

interface FinancingComboboxProps {
  value: string
  onValueChange: (value: string) => void,
  className?: string
}

export function FinancingCombobox({ value, onValueChange,className }: FinancingComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between", className)}>
          {value ? financingOptions.find((option) => option.value === value)?.label : "Оберіть фінансування"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Пошук фінансування..." />
          <CommandList>
            <CommandEmpty>Нічого не знайдено.</CommandEmpty>
            <CommandGroup>
              {/* Add option to clear the filter */}
              {financingOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value
                        ? ""
                        : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

