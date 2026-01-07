import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../model/ToDoRepositoryREST";

export function useTodoPresenter() {
  const repo = useMemo(
    () => createTodoRepositoryRest({ baseUrl: "https://twodo-tasklist.onrender.com" }),
    []
  );

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    let alive = true;
    repo.list()
      .then((data) => { if (alive) setTodos(data); })
      .catch((err) => alert("Erro ao carregar dados."));
    return () => { alive = false; };
  }, [repo]);

  async function addNewItem() {
    const title = newTitle.trim();
    if (!title) return;
    try {
      const created = await repo.add(title);
      setTodos((prev) => [...prev, created]);
      setNewTitle("");
    } catch (err) {
      alert("Erro ao criar item.");
    }
  }

  async function deleteItem(id) {
    try {
      await repo.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Erro ao remover item.");
    }
  }

  async function toggleCheckbox(id) {
    try {
      const updated = await repo.toggle(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert("Erro ao atualizar item.");
    }
  }

  return {
    state: { todos, newTitle },
    actions: { setNewTitle, addNewItem, deleteItem, toggleCheckbox },
  };
}