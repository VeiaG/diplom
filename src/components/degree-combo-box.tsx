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
import { useDegrees } from "@/hooks/useDegrees";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
export const DegreeComboBox = ({
    value,
    setValue,
}: {
    value: string;
    setValue: (value: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const { degrees, isLoading, error } = useDegrees();
    if (error) {
        return (
            <Button
                disabled
                variant="destructive"
                className="w-full justify-between flex"
            >
                Помилка завантаження ступеней :<span>{error?.message}</span>
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
                Завантаження ступеней...
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
                >
                    {value
                        ? degrees.find(
                              (item) => item.id.toString() === value
                          )?.name
                        : "Оберіть ступінь..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[512px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Пошук..." />
                    <CommandList>
                        <CommandEmpty>Ступінь не знайдено</CommandEmpty>
                        <CommandGroup>
                            {degrees?.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.id.toString()}
                                    keywords={[item.name]}
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
                                        {
                                            item.name
                                        }
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === item.id.toString()
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