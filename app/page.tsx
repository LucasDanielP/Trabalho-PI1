import { Button } from "@/components/ui/button";

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


      </div>
    </main>
  );
}
