import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="m-2">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-1xl gap-8">work & rest</h1>
        <h2>Seja bem-vindo!</h2>
        <div className="flex gap-4 m-4">
          <Button variant={"secondary"}>
            <p>Criar minha conta</p>
          </Button>
          <Button variant={"ghost"}>
            <p>Começar sem conta</p>
          </Button>
        </div>
      </div>
    </main>
  );
}
