export default function DocsPage() {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-6">Документація</h1>
        <p className="text-xl mb-4">
            Вітаємо вас в документації по використанню модуля формування контрактів для вступників НУХТ.
            
        </p>
        <div className="grid gap-4 mt-8 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-2">Getting Started</h3>
            <p className="text-muted-foreground mb-4">Learn how to install and set up your project.</p>
            <a href="/docs/introduction" className="text-primary hover:underline">
              Read more →
            </a>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-2">Core Concepts</h3>
            <p className="text-muted-foreground mb-4">Understand the fundamental concepts of the framework.</p>
            <a href="/docs/routing" className="text-primary hover:underline">
              Read more →
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  