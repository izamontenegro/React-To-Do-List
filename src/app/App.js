import React from "react";
import { useTodoPresenter } from "../mvp/presenter/UseToDoPresenter.js"; //MVP
import { useToDoController } from "../mvc/controller/useToDoControllerReactive.js";
import { TodoView } from "../ui/view/ToDoView.jsx";

function App() {
  // Esse trecho usa o MVP
  /*
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
  */
  // Esse trecho usa o MVC:
  const controller = useToDoController();
  
  return (
    <TodoView
      todos={controller.todos}
      newTitle={controller.newTitle}
      onNewTitleChange={controller.setNewTitle}
      onAdd={controller.addNewItem}
      onDelete={controller.deleteItem}
      onToggle={controller.toggleCheckbox}
    />
  );
}

export default App;