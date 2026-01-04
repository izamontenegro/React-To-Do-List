import { useEffect, useState } from "react";
import "./App.css";
import api from "./services/api";

function App() {
  const [list, setList] = useState([]);
  const [newItem, setNewItem] = useState("");

  // 🔄 BUSCAR TAREFAS DO BACKEND
  useEffect(() => {
    api.get("/")
      .then((response) => {
        // Ajuste: verifica se os dados vêm dentro de 'tasks' ou direto no array
        const tasks = response.data.tasks || response.data;
        setList(Array.isArray(tasks) ? tasks : []);
      })
      .catch((error) => {
        console.error("Erro ao buscar tarefas:", error);
      });
  }, []);

  // ➕ CRIAR NOVA TAREFA
  function addNewItem() {
    if (!newItem) {
      alert("Digite uma tarefa");
      return;
    }

    // ✅ ENVIANDO SEM USER_ID:
    // Isso evita o erro de chave estrangeira (ForeignKeyViolation) 
    // enquanto você não tem usuários cadastrados no Postgres.
    api.post("/", {
      name: newItem,
      is_complete: false
      // user_id: 1 <- Removido para evitar erro 500/CORS
    })
      .then((response) => {
        // Pega a tarefa criada (ajustado para aceitar diferentes formatos de retorno)
        const tarefaCriada = response.data.task || response.data;
        setList([...list, tarefaCriada]);
        setNewItem("");
      })
      .catch((error) => {
        console.error("Erro ao criar tarefa:", error);
        alert("Erro ao conectar com o servidor. Verifique o console do Backend.");
      });
  }

  // ❌ REMOVER TAREFA
  function deleteItem(id) {
    api.delete(`/${id}`)
      .then(() => {
        setList(list.filter(task => task.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao deletar tarefa:", error);
      });
  }

  return (
    <div className="container">
      <div className="input-group">
        <input
          placeholder="Digite sua tarefa..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          type="text"
        />
        <button className="new-item-button" onClick={addNewItem}>
          Adicionar
        </button>
      </div>

      <ul className="todo-list">
        {list.map((task) => (
          <li className="todo-item" key={task.id}>
            <span>{task.name}</span>
            <button className="delete-button" onClick={() => deleteItem(task.id)}>
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;