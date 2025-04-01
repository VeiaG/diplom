"use client";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronsUpDown } from "lucide-react";
import { saveAs } from "file-saver";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
import { cn } from "@/lib/utils";

import { useSubdivisions } from "@/hooks/useSubdivisions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AddPageProvider, useAddPage } from "@/hooks/addPageContext";
import { useDirectory } from "@/hooks/useDirectory";

import { Textarea } from "@/components/ui/textarea";
import { useRouter, useSearchParams } from "next/navigation";
import SubdivisionComboBox from "@/components/subdivision-combo-box";
import EducationalProgramComboBox from "@/components/educational-combo-box";
import { toast } from "sonner";
import Link from "next/link";
import { DegreeComboBox } from "@/components/degree-combo-box";




            

const FirstAndHalfStep = ({
    setStep
}:{
    setStep: React.Dispatch<React.SetStateAction<number>>;
})=>{
    const {
        data,
        setKey,
        isNull
    } = useAddPage();
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});
  
    const handleNextPage = ()=>{
        const currentErrors = {...errors};
        const keys = ['jur_name','jur_pib','jur_status','jur_pib_short','jur_req'];
        keys.forEach((key)=>{
            if(isNull(key)){
                currentErrors[key] = 'Це поле не може бути пустим';
            }else{
                delete currentErrors[key];
            }
        });
        setErrors(currentErrors);
        if(Object.keys(currentErrors).length > 0){
            return;
        }
        setStep(2);
    }
    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                <h1 className="text-2xl font-bold ">
                    Крок 1.5 Дані юридичної особи
                </h1>
                <div className="flex flex-col gap-2">
                        <Label className="space-y-2">
                            <span>
                                Організаційно-правова форма та назва юридичної особи, яка замовляє освітню послугу
                            </span>
                            <Input placeholder="Введіть назву юридичної особи" 
                                value={data?.jur_name || ''}
                                onChange={(e)=>setKey('jur_name',e.target.value)}
                            />
                            {
                                errors['jur_name'] && 
                                <span className="text-red-500 text-sm">
                                    {errors['jur_name']}
                                </span>
                            }
                        </Label>
                        <Label className="space-y-2">
                            <span>
                                Посада і представник замовника
                            </span>
                            <Input placeholder="Введіть посаду і представника замовника" 
                                value={data?.jur_pib || ''}
                                onChange={(e)=>setKey('jur_pib',e.target.value)}
                            />
                            {
                                errors['jur_pib'] && 
                                <span className="text-red-500 text-sm">
                                    {errors['jur_pib']}
                                </span>
                            }
                        </Label>
                        <Label className="space-y-2">
                            <span>
                                Замовник діє на підставі
                            </span>
                            <Input placeholder="Введіть підставу , на якій діє замовник" 
                                value={data?.jur_status || ''}
                                onChange={(e)=>setKey('jur_status',e.target.value)}
                            />
                            {
                                errors['jur_status'] && 
                                <span className="text-red-500 text-sm">
                                    {errors['jur_status']}
                                </span>
                            }
                        </Label>
                        <Label className="space-y-2">
                            <span>
                                ІП представника 
                            </span>
                            <Input placeholder="Олена ГОЛОВАЧ" 
                                value={data?.jur_pib_short || ''}
                                onChange={(e)=>setKey('jur_pib_short',e.target.value)}
                            />
                            {
                                errors['jur_pib_short'] && 
                                <span className="text-red-500 text-sm">
                                    {errors['jur_pib_short']}
                                </span>
                            }
                        </Label>
                        <Label className="space-y-2">
                            <span>
                                Реквізити замовника
                            </span>
                            <Textarea placeholder="Введіть реквізити замовника" 
                                value={data?.jur_req || ''}
                                onChange={(e)=>setKey('jur_req',e.target.value)}
                                className="max-h-32"
                            />
                            {
                                errors['jur_req'] && 
                                <span className="text-red-500 text-sm">
                                    {errors['jur_req']}
                                </span>
                            }
                        </Label>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                    <Button variant={"outline"} 
                        onClick={() => setStep(1)}
                    >Назад</Button>
                    <Button variant={"default"}
                        onClick={handleNextPage}
                        // disabled
                    >Далі</Button>
                </div>
            </CardFooter>
        </Card>
    );
}
const FirstStep = ({
    setStep,
}:{
    setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const {
        data,
        setKey,
        isNull
    } = useAddPage();
    const { subdivisions } = useSubdivisions();
    const selectedSubdivisionData = subdivisions?.find(
        (item) => item?.id?.toString() === data?.subdivision
    );

    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});


    const handleNextPage = ()=>{
        const currentErrors = {...errors};
        const keys = ['financing','subdivision'];
        keys.forEach((key)=>{
            if(isNull(key)){
                currentErrors[key] = 'Це поле не може бути пустим';
            }else{
                delete currentErrors[key];
            }
        });
        if(data?.financing !== 'budget'){
            if(isNull('payment_term')){
                currentErrors['payment_term'] = 'Це поле не може бути пустим';
            }
            else{
                delete currentErrors['payment_term'];
            }
        }else{
            delete currentErrors['payment_term'];
        }

        setErrors(currentErrors);
        if(Object.keys(currentErrors).length > 0){
            return;
        }
        if(data?.financing === 'jur'){
            setStep(1.5);
            return;
        }
        setStep(2);

    }
    return (
        <Card>
            <CardContent className="pt-6 space-y-4 flex flex-col">
                <h1 className="text-2xl font-bold ">
                    Крок 1. Оберіть навчальний підрозділ та фінансування
                </h1>
                {selectedSubdivisionData && (
                    <Alert>
                        <AlertTitle className="text-xl font-bold">
                            {selectedSubdivisionData?.name}
                        </AlertTitle>
                        <AlertDescription>
                            {`${selectedSubdivisionData?.dean} (${selectedSubdivisionData?.degree})`}
                        </AlertDescription>
                    </Alert>
                )}
                {!selectedSubdivisionData && (
                    <Alert>
                        <AlertTitle className="text-xl font-bold">
                            Підрозділ не обрано
                        </AlertTitle>
                        <AlertDescription>
                            Оберіть підрозділ зі списку нижче
                        </AlertDescription>
                    </Alert>
                )}
                <SubdivisionComboBox
                    value={data?.subdivision?.toString() || ""}
                    setValue={(value) => setKey("subdivision", value)}
                />
                <Label className="space-y-2">
                    <span>Фінансування навчання</span>
                    <Select 
                        value={
                            data?.financing?.toString() || ''
                        }
                        onValueChange={
                            (value)=>setKey('financing',value)
                        }
                    >
                    <SelectTrigger >
                        <SelectValue placeholder="Оберіть фінансування" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="budget">Бюджет</SelectItem>
                        <SelectItem value="phys">Контракт фіз. особа</SelectItem>
                        <SelectItem value="jur">Контракт юр. особа</SelectItem>
                    </SelectContent>
                    </Select>
                    {
                        errors['financing'] && 
                        <span className="text-red-500 text-sm">
                            {errors['financing']}
                        </span>
                    }
                </Label>
                {
                    (data?.financing !== "budget" && !isNull('financing')) && (
                        <Label className="space-y-2">
                    <span>
                        Строки здіснення оплати
                    </span>
                    <Select 
                        value={data?.payment_term?.toString() || ''}
                        onValueChange={(value)=>setKey('payment_term',value)}
                    >
                    <SelectTrigger >
                        <SelectValue placeholder="Оберіть строки здійснення оплати" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="щороку">щороку</SelectItem>
                        <SelectItem value="кожного семестру">кожного семестру</SelectItem>
                        
                    </SelectContent>
                    </Select>
                    {
                        errors['payment_term'] && 
                        <span className="text-red-500 text-sm">
                            {errors['payment_term']}
                        </span>
                    }
                </Label>
                    )
                }
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                    {/* <Button variant={"outline"} >Назад</Button> */}
                    <Button variant={"default"}
                        onClick={handleNextPage}
                        disabled={isNull('subdivision')}
                    >Далі</Button>
                </div>
            </CardFooter>
        </Card>
    );
};

