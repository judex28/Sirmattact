"use client";
import api from "./api";

export interface Task {
  _id: string;
  title: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create Task
export const createTask = async (taskData: Partial<Task>) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

// Get All Tasks
export const getTasks = async (keyword?: string, status?: string) => {
  const res = await api.get("/tasks", { params: { keyword, status } });
  return res.data;
};

// Get Task by ID
export const getTaskById = async (id: string) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

// Update Task
export const updateTask = async (id: string, updates: Partial<Task>) => {
  const res = await api.put(`/tasks/${id}`, updates);
  return res.data;
};

// Delete Task
export const deleteTask = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
