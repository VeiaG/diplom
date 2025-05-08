'use client';
import TemplateCard from '@/components/TemplateCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';

const TemplatesPage = () => {
  return (
    <div className="py-8 space-y-4 flex flex-col">
      <h1 className="text-4xl font-bold">Управління контрактами</h1>
      <p className="text-lg">
        Для зміни заготовок для контрактів використовуйте Word файли з потрібним форматуванням.
        <br />
        Завантажте поточний шаблон, внесіть необхідні зміни, а потім завантажте оновлений файл назад.
      </p>
      <Alert variant="destructive">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Увага</AlertTitle>
        <AlertDescription>
          При завантаженні нового шаблону буде <b>замінено існуючий шаблон</b>. <br />
          Переконайтеся, що ви зробили резервну копію поточного шаблону перед завантаженням нового.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TemplateCard 
          title="Шаблон навчального контракту"
          description="Завантажте новий шаблон навчального контракту або отримайте існуючий"
          apiEndpoint="/api/templates/edu"
        />
        
        <TemplateCard 
          title="Шаблон контракту юридичної особи"
          description="Завантажте новий шаблон контракту для юридичної особи або отримайте існуючий"
          apiEndpoint="/api/templates/jur"
        />
        
        <TemplateCard 
          title="Шаблон контракту фізичної особи"
          description="Завантажте новий шаблон контракту для фізичної особи або отримайте існуючий"
          apiEndpoint="/api/templates/phys"
        />
      </div>
    </div>
  );
};

export default TemplatesPage;