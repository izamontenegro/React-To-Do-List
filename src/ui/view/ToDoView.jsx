import React from "react";
import "../ToDoView.css";
import { TodoInput } from "../components/TodoInput";
import { TodoButton } from "../components/TodoButton";
import { TodoList } from "../components/TodoList";

export function TodoView({ todos, newTitle, onNewTitleChange, onAdd, onDelete, onToggle }) {
  return (
    <div className="container">
      <TodoInput
        value={newTitle}
        onChange={onNewTitleChange}
      />
      
      <TodoButton onAdd={onAdd} />

      <TodoList
        todos={todos}
        onToggle={onToggle}
        onDelete={onDelete}
      />

    </div>
  );
}