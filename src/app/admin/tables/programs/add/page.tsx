"use client";
import React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SubdivisionComboBox from "@/components/subdivision-combo-box";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddProgram = () => {
    const router = useRouter();
    const [educationalProgram, setEducationalProgram] = React.useState("");
    const [specialtyName, setSpecialtyName] = React.useState("");
    const [subdivision_id, setSubdivision_id] = React.useState<number>();
    const handleCreate = () => {
        //check if all fields are filled
        if (
            !educationalProgram ||
            !specialtyName ||
            subdivision_id === undefined
        ) {
            toast.error("Заповніть всі поля");
            return;
        }
        //send data to server
        toast.promise(
            fetch("/api/programs", {
                method: "POST",
                body: JSON.stringify({ 
                    educationalProgram, 
                    specialtyName, 
                    subdivision_id
                 }),
            }).then(async (res) => {
                if (res.ok) {
                    router.push(`/admin/tables/programs`);
                } else {
                    const error = await res.json();
                    throw new Error(error.error || "Помилка при створенні");
                }
            }),
            {
                loading: "Створення...",
                success: "Ступінь створено",
                error(data) {
                    return data.message;
                },
            }
        );
    };
    return (
        <div className="py-6 flex flex-col h-screen items-center gap-4">
            <Button asChild variant="outline" className="self-start">
                <Link href="/admin/tables/programs">
                    <ArrowLeft />
                    <span>Назад</span>
                </Link>
            </Button>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Нова спеціальність та освітня програма</CardTitle>
                    <CardDescription>Введіть потрібні дані</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label className="space-y-2">
                        <span>Освітня програма</span>
                        <Input
                            value={educationalProgram}
                            onChange={(e) =>
                                setEducationalProgram(e.target.value)
                            }
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Спеціальність</span>
                        <Input
                            value={specialtyName}
                            onChange={(e) => setSpecialtyName(e.target.value)}
                        />
                    </Label>
                    <Label className="space-y-2">
                        <span>Підрозділ</span>
                        <SubdivisionComboBox
                            className="w-full"
                            value={subdivision_id?.toString() || ""}
                            setValue={(value) =>
                                setSubdivision_id(parseInt(value))
                            }
                        />
                    </Label>

                    
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreate}>Створити новий запис</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AddProgram;
