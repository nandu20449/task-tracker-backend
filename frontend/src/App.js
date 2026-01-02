import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.dueDate) errs.dueDate = "Due date is required";
    return errs;
  };

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    await axios.post(API_URL, form);
    setForm({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      status: "Pending",
    });
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API_URL}/${id}`, { status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  // ---------- FILTER + SEARCH LOGIC ----------
  const filteredTasks = tasks
    .filter((t) =>
      filter === "All" ? true : t.status === filter
    )
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;

  return (
    <div className="container">
      <h1>Task Tracker</h1>

      {/* ---------- DASHBOARD STATS ---------- */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 15 }}>
        <div><b>Total:</b> {total}</div>
        <div style={{ color: "#2ecc71" }}><b>Completed:</b> {completed}</div>
        <div style={{ color: "#e84118" }}><b>Pending:</b> {pending}</div>
      </div>

      {/* ---------- SEARCH + FILTERS ---------- */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search task title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      {/* ---------- FORM ---------- */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <button
          type="submit"
          className="add-btn"
          disabled={Object.keys(validate()).length !== 0}
        >
          Add Task
        </button>
      </form>

      {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
      {errors.dueDate && <p style={{ color: "red" }}>{errors.dueDate}</p>}

      {/* ---------- TASK LIST ---------- */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTasks.map((t) => (
          <li key={t._id} className="task-card">
            <div>
              <span className="task-title">{t.title}</span>

              <span
                className={
                  "badge " +
                  (t.priority === "High"
                    ? "high"
                    : t.priority === "Medium"
                    ? "medium"
                    : "low")
                }
              >
                {t.priority}
              </span>

              <span
                className={
                  t.status === "Pending"
                    ? "status-pending"
                    : "status-completed"
                }
              >
                {t.status}
              </span>
            </div>

            <div>
              <button
                className="toggle-btn action-btn"
                onClick={() =>
                  updateStatus(
                    t._id,
                    t.status === "Pending" ? "Completed" : "Pending"
                  )
                }
              >
                Toggle
              </button>

              <button
                className="delete-btn action-btn"
                onClick={() => deleteTask(t._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

