import React from "react";
import { useToDoController } from "../mvc/controller/UseToDoController";
import { useToDoPresenter } from "../mvp/presenter/UseToDoPresenter";
import { TodoView } from "../view/ToDoView";

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
    />
  );
}

export default App;