const SecondStep = ({
    setStep
}:{
    setStep: React.Dispatch<React.SetStateAction<number>>;
})=>{
    const {
        data,
        setKey,
        isNull
    } = useAddPage();
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});
  
    const handleNextPage = ()=>{
        const currentErrors = {...errors};
        const keys = ['financing','pib_vstup','passport_vstup','address_vstup','ipn_vstup','phone_vstup'];
        keys.forEach((key)=>{
            if(isNull(key)){
                currentErrors[key] = 'Це поле не може бути пустим';
            }else{
                delete currentErrors[key];
            }
        });
        setErrors(currentErrors);
        if(Object.keys(currentErrors).length > 0){
            return;
        }
        setStep(3);
    }
    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                <h1 className="text-2xl font-bold ">
                    Крок 2. Загальні дані вступника
                </h1>
                <div className="flex flex-col gap-2">
                
                <Label className="space-y-2">
                    <span>
                        ПІБ вступника
                    </span>
                    <Input placeholder="Сидоренко Микола Степанович" 
                        value={data?.pib_vstup || ''}
                        onChange={(e)=>setKey('pib_vstup',e.target.value)}
                    />
                    {
                        errors['pib_vstup'] && 
                        <span className="text-red-500 text-sm">
                            {errors['pib_vstup']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Серія та номер, ким виданий  паспорт вступника
                    </span>
                    <Input placeholder="123456789, 4321, 01.01.2000"
                        value={data?.passport_vstup || ''}
                        onChange={(e)=>setKey('passport_vstup',e.target.value)}
                    />
                    {
                        errors['passport_vstup'] && 
                        <span className="text-red-500 text-sm">
                            {errors['passport_vstup']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Місце проживання (реєстрації) вступника 
                    </span>
                    <Input placeholder="Київська область, Бучанський район, с. Шпитьки, вул. Шевченка, буд.57" 
                        value={data?.address_vstup || ''}
                        onChange={(e)=>setKey('address_vstup',e.target.value)}
                    />
                    {
                        errors['address_vstup'] && 
                        <span className="text-red-500 text-sm">
                            {errors['address_vstup']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Реєстраційний номер облікової картки платника податків вступника
                    </span>
                    <Input placeholder="1234567890" 
                        value={data?.ipn_vstup || ''}
                        onChange={(e)=>setKey('ipn_vstup',e.target.value)}
                    />
                    {
                        errors['ipn_vstup'] && 
                        <span className="text-red-500 text-sm">
                            {errors['ipn_vstup']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Номери телефонів
                    </span>
                    <Input placeholder="0931234567; 0978765432"
                        value={data?.phone_vstup || ''}
                        onChange={(e)=>setKey('phone_vstup',e.target.value)}
                    />
                    {
                        errors['phone_vstup'] && 
                        <span className="text-red-500 text-sm">
                            {errors['phone_vstup']}
                        </span>
                    }
                </Label>          
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                    <Button variant={"outline"} 
                        onClick={() => {
                            if(data?.financing !== 'jur'){
                                setStep(1);
                            }
                            else{
                                setStep(1.5);
                            }
                        }}
                    >Назад</Button>
                    <Button variant={"default"}
                        onClick={handleNextPage}
                        // disabled
                    >Далі</Button>
                </div>
            </CardFooter>
        </Card>
    );
}
const ThirdStep = ({
    setStep
}:{
    setStep: React.Dispatch<React.SetStateAction<number>>;
})=>{
    const {
        data,
        setKey,
        isNull
    } = useAddPage();
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});
  
    const handleNextPage = ()=>{
        const currentErrors = {...errors};
        const keys = ['pib_legal','passport_legal','address_legal','ipn_legal','phone_legal'];
        keys.forEach((key)=>{
            if(isNull(key)){
                currentErrors[key] = 'Це поле не може бути пустим';
            }else{
                delete currentErrors[key];
            }
        });
        setErrors(currentErrors);
        if(Object.keys(currentErrors).length > 0){
            return;
        }
        setStep(4);
    }
    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                <h1 className="text-2xl font-bold ">
                    Крок 3. Загальні дані законного представника
                </h1>
                <div className="flex flex-col gap-2">
                <Label className="space-y-2">
                    <span>
                        ПІБ законного представника
                    </span>
                    <Input placeholder="Сидоренко Микола Степанович" 
                        value={data?.pib_legal || ''}
                        onChange={(e)=>setKey('pib_legal',e.target.value)}
                    />
                    {
                        errors['pib_legal'] && 
                        <span className="text-red-500 text-sm">
                            {errors['pib_legal']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Серія та номер, ким виданий  паспорт законного представника
                    </span>
                    <Input placeholder="123456789, 4321, 01.01.2000" 
                        value={data?.passport_legal || ''}
                        onChange={(e)=>setKey('passport_legal',e.target.value)}
                    />
                    {
                        errors['passport_legal'] && 
                        <span className="text-red-500 text-sm">
                            {errors['passport_legal']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Місце проживання (реєстрації) законного представника 
                    </span>
                    <Input placeholder="Київська область, Бучанський район, с. Шпитьки, вул. Шевченка, буд.57"
                        value={data?.address_legal || ''}
                        onChange={(e)=>setKey('address_legal',e.target.value)}
                    />
                    {
                        errors['address_legal'] && 
                        <span className="text-red-500 text-sm">
                            {errors['address_legal']}
                        </span>
                    }
                    
                </Label>
                <Label className="space-y-2">
                    <span>
                        Реєстраційний номер облікової картки платника податків законного представника
                    </span>
                    <Input placeholder="1234567890" 
                        value={data?.ipn_legal || ''}
                        onChange={(e)=>setKey('ipn_legal',e.target.value)}
                    />
                    {
                        errors['ipn_legal'] && 
                        <span className="text-red-500 text-sm">
                            {errors['ipn_legal']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Номери телефонів законного представника
                    </span>
                    <Input placeholder="0931234567; 0978765432" 
                        value={data?.phone_legal || ''}
                        onChange={(e)=>setKey('phone_legal',e.target.value)}
                    />
                    {
                        errors['phone_legal'] && 
                        <span className="text-red-500 text-sm">
                            {errors['phone_legal']}
                        </span>
                    }
                </Label>          
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                    <Button variant={"outline"} 
                        onClick={() => setStep(2)}
                    >Назад</Button>
                    <Button variant={"default"}
                        onClick={handleNextPage}
                        // disabled
                    >Далі</Button>
                </div>
            </CardFooter>
        </Card>
    );
}

const FourthStep = ({
    setStep
}:{
    setStep: React.Dispatch<React.SetStateAction<number>>;
})=>{
    const {
        data,
        setKey,
        isNull
    } = useAddPage();
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});

    const {
        directory,
        isLoading,
        error
    } = useDirectory();
    const {
        subdivisions
    } = useSubdivisions();
    
    const filteredDirectory = directory
    ?.filter((item)=>item.subdivision_id?.toString() === data?.subdivision)
    ?.filter((item)=>item.degree_id?.toString() === data?.degree)
    ?.filter((item)=>item.educationForm === data?.education_form);

    useEffect(()=>{
        const filteredDirectory = directory
        ?.filter((item)=>item.subdivision_id?.toString() === data?.subdivision)
        ?.filter((item)=>item.degree_id?.toString() === data?.degree)
        ?.filter((item)=>item.educationForm === data?.education_form);
        
        if(data?.directory_id && !filteredDirectory?.find((item)=>item?.id?.toString() === data?.directory_id)){
            if(!isLoading){
                setKey('directory_id','');
            }
        }
    },[
        data?.subdivision,
        data?.degree,
        data?.education_form,
        data?.directory_id,
        setKey,
        directory,
        isLoading
    ])

    const selectedDirectoryData = filteredDirectory?.find((item)=>item?.id?.toString() === data?.directory_id);

  
    const handleNextPage = ()=>{
        const currentErrors = {...errors};
        const keys = ['degree','education_form','directory_id'];
        keys.forEach((key)=>{
            if(isNull(key)){
                currentErrors[key] = 'Це поле не може бути пустим';
            }else{
                delete currentErrors[key];
            }
        });
        setErrors(currentErrors);
        if(Object.keys(currentErrors).length > 0){
            return;
        }
        setStep(5);
    }

    if(error){
        return (
            <div className="text-center text-muted-foreground">
                Помилка завантаження довідника освітніх програм: {error?.message} <br/>
                Зверніться до адміністратора, перевірте підключення до бази даних та цілісність таблиці &quot;directory&quot;
            </div>
        )
    }
    return (
       <div className="grid grid-cols-3 gap-6">
         <Card className="col-span-2">
            <CardContent className="pt-6 space-y-4">
                <h1 className="text-2xl font-bold ">
                    Крок 4. Освітня програма
                </h1>
                <p>

                </p>
                <div className="flex flex-col gap-2">
                <Label className="space-y-2">
                    <span>
                        Ступінь вищої освіти
                    </span>
                    <DegreeComboBox 
                        value={data?.degree?.toString() || ''}
                        setValue={(value)=>setKey('degree',value)}
                    />
                    {
                        errors['degree'] && 
                        <span className="text-red-500 text-sm">
                            {errors['degree']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Форма навчання
                    </span>
                    <Select 
                        value={data?.education_form?.toString() || ''}
                        onValueChange={(value)=>setKey('education_form',value)}
                    >
                    <SelectTrigger >
                        <SelectValue placeholder="Оберіть форму навчання" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="денна">денна</SelectItem>
                        <SelectItem value="заочна">заочна</SelectItem>
                    </SelectContent>
                    </Select>
                    {
                        errors['education_form'] && 
                        <span className="text-red-500 text-sm">
                            {errors['education_form']}
                        </span>
                    }
                </Label>
                <Label className="space-y-2">
                    <span>
                        Назва освітньої програми
                    </span>
                    {
                        isLoading && 
                        <Button variant="outline" className="w-full justify-between" disabled>
                            Завантаження довідника освітніх програм...
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    }
                    {
                        !isLoading && 
                        <EducationalProgramComboBox 
                        className="w-full"
                        values={filteredDirectory || []}
                        value={data?.directory_id?.toString() || ''}
                        setValue={(value)=>setKey('directory_id',value)}
                        disabled={isNull('degree') || isNull('education_form')}

                    />
                    }
                    {
                        errors['directory_id'] && 
                        <span className="text-red-500 text-sm">
                            {errors['directory_id']}
                        </span>
                    }
                    
                    
                </Label>
                
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                    <Button variant={"outline"} 
                        onClick={() => setStep(3)}
                    >Назад</Button>
                    <Button variant={"default"}
                        onClick={handleNextPage}
                        // disabled
                    >Далі</Button>
                </div>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Попередній перегляд</CardTitle>
                <CardDescription>
                    Обрана освітня програма
                </CardDescription>
                </CardHeader>
                {
                    isNull('directory_id') && <CardContent>
                        <div className="text-center text-muted-foreground">
                            Немає даних для відображення, оберіть освітню програму. <br/>
                            Якщо немає потрібної освітньої програми, впевніться що ви обрали правильний підрозділ, ступінь та форму навчання.
                            <Button variant="link" className="mt-4"
                                onClick={()=>setStep(1)}
                            >
                                Обрати підрозділ
                            </Button>
                        </div>
                    </CardContent>
                }
                {
                    !isNull('directory_id') && <CardContent>
                    <div>
                        <div className="font-bold">
                            Назва освітньої програми
                        </div>
                        <div>
                            {selectedDirectoryData?.educationalProgram}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">
                            Назва та код спеціальності
                        </div>
                        <div>
                            {selectedDirectoryData?.specialtyName}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">
                            Форма навчання
                        </div>
                        <div>
                            {selectedDirectoryData?.educationForm}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">
                            Загальний термін навчання
                        </div>
                        <div>
                            {selectedDirectoryData?.studyPeriod}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">
                            Вартість навчання
                        </div>
                        <div>
                            {selectedDirectoryData?.paidCostEntireCourse.toLocaleString()} грн.
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">
                            Акредитація
                        </div>
                        <div>
                            {
                                selectedDirectoryData?.accreditation ?
                                 `акредитована до ${new Date(selectedDirectoryData?.accreditationPeriod || '').toLocaleDateString()}`
                                : 'не акредитована'
                            }
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">
                            Навчальний підрозділ
                        </div>
                        <div>
                            {subdivisions?.find((item)=>item.id.toString() === data?.subdivision)?.name}
                        </div>
                        
                    </div>
                </CardContent>
                }

           
        </Card>
       </div>
    );
}
const LastStep = ({
    setStep
}:{
    setStep: React.Dispatch<React.SetStateAction<number>>;
})=>{
    const {
        data,
    } = useAddPage();

    const handleDownload = (route:string,fileName:string) => {
        fetch(`/api/generate/${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(res => {
            if (!res.ok) throw new Error('Помилка завантаження');
            return res.blob();
        })
        .then(blob => {
            
            saveAs(blob, `${endPrefix}${fileName}`);
        })
        .catch(err => console.error(err));
    };

    const router = useRouter();

    const endPrefix = data?.pib_vstup?.toString()?.replace(' ', '_');
    const searchParams = useSearchParams();
    const handleSave = ()=>{
        const id = searchParams.get('id') ;
        fetch('/api/savedata',{
            method: 'POST',
            body: JSON.stringify({
                data:data,
                id:id,
            }),
        })
        .then(res => {
            if (!res.ok) throw new Error('Помилка збереження');
            return res.json();
        })
        .then(res=>{
            console.log(res);
            router.push('/');
        })
        .catch(err => console.error(err));

        // alert('NOT IMPLEMENTED');
    }

    
    
    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                <h1 className="text-2xl font-bold">
                    Крок 5. Збереження та завантаження документів
                </h1>
                <div className="text-center">
                    <p>
                        Усі дані заповнені , ви можете прямо зараз завантажити архів з усіма документами , або окремо кожен документ. <br/>
                        
                    </p>
                    
                </div>
            </CardContent>
            <CardFooter>
            <div className="flex items-center gap-2 ml-auto">
                    
                    <div className="flex items-center">
                        <Button variant="outline" className=" rounded-r-none"
                            onClick={()=>handleDownload('',`_Договори_${new Date().getFullYear()}.zip`)}
                        >
                            Скачати архів
                        </Button>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size='icon' className="rounded-l-none">
                                <ChevronDown/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                                onClick={()=>handleDownload('edu',`_Договір_навчання_${new Date().getFullYear()}.docx`)}
                            >
                                Договір про навчання
                            </DropdownMenuItem>
                            {
                                data?.financing === 'phys' && (
                                    <DropdownMenuItem
                                        onClick={()=>handleDownload('phys',`_Договір_фіз_особа_${new Date().getFullYear()}`)}
                                    >
                                        Договір фіз. особа
                                    </DropdownMenuItem>
                                )
                            }
                            {
                                data?.financing === 'jur' && (
                                    <DropdownMenuItem
                                        onClick={()=>handleDownload('jur',`_Договір_юр_особа_${new Date().getFullYear()}.docx`)}
                                    >
                                        Договір юр. особа
                                    </DropdownMenuItem>
                                )
                            }
                        </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <Button variant={"outline"} 
                        onClick={() => setStep(4)}
                    >Назад</Button>
                    <Button variant={"default"}
                        onClick={handleSave}
                        // disabled
                    >Зберегти</Button>
                </div>
            </CardFooter>
        </Card>
    );
}

const PageContent = ()=>{
    const {
        setAll
    } = useAddPage();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    
    const router= useRouter();
    useEffect(()=>{
        const id = searchParams.get('id');
        if(!id){
            return;
        }
        setIsLoading(true);
        //fetch data from db
        fetch(`api/savedata/${id}`).then(async (res)=>{
            if(res.ok){
                return res.json();
            }
            const error = await res.json();
            throw new Error(error?.message || 'Помилка завантаження даних') ;
        })
        .then(data=>{
            setAll(data);
            setIsLoading(false);
        })
        .catch(err=>{
            toast.error(err?.message );
            router.push('/');
        })
    },[searchParams,setAll,router]);

    if(isLoading){
        return (
            <div className="text-center text-muted-foreground">
                Завантаження даних для редагування...
            </div>
        )
    }

    return (
        <div className="container max-w-[1200px] mx-auto py-8 relative">
            <Button asChild variant="outline" className="absolute top-4 left-0">
                <Link href="/">
                        <ArrowLeft/>
                        Назад
                </Link>
            </Button>
           <div className="flex w-full justify-center items-center gap-2 py-2">
                {
                    Array.from({length:5}).map((_,index)=>(
                        <div key={index} className={cn(
                            "w-3 h-3 rounded-full bg-muted",
                            step === index + 1 ? 'bg-accent-foreground opacity-50' : ''
                            ,
                            (step===1.5 && index===0) ? 'bg-accent-foreground opacity-50' : ''
                        )}></div>
                    ))
                }
           </div>
           
            {step === 1 && <FirstStep
                setStep={setStep}
            />}
            {step === 1.5 && <FirstAndHalfStep
                setStep={setStep}
            />}
            {step === 2 && <SecondStep
                setStep={setStep}
            />}
            {step === 3 && <ThirdStep
                setStep={setStep}
            />}
            {
                step === 4 && <FourthStep
                    setStep={setStep}
                />
            }
            {
                step === 5 && <LastStep
                    setStep={setStep}
                />
            }
             {/* <pre className="text-xs">
                Data: {JSON.stringify(data,null,2)}
            </pre> */}
        </div>
    );
}
const AddPage = () => {
    return (
        <AddPageProvider>
            <PageContent/>
        </AddPageProvider>
    )
};

export default AddPage;
