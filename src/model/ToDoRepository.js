import { createTodo } from "./ToDo";

function randomId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

export function createTodoRepositoryMock() {
  let items = [
    createTodo({ id: randomId(), title: "Tarefa1" }),
    createTodo({ id: randomId(), title: "Tarefa2" }),
  ];

  return {
    async list() {
      return [...items];
    },

    async add(title) {
      const todo = createTodo({ id: randomId(), title });
      items = [...items, todo];
      return todo;
    },

    async remove(id) {
      items = items.filter((t) => t.id !== id);
      return true;
    },
  };
}