import { Header } from "@/components/Header"

export default function Home() {
  return (

    <div className="flex flex-col h-screen container mx-auto px-2 py-2 gap-4">
      <Header />
      <h1>Main Page</h1>
    </div>
  );
}
