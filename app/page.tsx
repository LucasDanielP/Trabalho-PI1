import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>
        <Image src="logo.svg" alt="Logo Work & Rest" width={50} height={50} />
        <h1 className="">Work & Rest</h1>
      </div>
    </div>
  );
}
