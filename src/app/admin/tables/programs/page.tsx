"use client";
import React, { useEffect } from "react";
import { DBDataTable } from "@/components/db-data-table";
import { columns } from "./columns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert, Plus } from "lucide-react";
import { EducationalProgram } from "@/types/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TablesPage = () => {
    const [programs, setPrograms] = React.useState<EducationalProgram[]>([]);
    const [error, setError] = React.useState("");
    useEffect(() => {
        // fetch subdivisions
        fetch("/api/programs")
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    // console.log(data);
                    setPrograms(data.programs);
                } else {
                    const error = await res.json();
                    setError(error.error || "Помилка при завантаженні даних");
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);
    return (
        <div className="py-4 space-y-4">
            <h1 className="text-4xl font-bold">
                Таблиця спеціальностей та їх освітніх програм
            </h1>
            {error && <span className="text-red-500">{error}</span>}
            <Button asChild variant="outline">
                <Link href="/admin/tables/programs/add">
                    <Plus />
                    <span>Додати новий запис</span>
                </Link>
            </Button>
            <DBDataTable
                columns={columns}
                data={programs}
                tableName="educational_program"
                setValues={setPrograms}
            />
            <Alert>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Увага</AlertTitle>
                <AlertDescription>
                    Після видалення записів , пов&apos;язані рядки в інших
                    таблицях стануть пустими , що може призвести до помилок.{" "}
                    <br />
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default TablesPage;
