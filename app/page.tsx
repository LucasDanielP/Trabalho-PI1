import { Button } from "@/components/ui/button";
import { mockUsuarios, mockConfiguracoes, mockSessoesEstudo } from "@/lib/mocks";

export default function Home() {
  return (
    <main className="m-2 pb-10">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold gap-8 mt-10">Work & Rest</h1>
        <h2 className="text-xl mt-4">Seja bem-vindo!</h2>
        <div className="flex gap-4 m-8">
          <Button variant={"secondary"}>
            <p>Criar minha conta</p>
          </Button>
          <Button variant={"ghost"}>
            <p>Começar sem conta</p>
          </Button>
        </div>

        {/* Seção adicionada para visualizar os mocks que criamos */}
        <div className="w-full max-w-4xl p-6 border rounded-lg bg-slate-50 dark:bg-slate-950">
          <h3 className="text-2xl font-semibold mb-4">Dados Simulados (Mocks)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-lg border-b pb-2 mb-2">Usuários</h4>
              <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-auto max-h-60">
                {JSON.stringify(mockUsuarios, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-lg border-b pb-2 mb-2">Configurações</h4>
              <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-auto max-h-60">
                {JSON.stringify(mockConfiguracoes, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-lg border-b pb-2 mb-2">Sessões de Estudo</h4>
            <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(mockSessoesEstudo, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
