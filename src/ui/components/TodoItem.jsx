import trashIcon from "../../assets/trashIcon.svg";

export function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.is_complete}
        onChange={() => onToggle(todo.id)}
      />

      <span className="todo-title">{todo.name}</span>

      <button
        className="icon-button"
        onClick={() => onDelete(todo.id)}
        aria-label="Deletar tarefa"
      >
        <img src={trashIcon} alt="Deletar" />
      </button>
    </li>
  );
}