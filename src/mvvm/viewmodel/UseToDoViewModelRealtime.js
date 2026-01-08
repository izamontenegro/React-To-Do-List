import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../../data/ToDoRepositoryREST";
import { useToDoRealtime } from "../../data/UseToDoRealtime";

const baseUrl = "https://twodo-tasklist.onrender.com";

export function useToDoViewModel() {
  const repo = useMemo(() => createTodoRepositoryRest({ baseUrl }), []);

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    let alive = true;

    repo
      .list()
      .then((data) => alive && setTodos(data))
      .catch(() => alert("Falha ao carregar tarefas"));

    return () => (alive = false);
  }, [repo]);

  useToDoRealtime({
    onCreated: (task) => {
      setTodos((prev) =>
        prev.some((t) => t.id === task.id) ? prev : [...prev, task]
      );
    },

    onDeleted: (id) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
  });

  async function addNewItem() {
    const title = newTitle.trim();
    if (!title) return alert("Por favor, digite algo.");

    const exists = todos.some(
      (t) => typeof t.title === "string" && t.title.toLowerCase() === title.toLowerCase()
    );
    if (exists) return alert("Tarefa repetida.");

    try {
      await repo.add(title);
      setNewTitle(""); // estado local apenas
    } catch {
      alert("Falha ao criar tarefa.");
    }
  }

  async function deleteItem(id) {
    try {
      await repo.remove(id);
    } catch {
      alert("Falha ao deletar tarefa.");
    }
  }

  return {
    todos,
    newTitle,
    setNewTitle,
    addNewItem,
    deleteItem,
  };
}