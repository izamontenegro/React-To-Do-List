import React from "react";
import { useTodoPresenter } from "../presenter/UseToDoPresenter.js";
import { TodoView } from "../view/ToDoView.jsx";

function App() {
  const { state, actions } = useTodoPresenter();

  return (
    <TodoView
      todos={state.todos}
      newTitle={state.newTitle}
      onNewTitleChange={actions.setNewTitle}
      onAdd={actions.addNewItem}
      onDelete={actions.deleteItem}
    />
  );
}

export default App;