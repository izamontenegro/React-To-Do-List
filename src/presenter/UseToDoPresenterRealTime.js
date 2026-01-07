import { useEffect, useMemo, useState, useCallback } from "react";
import { createTodoRepository } from "../data/ToDoRepository";
import { useToDoRealtime } from "../data/UseToDoRealTime";

const baseUrl = "https://twodo-tasklist.onrender.com";

function apiTaskToTodo(task) {
  return { id: String(task.id), title: task.name };
}

export function useTodoPresenter() {
  const repo = useMemo(() => createTodoRepository({ baseUrl }), []);

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

  // helpers de merge (pra não duplicar)
  const upsertTodo = useCallback((todo) => {
    setTodos((prev) => {
      const idx = prev.findIndex((t) => t.id === todo.id);
      if (idx === -1) return [...prev, todo];
      const next = prev.slice();
      next[idx] = todo;
      return next;
    });
  }, []);

  const removeTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== String(id)));
  }, []);

  // assina realtime e aplica eventos
  useToDoRealtime({
    baseUrl,
    onCreated: (task) => upsertTodo(apiTaskToTodo(task)),
    onUpdated: (task) => upsertTodo(apiTaskToTodo(task)),
    onDeleted: (taskId) => removeTodo(taskId),
  });

  async function addNewItem() {
    const title = newTitle.trim();
    if (!title) return alert("Por favor, digite algo no campo de texto.");

    const exists = todos.some((t) => t.title.toLowerCase() === title.toLowerCase());
    if (exists) return alert("Tarefa repetida.");

    try {
      await repo.add(title);
      // NÃO dá append aqui: o socket vai mandar TASK_CREATED e a UI atualiza sem duplicar
      setNewTitle("");
    } catch (err) {
      console.error(err);
      alert("Falha ao criar tarefa na API.");
    }
  }

  async function deleteItem(id) {
    try {
      await repo.remove(id);
      // NÃO remove aqui: o socket manda TASK_DELETED
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