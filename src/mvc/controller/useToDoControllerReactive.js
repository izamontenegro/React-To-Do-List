import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../model/ToDoRepositoryREST";
import { useToDoRealtime } from "../../realtime/useToDoRealtime";

export function useToDoController() {
  const repo = useMemo(
    () =>
      createTodoRepositoryRest({
        baseUrl: "https://twodo-tasklist.onrender.com",
      }),
    []
  );

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useToDoRealtime({
    onCreated: (task) => setTodos((prev) => [...prev, task]),
    onUpdated: (task) => setTodos((prev) => prev.map((t) => (t.id === task.id ? task : t))),
    onToggled: (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t))),
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

    try {
      await repo.add(newTitle);
      setNewTitle("");
    } catch (error) {
      alert("Erro ao adicionar tarefa.");
    }
  }

  async function deleteItem(id) {
    try {
      await repo.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      alert("Erro ao remover tarefa.");
    }
  }

  async function toggleCheckbox(id) {
    try {
      await repo.toggle(id);
      
    } catch (e) {
      alert("Erro ao atualizar.");
    }
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
