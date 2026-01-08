import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../../data/ToDoRepositoryREST";
import { useToDoRealtime } from "../../data/UseToDoRealtime"

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
      console.log(newTitle);
      setNewTitle("");
    } catch (error) {
      console.log(error);
      alert("Erro ao adicionar tarefa.");
    }
  }

  async function deleteItem(id) {
    try {
      await repo.remove(id);
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
