import { fetchEmployeeById } from "../api/employees";
import { fetchTasks } from "../api/tasks";
import { useAsync } from "../hooks/useAsync";
import { Warnings } from "./Warnings";

/** Two BFF calls in parallel: the employee's own detail, and their tasks list. */
export function EmployeeDetailPanel({ employeeId }: { employeeId: number }) {
  const employee = useAsync(() => fetchEmployeeById(employeeId), [employeeId]);
  const tasks = useAsync(() => fetchTasks({ employeeId }), [employeeId]);

  if (employee.loading) return <p>Loading employee…</p>;
  if (employee.error) return <p className="error">{employee.error}</p>;
  if (!employee.data) return null;

  const e = employee.data;

  return (
    <div>
      <Warnings warnings={e.warnings} />
      <div className="employee-header">
        <img src={e.image} alt={e.fullName} width={64} height={64} />
        <div>
          <h2>{e.fullName}</h2>
          <p>
            {e.jobTitle} · {e.department} at {e.companyName}
          </p>
        </div>
      </div>

      <dl className="detail-grid">
        <dt>Email</dt>
        <dd>{e.email}</dd>
        <dt>Phone</dt>
        <dd>{e.phone}</dd>
        <dt>Username</dt>
        <dd>{e.username}</dd>
        <dt>Age / Gender</dt>
        <dd>
          {e.age} / {e.gender}
        </dd>
        <dt>Address</dt>
        <dd>
          {e.address.street}, {e.address.city}, {e.address.state}{" "}
          {e.address.postalCode}, {e.address.country}
        </dd>
        <dt>Tasks</dt>
        <dd>
          {e.taskCount === null
            ? "unavailable"
            : `${e.taskCount} total, ${e.pendingTaskCount} pending`}
        </dd>
      </dl>

      <h3>Tasks</h3>
      {tasks.loading && <p>Loading tasks…</p>}
      {tasks.error && <p className="error">{tasks.error}</p>}
      {tasks.data && (
        <ul className="task-list">
          {tasks.data.map((task) => (
            <li key={task.id} className={task.completed ? "done" : ""}>
              <input type="checkbox" checked={task.completed} readOnly />
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
