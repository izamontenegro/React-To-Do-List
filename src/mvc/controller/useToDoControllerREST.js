import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../../data/ToDoRepositoryREST";

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
    const title = newTitle.trim();
    if (!title) return;

    try {
      const createdTask = await repo.add(title);
      setTodos((prev) => [...prev, createdTask]);
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

  return {
    todos,
    newTitle,
    setNewTitle,
    addNewItem,
    deleteItem,
  };
}