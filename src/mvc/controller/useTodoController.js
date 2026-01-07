import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../model/ToDoRepositoryREST";
import { useTodoRealtime } from "../../realtime/useTodoRealtime";

export function useTodoController() {
  const repo = useMemo(
    () =>
      createTodoRepositoryRest({
        baseUrl: "https://twodo-tasklist.onrender.com",
      }),
    []
  );

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useTodoRealtime({
    onCreated: (task) => setTodos((prev) => [...prev, task]),
    onUpdated: (task) => setTodos((prev) => prev.map((t) => (t.id === task.id ? task : t))),
    onToggled: (task) => setTodos((prev) => prev.map((t) => (t.id === task.id ? task : t))),
    onDeleted: (id) => setTodos((prev) => prev.filter((t) => t.id !== id)),
  });

  useEffect(() => {
    let alive = true;

    repo
      .list()
      .then((data) => {
        if (alive) setTodos(data);
      })
      .catch(() => {
        alert("Falha ao carregar tarefas.");
      });

    return () => {
      alive = false;
    };
  }, [repo]);

  async function addNewItem() {
    if (!newTitle.trim()) return;

    await repo.add(newTitle); 
    
    setNewTitle(""); 
  }

  async function deleteItem(id) {
    await repo.remove(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  async function toggleCheckbox(id, done) {
    await repo.toggle(id);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done } : t))
    );
  }

  return {
    todos,
    newTitle,
    setNewTitle,
    addNewItem,
    deleteItem,
    toggleCheckbox,
  };
}
