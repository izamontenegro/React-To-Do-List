import React from "react";
import "./ToDoView.css";

export function TodoView({ vm }) {
  const {
    todos,
    newTitle,
    setNewTitle,
    addNewItem,
    deleteItem,
  } = vm;

  return (
    <div className="container">
      <input
        placeholder="Tarefa"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />

      <button className="new-item-button" onClick={addNewItem}>
        Adicionar nova tarefa
      </button>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={() => deleteItem(todo.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}