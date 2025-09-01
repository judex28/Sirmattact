"use client";
import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  Task,
} from "./lib/taskService";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // ➕ new task
  const [newTask, setNewTask] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState("pending");

  // 🔎 filters
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✏️ edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

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
    if (!newTask.trim() || !newDesc.trim()) return;
    try {
      await createTask({
        title: newTask,
        description: newDesc,
        status: newStatus,
      });
      setNewTask("");
      setNewDesc("");
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

  const startEdit = (task: Task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditStatus(task.status ?? "pending"); // ✅ safe fallback
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      await updateTask(editId, {
        title: editTitle,
        description: editDesc,
        status: editStatus,
      });
      setEditId(null);
      await loadTasks();
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-yellow-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-yellow-400 drop-shadow-lg">
          📋 Task Manager
        </h1>

        {/* Add Task */}
        <div className="bg-gradient-to-r from-red-800 to-red-600 shadow-lg rounded-2xl p-4 mb-6 border border-yellow-500">
          <h2 className="text-lg font-semibold mb-3 text-yellow-300">
            Add New Task
          </h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border rounded-xl p-2 bg-black text-yellow-100 placeholder-gray-400"
            />
            <textarea
              placeholder="Enter task description..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="border rounded-xl p-2 bg-black text-yellow-100 placeholder-gray-400"
            />
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border rounded-xl p-2 bg-black text-yellow-100"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={handleCreate}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-xl shadow"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-gradient-to-r from-red-800 to-red-600 shadow-lg rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3 border border-yellow-500">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border rounded-xl p-2 bg-black text-yellow-100 placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl p-2 bg-black text-yellow-100"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        <div className="bg-black/60 shadow-lg rounded-2xl p-4 border border-yellow-600">
          {loading ? (
            <p className="text-gray-300">Loading...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-400 text-center">No tasks found.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="p-3 rounded-xl border border-yellow-700 bg-gradient-to-r from-red-900 to-red-700"
                >
                  {editId === task._id ? (
                    <div className="bg-gradient-to-r from-red-800 to-red-600 shadow-lg rounded-2xl p-4 border border-yellow-500 space-y-3">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border rounded-xl p-2 bg-black text-yellow-100 placeholder-gray-400 w-full"
                        placeholder="Edit task title..."
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="border rounded-xl p-2 bg-black text-yellow-100 placeholder-gray-400 w-full"
                        placeholder="Edit task description..."
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="border rounded-xl p-2 bg-black text-yellow-100 w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-xl shadow"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-xl shadow"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-yellow-300">
                          {task.title}
                        </h3>
                        <p className="text-sm text-yellow-100">
                          {task.description}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            task.status === "completed"
                              ? "bg-green-600 text-white"
                              : task.status === "in-progress"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(task)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
