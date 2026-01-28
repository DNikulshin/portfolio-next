import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <AdminDashboard />
    </main>
  );
}
