'use client';
import { useState, useCallback, FC, DragEvent, ChangeEvent } from 'react';
import { Download, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TemplateCardProps {
  title: string;
  description: string;
  apiEndpoint: string;
}

const TemplateCard: FC<TemplateCardProps> = ({ title, description, apiEndpoint }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.name.endsWith('.docx')) {
        setFile(droppedFile);
        setUploadSuccess(false);
      } else {
        toast.error("Помилка", {
          description: "Підтримуються лише файли формату DOCX (.docx)"
        });
      }
    }
  }, []);

  const handleDownload = async (): Promise<void> => {
    try {
      window.location.href = apiEndpoint;
    } catch (error) {
        console.error("Error downloading template:", error);
      toast.error("Помилка завантаження", {
        description: "Не вдалося завантажити шаблон. Спробуйте пізніше."
      });
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      toast.error("Помилка", {
        description: "Будь ласка, виберіть файл для завантаження"
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadSuccess(true);
        toast.success("Успішно", {
          description: "Шаблон успішно оновлено"
        });
      } else {
        throw new Error(result.error || "Невідома помилка");
      }
    } catch (error) {
        console.error("Error uploading template:", error);
      toast.error("Помилка", {
        description:"Не вдалося оновити шаблон"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div
            className={`flex items-center justify-center border-2 border-dashed rounded-md px-6 py-10 cursor-pointer transition-colors ${
              isDragging 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="w-full h-full cursor-pointer">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <span className="relative font-medium text-blue-600 hover:text-blue-500">
                    {isDragging ? "Відпустіть файл тут" : "Виберіть файл або перетягніть сюди"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Формат DOCX (.docx)
                </p>
                {file && (
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                )}
                {uploadSuccess && (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Успішно завантажено!</span>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".docx"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Завантажити поточний
        </Button>
        <Button
          className="ml-auto"
          variant="default"
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "Завантаження..." : "Замінити шаблон"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;