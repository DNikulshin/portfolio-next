import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { WorkList } from "@/components/works/WorkList";

export default function AdminPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <AdminDashboard />
      <WorkList type="list" />
    </main>
  );
}
