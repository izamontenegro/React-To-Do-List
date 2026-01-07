import { createTodo } from "../model/ToDo";

async function request(baseUrl, path, { method = "GET", body } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function apiTaskToTodo(task) {
  return createTodo({
    id: String(task.id),
    title: task.title, 
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

      if (!response?.data) throw new Error("API did not return created task");

      return apiTaskToTodo(response.data);
    },

    async remove(id) {
      await request(baseUrl, `/tasks/${id}`, { method: "DELETE" });
      return true;
    }
  };
}