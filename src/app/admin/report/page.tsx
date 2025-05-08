"use client";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert, Download } from "lucide-react";
const ReportPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const handleDownload = async () => {
        setIsLoading(true);
        await fetch("/api/report", {
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
                saveAs(blob, `report.xlsx`);
            })
            .catch((err) => console.error(err));
        setIsLoading(false);
    };
    return (
        <div className="py-8 space-y-4 flex flex-col">
            <h1 className="text-4xl font-bold">
                Загальний звіт по базі даних
            </h1>
            <Alert variant="default">
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Увага</AlertTitle>
                <AlertDescription>
                    Цей звіт містить всі дані з бази даних. 
                </AlertDescription>
            </Alert>

            <Button
                onClick={handleDownload}
                disabled={isLoading}
                className="mb-4"
            >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? "Завантаження..." : "Завантажити звіт"}
            </Button>

        </div>

    );
};

export default ReportPage;
