import { useEffect, useState } from 'react';
import './App.css';

function App() {
  let [list, setList] = useState([]);
  let [newItem, setNewItem] = useState("")

  useEffect(()=>{
    setList(["Tarefa1", "Tarefa2"]);
  }, []);

  return (
    <div className='container'>
      <input placeholder="Tarefa" value={newItem} onChange={value => setNewItem(value.target.value)} type="text"/>

      <button className="new-item-button" onClick={() => addNewItem()}>Adicionar nova tarefa</button>
    <ul className="todo-list">
      {
        list.map((item, index) => (
          <li className="todo-item" key={index}>
  <span>{item}</span>
  <button onClick={() => deleteItem(index)}>Deletar</button>
</li>
        ))
      }
    </ul>
     </div>
  );

  function addNewItem() {
    if (newItem.length <= 0) {
      alert('Por favor, digite algo no campo de texto.');
      return;
    }

    let itemIndex = list.indexOf(newItem)
    if (itemIndex >=0) {
       alert('Tarefa repetida.');
      return;
    }

    setList([...list, newItem]);
    setNewItem("");
  }

  function deleteItem(index) {
    let tempArray = [...list];
    tempArray.splice(index, 1);
    setList(tempArray);
  }
}

export default App;