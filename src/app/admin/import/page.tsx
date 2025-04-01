"use client";

import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert, Download } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
const Page = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleDownload = (fileName: string) => {
        fetch("/api/import", {
            method: "GET",
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка завантаження");
                return res.blob();
            })
            .then((blob) => {
                saveAs(blob, `${fileName}`);
            })
            .catch((err) => console.error(err));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warning("Оберіть файл для завантаження");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/import", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                console.error("Помилка:", data);
                toast.error(data.error || "Помилка завантаження файлу.");
                return;
            }

            const data = await response.json();
            console.log("Успішне завантаження:", data);
            toast.success("База даних успішно імпортована");
        } catch (error) {
            console.error("Помилка:", error);
            toast.error(
                (error as Error)?.message || "Помилка завантаження файлу.",
                {
                    description:
                        "Обов'язково перевірте цілісність БД після імпорту. Якщо виникли проблеми , поверніть БД з резервної копії.",
                    duration: 10000,
                    position: "top-center",
                }
            );
        }
    };

    return (
        <div className="py-8 space-y-4 flex flex-col">
            <h1 className="text-4xl font-bold">Імпортування даних</h1>
            <p>
                Для імпорту даних використовуйте шаблон Excel файлу, який можна
                завантажити нижче. В шаблоні вже заповнені поточні дані з бази
                даних та налаштовані випадаючі списки для вибору значень.
                <br />
                Після заповнення шаблону, виберіть файл для завантаження та
                натисніть кнопку &quot;Імпортувати&quot;.
            </p>
            <Alert variant="destructive">
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Увага</AlertTitle>
                <AlertDescription>
                    Під час імпорту даних буде <b>видалено всі існуючі дані</b>{" "}
                    в імпортованих таблицях бази даних. <br />
                    Переконайтеся, що ви зробили резервну{" "}
                    <Link
                        href="https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html"
                        className="underline"
                        target="_blank"
                    >
                        <b>копію бази даних</b>
                    </Link>{" "}
                    перед імпортом, щоб уникнути втрати даних при помилках.
                </AlertDescription>
            </Alert>

            <Button
                onClick={() => handleDownload("Заготовка_Імпорту.xlsx")}
                size={"lg"}
                className="self-center"
            >
                <Download />
                Завантажити шаблон для імпорту
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Імпорт Excel файлу</CardTitle>
                    <CardDescription>
                        Завантажте файл для імпорту даних. Перед імпортом
                        переконайтеся , що дані були заповнені вірно , без
                        помилок.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                    />
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleUpload}
                        className="ml-auto"
                        variant="outline"
                        size="lg"
                    >
                        Імпортувати
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Page;
