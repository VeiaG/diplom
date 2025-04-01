import { Directory } from "@/types/db";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";


const EducationalProgramComboBox = ({
    values,
    value,
    setValue,
    disabled,
    accessorKey = 'id',
    placeholder = "Оберіть освітню програму...",
    className,
    titleKey = 'educationalProgram',
    descriptionKey = 'specialtyName',
}: {
    values: Directory[];
    value: string;
    setValue: (value: string) => void;
    disabled?: boolean;
    accessorKey?: keyof Directory;
    placeholder?: string;
    className?: string;
    titleKey?: keyof Directory;
    descriptionKey?: keyof Directory;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("justify-between flex", className)}
                    disabled={disabled}
                >
                    {value
                        ? values?.find(
                              (item) => item?.[accessorKey]?.toString() === value
                          )?.educationalProgram
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[512px] p-0">
                <Command>
                    <CommandInput placeholder="Пошук..." />
                    <CommandList>
                        <CommandEmpty>Нічого не знайдено</CommandEmpty>
                        <CommandGroup>
                            {values?.map((item) => (
                                <CommandItem
                                    key={item?.id}
                                    value={item?.[accessorKey]?.toString()}
                                    keywords={[item?.educationalProgram || 'err',item?.specialtyName || 'err']}
                                    onSelect={(currentValue: string) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                     <div className="flex gap-2 items-center w-full">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="">{
                                                item?.[titleKey]?.toString()
                                            }</h2>
                                            <p className="text-xs text-muted-foreground">
                                                {
                                                    item?.[descriptionKey]?.toString()
                                                }
                                            </p>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === item?.[accessorKey]?.toString()
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>)
};
export default EducationalProgramComboBox;