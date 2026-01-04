import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryMock } from "../model/ToDoRepository";

export function useTodoPresenter() {
  const repo = useMemo(() => createTodoRepositoryMock(), []);

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    let alive = true;

    repo.list().then((data) => {
      if (alive) setTodos(data);
    });

    return () => {
      alive = false;
    };
  }, [repo]);

  async function addNewItem() {
    const title = newTitle.trim();

    if (!title) {
      alert("Por favor, digite algo no campo de texto.");
      return;
    }

    const exists = todos.some((t) => t.title.toLowerCase() === title.toLowerCase());
    if (exists) {
      alert("Tarefa repetida.");
      return;
    }

    const created = await repo.add(title);
    setTodos((prev) => [...prev, created]);
    setNewTitle("");
  }

  async function deleteItem(id) {
    await repo.remove(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    state: { todos, newTitle },
    actions: { setNewTitle, addNewItem, deleteItem },
  };
}