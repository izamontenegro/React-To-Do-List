import React from "react";
import "./ToDoView.css";

export function TodoView({ todos, newTitle, onNewTitleChange, onAdd, onDelete }) {
  return (
    <div className="container">
      <input
        placeholder="Tarefa"
        value={newTitle}
        onChange={(e) => onNewTitleChange(e.target.value)}
        type="text"
      />

      <button className="new-item-button" onClick={onAdd}>
        Adicionar nova tarefa
      </button>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <span className="todo-title">{todo.name}</span>
            <button 
              className="delete-button" 
              onClick={() => onDelete(todo.id)}
              title="Excluir tarefa"
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}