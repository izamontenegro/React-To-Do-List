import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../model/ToDoRepositoryREST";

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

  useEffect(() => {
    let alive = true;

    repo.list()
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
      const created = await repo.add(newTitle);
      setTodos((prev) => [...prev, created]);
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

  async function toggleCheckbox(id, done) {
    try {
      const updated = await repo.toggle(id);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (error) {
      alert("Erro ao atualizar tarefa.");
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