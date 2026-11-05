import { useState } from "react";
import { fetchTasks } from "../api/tasks";
import { useAsync } from "../hooks/useAsync";

export function TasksView() {
  const [employeeId, setEmployeeId] = useState("");
  const [completed, setCompleted] = useState<"" | "true" | "false">("");

  const { data, loading, error } = useAsync(
    () =>
      fetchTasks({
        employeeId: employeeId ? Number(employeeId) : undefined,
        completed: completed === "" ? undefined : completed === "true",
      }),
    [employeeId, completed]
  );

  return (
    <div>
      <div className="filters">
        <input
          type="number"
          placeholder="Filter by employee id (1-10)"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <select
          value={completed}
          onChange={(e) => setCompleted(e.target.value as typeof completed)}
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>
      </div>

      {loading && <p>Loading tasks…</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <>
          <p className="hint">{data.length} task(s)</p>
          <ul className="task-list">
            {data.map((task) => (
              <li key={task.id} className={task.completed ? "done" : ""}>
                <input type="checkbox" checked={task.completed} readOnly />
                {task.title} <span className="muted">(employee #{task.employeeId})</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
