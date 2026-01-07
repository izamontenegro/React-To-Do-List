export function TodoButton({ onAdd }) {
    return (
        <button className="new-item-button" onClick={onAdd}>
            Adicionar nova tarefa
        </button>
    );
}