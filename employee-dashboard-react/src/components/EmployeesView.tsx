import { useState } from "react";
import { fetchEmployees } from "../api/employees";
import { useAsync } from "../hooks/useAsync";
import { EmployeeDetailPanel } from "./EmployeeDetailPanel";

export function EmployeesView() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data, loading, error } = useAsync(
    () => fetchEmployees({ limit: 20, search: search || undefined }),
    [search]
  );

  return (
    <div className="split">
      <div className="list-pane">
        <input
          type="text"
          placeholder="Search employees…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}
        <ul className="employee-list">
          {data?.map((employee) => (
            <li
              key={employee.id}
              className={employee.id === selectedId ? "selected" : ""}
              onClick={() => setSelectedId(employee.id)}
            >
              <img src={employee.image} alt="" width={32} height={32} />
              <div>
                <div>{employee.fullName}</div>
                <div className="muted">{employee.jobTitle}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="detail-pane">
        {selectedId ? (
          <EmployeeDetailPanel employeeId={selectedId} />
        ) : (
          <p className="hint">Select an employee to see their detail + tasks.</p>
        )}
      </div>
    </div>
  );
}
