import { fetchTasks } from "@/lib/actions/tasks";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskForm } from "@/components/tasks/TaskForm";

export default async function TasksPage() {
  const tasks = await fetchTasks(15);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-500">Tasks & reminders</p>
        <h1 className="text-3xl font-semibold text-slate-900">Task board</h1>
        <p className="text-sm text-slate-500">
          Schedule renewals, follow-ups, claims, and payments with due dates and status updates.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <TaskTable tasks={tasks} />
        </div>
        <TaskForm />
      </div>
    </section>
  );
}
