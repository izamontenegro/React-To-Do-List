import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../../data/ToDoRepositoryREST";

export function useToDoViewModel() {
  const repo = useMemo(
    () => createTodoRepositoryRest({ baseUrl: "https://twodo-tasklist.onrender.com" }),
    []
  );

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    let alive = true;

    repo
      .list()
      .then((data) => {
        if (alive) setTodos(data);
      })
      .catch((err) => {
        console.error(err);
        console.error("[ERROR] Falha ao carregar tarefas da API");
        alert("Falha ao carregar tarefas da API.");
      });

    return () => {
      alive = false;
    };
  }, [repo]);

  async function addNewItem() {
    const title = newTitle.trim();
    if (!title) return

    try {
      const created = await repo.add(title);
      setTodos((prev) => [...prev, created]);
      setNewTitle("");
    } catch (err) {
      console.error(err);
      alert("Falha ao criar tarefa na API.");
    }
  }

  async function deleteItem(id) {
    try {
      await repo.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Falha ao deletar tarefa na API.");
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