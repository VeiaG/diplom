import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useSubdivisions } from "@/hooks/useSubdivisions";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Subdivision } from "@/types/db";
const SubdivisionComboBox = ({
    value,
    setValue,
    accessorKey = 'id',
    placeholder = "Оберіть підрозділ...",
    className,
}: {
    value: string;
    setValue: (value: string) => void;
    accessorKey?: keyof Subdivision;
    placeholder?: string;
    className?: string;
}) => {
    const [open, setOpen] = useState(false);
    const { subdivisions, isLoading, error } = useSubdivisions();
    if (error) {
        return (
            <Button
                disabled
                variant="destructive"
                className={cn("justify-between flex", className)}
            >
                Помилка завантаження підрозділів :<span>{error?.message}</span>
                <ChevronsUpDown className="opacity-50" />
            </Button>
        );
    }
    if (isLoading) {
        return (
            <Button
                disabled
                variant="outline"
                className={cn("justify-between flex", className)}
            >
                Завантаження підрозділів...
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
                    className={cn("justify-between flex", className)}
                >
                    {value
                        ? subdivisions.find(
                              (item) => item?.[accessorKey].toString() === value
                          )?.name
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[512px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Пошук..." />
                    <CommandList>
                        <CommandEmpty>Підрозділи не знайдено</CommandEmpty>
                        <CommandGroup>
                            {subdivisions?.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item?.[accessorKey].toString()}
                                    keywords={[item.name, item.dean]}
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
                                            <h2 className="">{item.name}</h2>
                                            <p className="text-xs text-muted-foreground">
                                                {item.dean}
                                            </p>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value ===  item?.[accessorKey].toString()
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

export default SubdivisionComboBox;