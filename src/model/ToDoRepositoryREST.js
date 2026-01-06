// src/model/ToDoRepository.rest.js
import { createTodo } from "./ToDo";

async function request(baseUrl, path, { method = "GET", body } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }

  return text ? JSON.parse(text) : null;
}

function apiTaskToTodo(task) {
  return createTodo({
    id: String(task.id),
    title: task.name, 
  });
}

export function createTodoRepositoryRest({ baseUrl }) {
  return {
    async list() {
      const response = await request(baseUrl, "/tasks/");
      return response.data.map(apiTaskToTodo);
    },

    async add(title) {
      const response = await request(baseUrl, "/tasks/", {
        method: "POST",
        body: { name: title }, 
      });

      return apiTaskToTodo(response.data.Error);
    },

    async remove(id) {
      await request(baseUrl, `/tasks/${id}/`, { method: "DELETE" });
      return true;
    },
  };
}