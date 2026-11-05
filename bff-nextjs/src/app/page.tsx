const ENDPOINTS = [
  { method: "GET", path: "/api/health", desc: "BFF + downstream service health check" },
  { method: "GET", path: "/api/employees", desc: "List employees, supports ?limit&skip&search" },
  { method: "GET", path: "/api/employees/:id", desc: "Employee detail + aggregated task counts" },
  { method: "GET", path: "/api/tasks", desc: "List tasks, supports ?employeeId&completed" },
  { method: "GET", path: "/api/dashboard", desc: "Aggregated view across both services" },
];

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        lineHeight: 1.5,
      }}
    >
      <h1>BFF Service</h1>
      <p>
        This Next.js app is a Backend-for-Frontend: it is not meant to be
        browsed directly by end users. It exposes a stable JSON API for the
        React client, built on two free public APIs — DummyJSON (as
        &quot;Employees&quot;) and JSONPlaceholder (as &quot;Tasks&quot;) —
        no auth required.
      </p>

      <h2>Available endpoints</h2>
      <table cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th>Method</th>
            <th>Path</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ENDPOINTS.map((e) => (
            <tr key={e.path} style={{ borderBottom: "1px solid #eee" }}>
              <td>
                <code>{e.method}</code>
              </td>
              <td>
                <code>{e.path}</code>
              </td>
              <td>{e.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
