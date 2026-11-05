import { fetchDashboard } from "../api/dashboard";
import { useAsync } from "../hooks/useAsync";
import { Warnings } from "./Warnings";

export function DashboardView() {
  const { data, loading, error } = useAsync(fetchDashboard, []);

  if (loading) return <p>Loading dashboard…</p>;
  if (error) return <p className="error">Failed to load dashboard: {error}</p>;
  if (!data) return null;

  return (
    <div>
      <Warnings warnings={data.warnings} />
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{data.totalEmployees ?? "—"}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.totalTasks ?? "—"}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.pendingTasks ?? "—"}</div>
          <div className="stat-label">Pending Tasks</div>
        </div>
      </div>

      <h2>Busiest Employees</h2>
      <p className="hint">
        One BFF call (<code>GET /api/dashboard</code>) combined the Employee
        and Task services in parallel to build this table — the browser only
        made one request.
      </p>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Total Tasks</th>
            <th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {data.busiestEmployees.map((row) => (
            <tr key={row.employee.id}>
              <td>{row.employee.fullName}</td>
              <td>{row.employee.department}</td>
              <td>{row.taskCount ?? "—"}</td>
              <td>{row.pendingTaskCount ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
