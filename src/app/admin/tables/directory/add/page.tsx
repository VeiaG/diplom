"use client";
import React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SubdivisionComboBox from "@/components/subdivision-combo-box";
import { DegreeComboBox } from "@/components/degree-combo-box";
import { Directory } from "@/types/db";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Columns2, Columns3, Columns4, Square } from "lucide-react";

import { Select, SelectTrigger , SelectValue , SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProgramsComboBox } from "@/components/educational-program-combo-box";
import { cn } from "@/lib/utils";

const gridMap = [
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
]
const AddDirectory = () => {
    const [value, setValue] = React.useState<Partial<Directory>>({});
    const router = useRouter();
    const handleCreate = () => {
        //check if all fields are filled
        if (!value.subdivision_id || !value.degree_id || !value.educationForm || !value.educationalProgramID || value.accreditation === undefined || !value.educationScope || !value.studyPeriod || !value.paidCostEntireCourse || !value.paidCostEntireCourseWritten || !value.firstYearPeriod || !value.firstYearCost || !value.firstYearCostWritten || !value.secondYearPeriod || !value.secondYearCost || !value.secondYearCostWritten  || !value.firstYearPayDue || !value.anualPayDue || !value.semesterPayDue) {
            toast.error('Заповніть усі поля');
            return;
        }


        //send data to server
        toast.promise(fetch('/api/directory',{
            method:'POST',
            body:JSON.stringify(value),
        }).then(async (res)=>{
            if(res.ok){
                router.push('/admin/tables/directory');
            }
            else{
                const error = await res.json();
                throw new Error(error.error || 'Помилка при створенні');
            }
        }),{
            loading:'Створення...',
            success:'Спеціальність створено',
            error(data){
                return data.message;
            }
        })
    };
    const [columns, setColumns] = React.useState(2);
    return (
       <div className="py-6 flex flex-col h-screen items-center gap-4">
        <Button asChild variant='outline' className="self-start">
            <Link href='/admin/tables/directory'>
                <ArrowLeft/>
                <span>
                    Назад
                </span>
            </Link>
        </Button>
         <Card className="w-full">
            <CardHeader className="relative">
                <CardTitle>Новий запис в довідці</CardTitle>
                <CardDescription>
                    Введіть усі потрібні довідкові дані для створення нового запису довідки
                </CardDescription>
                <div className="flex gap-2 items-center absolute top-4 right-6">
                    <Button variant="outline" size="icon" onClick={()=>setColumns(1)}>
                        <Square/>
                    </Button>
                    <Button variant="outline" size="icon" onClick={()=>setColumns(2)}>
                        <Columns2/>
                    </Button>
                    <Button variant="outline" size="icon" onClick={()=>setColumns(3)}>
                        <Columns3/>
                    </Button>
                    <Button variant="outline" size="icon"   onClick={()=>setColumns(4)}>
                        <Columns4/>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn("gap-4 grid grid-cols-2",`${gridMap[columns-1]}`)}>
                    <Label className="space-y-2">
                        <span>Підрозділ</span>
                        <SubdivisionComboBox
                            className="w-full"
                            value={value.subdivision_id?.toString() || ""}
                            setValue={(v) =>
                                setValue((prev) => ({
                                    ...prev,
                                    subdivision_id: parseInt(v),
                                }))
                            }
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Ступінь</span>
                        <DegreeComboBox
                            value={value.degree_id?.toString() || ""}
                            setValue={(v) =>
                                setValue((prev) => ({
                                    ...prev,
                                    degree_id: parseInt(v),
                                }))
                            }
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Форма навчання</span>
                        <Select 
                        value={value.educationForm }
                        onValueChange={(value) => {
                            setValue((prev) => ({
                                ...prev,
                                educationForm: value as ('денна' | 'заочна' | undefined)
                            }));
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
                    </Label>
                    <Label className="space-y-2">
                        <span>Спеціальність та освітня програма</span>
                       <ProgramsComboBox 
                               value={value.educationalProgramID?.toString() || ""}
                               setValue={(v) =>
                                   setValue((prev) => ({
                                        ...prev,
                                        educationalProgramID: parseInt(v),
                                   }
                                 ))}
                                 filterBySubdivision={value.subdivision_id}
                                 disabled={value.subdivision_id === undefined}
                             />
                             
                    </Label>
                    <div className="flex flex-col gap-4">

                    
                    <Label className="space-y-2">
                        <span>Акредитація</span>
                        <Select 
                            value={value.accreditation ? 'Так' : 'Ні'}
                            onValueChange={(value) => {
                                setValue((prev) => ({
                                    ...prev,
                                    accreditation: value === 'Так',
                                    accreditationPeriod: value === 'Так' ? new Date() : undefined,
                                }));
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
                    </Label>
                    {value.accreditation && (
                        <Label className="space-y-2 flex flex-col">
                            <span>Період акредитації</span>
                            <DatePicker date={value.accreditationPeriod} 
                                setDate={
                                    (date) => setValue((prev)=>({...prev,accreditationPeriod:date,}))
                                }/>
                        </Label>
                    )}
                    </div>
                    <Label className="space-y-2">
                        <span>Обсяг освітньої програми</span>
                        <Input type="number" 
                            value={value.educationScope || 0}
                            onChange={(e)=>setValue((prev)=>({...prev,educationScope:parseInt(e.target.value)} ))}
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Період навчання</span>
                        <Input value={value.studyPeriod || ''} onChange={(e)=>setValue((prev)=>({...prev,studyPeriod:e.target.value}))}/>
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість всього курсу</span>
                        <Input type="number" 
                            value={value.paidCostEntireCourse || 0}
                            onChange={(e)=>setValue((prev)=>({...prev,paidCostEntireCourse:parseInt(e.target.value)} ))}
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість всього курсу (прописом)</span>
                        <Input value={value.paidCostEntireCourseWritten || ''} onChange={(e)=>setValue((prev)=>({...prev,paidCostEntireCourseWritten:e.target.value}))}/>
                        <Separator/>
                    </Label>
                    
                    <Label className="space-y-2">
                        <span>Перший рік (період)</span>
                        <Input value={value.firstYearPeriod || ''} onChange={(e)=>setValue((prev)=>({...prev,firstYearPeriod:e.target.value}))}/>
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість першого року</span>
                        <Input type="number" 
                            value={value.firstYearCost || 0}
                            onChange={(e)=>setValue((prev)=>({...prev,firstYearCost:e.target.value} ))}
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість першого року (прописом)</span>
                        <Input value={value.firstYearCostWritten || ''} onChange={(e)=>setValue((prev)=>({...prev,firstYearCostWritten:e.target.value}))}/>
                        <Separator/>
                    </Label>
                    
                    <Label className="space-y-2">
                        <span>Другий рік (період)</span>
                        <Input value={value.secondYearPeriod || ''} onChange={(e)=>setValue((prev)=>({...prev,secondYearPeriod:e.target.value}))}/>
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість другого року</span>
                        <Input type="number" 
                            value={value.secondYearCost || 0}
                            onChange={(e)=>setValue((prev)=>({...prev,secondYearCost:e.target.value} ))}
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість другого року (прописом)</span>
                        <Input value={value.secondYearCostWritten || ''} onChange={(e)=>setValue((prev)=>({...prev,secondYearCostWritten:e.target.value}))}/>
                        <Separator/>
                    </Label>
                    
                    <Label className="space-y-2">
                        <span>Третій рік (період)</span>
                        <Input value={value.thirdYearPeriod || ''} onChange={(e)=>setValue((prev)=>({...prev,thirdYearPeriod:e.target.value}))}/>
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість третього року</span>
                        <Input type="number" 
                            value={value.thirdYearCost || 0}
                            onChange={(e)=>setValue((prev)=>({...prev,thirdYearCost:e.target.value} ))}
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість третього року (прописом)</span>
                        <Input value={value.thirdYearCostWritten || ''} onChange={(e)=>setValue((prev)=>({...prev,thirdYearCostWritten:e.target.value}))}/>
                        <Separator/>
                    </Label>
                    
                    <Label className="space-y-2">
                        <span>Четвертий рік (період)</span>
                        <Input value={value.fourthYearPeriod || ''} onChange={(e)=>setValue((prev)=>({...prev,fourthYearPeriod:e.target.value}))}/>
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість четвертого року</span>
                        <Input type="number" 
                            value={value.fourthYearCost || 0}
                            onChange={(e)=>setValue((prev)=>({...prev,fourthYearCost:e.target.value} ))}
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Вартість четвертого року (прописом)</span>
                        <Input value={value.fourthYearCostWritten || ''} onChange={(e)=>setValue((prev)=>({...prev,fourthYearCostWritten:e.target.value}))}/>
                        <Separator/>
                    </Label>
                    
                    <Label className="space-y-2 flex flex-col">
                        <span>Термін оплати першого року</span>
                        <DatePicker date={value.firstYearPayDue}
                            className="w-full"
                            setDate={
                                (date) => setValue((prev)=>({...prev,firstYearPayDue:date}))
                            }
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Щорічний термін оплати</span>
                        <Input value={value.anualPayDue || ''} onChange={(e)=>setValue((prev)=>({...prev,anualPayDue:e.target.value}))}/>
                    </Label>
                    <Label className="space-y-2">
                        <span>Семестровий термін оплати</span>
                        <Input value={value.semesterPayDue || ''} onChange={(e)=>setValue((prev)=>({...prev,semesterPayDue:e.target.value}))}/>
                    </Label>

                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleCreate}>Створити новий запис</Button>
            </CardFooter>
        </Card>
       </div>
    );
};

export default AddDirectory;
