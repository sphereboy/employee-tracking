import { EmployeeTracker } from "@/components/EmployeeTracker";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Employee Tracker</h1>
      <EmployeeTracker />
    </main>
  );
}
