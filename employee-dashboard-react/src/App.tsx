import { useState } from "react";
import "./App.css";
import { DashboardView } from "./components/DashboardView";
import { EmployeesView } from "./components/EmployeesView";
import { TasksView } from "./components/TasksView";

const TABS = ["Dashboard", "Employees", "Tasks"] as const;
type Tab = (typeof TABS)[number];

function App() {
  const [tab, setTab] = useState<Tab>("Dashboard");

  return (
    <div className="app">
      <header>
        <h1>Employee Dashboard</h1>
        <p className="muted">React app, served entirely by the Next.js BFF — no direct calls to DummyJSON or JSONPlaceholder.</p>
        <nav>
          {TABS.map((t) => (
            <button
              key={t}
              className={t === tab ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === "Dashboard" && <DashboardView />}
        {tab === "Employees" && <EmployeesView />}
        {tab === "Tasks" && <TasksView />}
      </main>
    </div>
  );
}

export default App;
