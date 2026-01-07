export function TodoInput({ value, onChange }) {
    return (
        <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tarefa"
        />
    );
}