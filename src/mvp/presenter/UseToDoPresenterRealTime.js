import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../../data/ToDoRepositoryREST";
import { useToDoRealtime } from "../../data/UseToDoRealtime";

const baseUrl = "https://twodo-tasklist.onrender.com";

export function useTodoPresenter() {
  const repo = useMemo(() => createTodoRepositoryRest({ baseUrl }), []);

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
        alert("Falha ao carregar tarefas da API.");
      });

    return () => {
      alive = false;
    };
  }, [repo]);

  useToDoRealtime({
      onCreated: (task) => setTodos((prev) => [...prev, task]),
      onDeleted: (id) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    });

  async function addNewItem() {
    const title = newTitle.trim();
    if (!title) return alert("Por favor, digite algo no campo de texto.");

    const exists = todos.some((t) => t.title.toLowerCase() === title.toLowerCase());
    if (exists) return alert("Tarefa repetida.");

    try {
      await repo.add(title);
      setNewTitle("");
    } catch (err) {
      console.error(err);
      alert("Falha ao criar tarefa na API.");
    }
  }

  async function deleteItem(id) {
    try {
      await repo.remove(id);
    } catch (err) {
      console.error(err);
      alert("Falha ao deletar tarefa na API.");
    }
  }

  return {
    state: { todos, newTitle },
    actions: { setNewTitle, addNewItem, deleteItem },
  };
}