import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrograms } from "@/hooks/usePrograms";
import { EducationalProgram } from "@/types/db";
export const ProgramsComboBox = ({
    value,
    setValue,
    accessorKey = 'id',
    titleKey = 'educationalProgram',
    descriptionKey = 'specialtyName',
    filterBySubdivision ,
    disabled
}: {
    value: string;
    setValue: (value: string) => void;
    accessorKey?: keyof EducationalProgram;
    titleKey?: keyof EducationalProgram;
    descriptionKey?: keyof EducationalProgram;
    filterBySubdivision?: number ,
    disabled?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const { programs, isLoading, error } = usePrograms();

    const filteredPrograms = filterBySubdivision ? programs?.filter((item) => item.subdivision_id === filterBySubdivision) : programs;
    if (error) {
        return (
            <Button
                disabled
                variant="destructive"
                className="w-full justify-between flex"
            >
                Помилка завантаження спеціальностей :<span>{error?.message}</span>
                <ChevronsUpDown className="opacity-50" />
            </Button>
        );
    }
    if (isLoading) {
        return (
            <Button
                disabled
                variant="outline"
                className="w-full justify-between flex"
            >
                Завантаження спеціальностей...
                <ChevronsUpDown className="opacity-50" />
            </Button>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between flex"
                    disabled={disabled}
                >
                    {value
                        ? programs?.find(
                              (item) => (item.id || '').toString() === value
                          )?.[titleKey]?.toString()
                        : "Оберіть спеціальність..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[512px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Пошук..." />
                    <CommandList>
                        <CommandEmpty>Спеціальність не знайдено</CommandEmpty>
                        <CommandGroup>
                        {filteredPrograms?.map((item) => (
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
        </Popover>
    );
};