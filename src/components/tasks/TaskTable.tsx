import Link from "next/link";
import { deleteTaskAction, type TaskRow } from "@/lib/actions/tasks";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { cn } from "@/lib/utils";

type Props = {
  tasks: TaskRow[];
};

async function handleDelete(formData: FormData) {
  "use server";
  const id = formData.get("taskId");
  if (typeof id !== "string") return;
  await deleteTaskAction(id);
}

export function TaskTable({ tasks }: Props) {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No tasks scheduled yet. Use the form to the right to create your first reminder.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Due</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-700">
                <Link href={`/tasks/${task.id}`} className="hover:text-brand-600">
                  {task.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(task.due_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-600 uppercase tracking-wide">
                {task.priority}
              </td>
              <td className="px-4 py-3">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <form action={handleDelete} className="inline">
                    <input type="hidden" name="taskId" value={task.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-400"
                    >
                      Archive
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
