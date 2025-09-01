"use client";
import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, Task } from "./lib/taskService";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadTasks();
  }, [keyword, statusFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(keyword, statusFilter);
      setTasks(data || []);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newTask.trim()) return;
    try {
      await createTask({ title: newTask, status: newStatus });
      setNewTask("");
      setNewStatus("pending");
      await loadTasks();
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 Task Manager</h1>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter task title..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <span className="font-semibold">{task.title}</span>
                <span className="ml-2 text-sm text-gray-600">
                  ({task.status})
                </span>
              </div>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
