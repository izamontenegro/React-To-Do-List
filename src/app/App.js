import React from "react";
import { useTodoViewModel } from "../viewmodel/UseToDoViewModel.js";
import { TodoView } from "../view/ToDoView.jsx";

function App() {
  const vm = useTodoViewModel();
  return <TodoView vm={vm} />;
}

export default App;