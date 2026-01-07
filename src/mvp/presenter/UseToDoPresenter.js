import { useEffect, useMemo, useState } from "react";
import { createTodoRepositoryRest } from "../model/ToDoRepositoryREST";
import { useToDoRealtime } from "../realtime/useToDoRealtime";

export function useTodoPresenter() {
  const repo = useMemo(
    () => createTodoRepositoryRest({ baseUrl: "https://twodo-tasklist.onrender.com" }),
    []
  );

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useToDoRealtime({
    onCreated: (task) =>
      setTodos((prev) => [...prev, task]),

    onUpdated: (task) =>
      setTodos((prev) =>
        prev.map((t) => (t.id === task.id ? task : t))
      ),

    onToggled: (task) =>
      setTodos((prev) =>
        prev.map((t) => (t.id === task.id ? task : t))
      ),

    onDeleted: (id) =>
      setTodos((prev) => prev.filter((t) => t.id !== id)),
  });

  useEffect(() => {
    let alive = true;

    repo
      .list()
      .then((data) => {
        if (alive) setTodos(data);
      })
      .catch((err) => {
        console.error(err);
        console.error("oiiiii");
        alert("Falha ao carregar tarefas da API.");
      });

    return () => {
      alive = false;
    };
  }, [repo]);

  async function addNewItem() {
    const title = newTitle.trim();
    if (!title) return alert("Por favor, digite algo no campo de texto.");

    const exists = todos.some((t) => t.title.toLowerCase() === title.toLowerCase());
    if (exists) return alert("Tarefa repetida.");

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

  async function toggleCheckbox(id) {
    try {
      const updated = await repo.toggle(id);

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? updated : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Falha ao atualizar estado da tarefa.");
    }
  }

  return {
    state: { todos, newTitle },
    actions: { setNewTitle, addNewItem, deleteItem, toggleCheckbox },
  };
}