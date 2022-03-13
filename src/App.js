import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = "http://localhost/shoppinglist/";

function App() {

  const [item, setItem] = useState('')
  const [items, setItems] = useState([])
  const [amount, setAmount] = useState("")

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
        console.log(response)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error)

      })
  }, [])


  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({ description: item, amount: amount })

    axios.post(URL + 'add.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {

        setItems(items => [...items, response.data])
        setAmount(items => [...items, response.data])
        setItem('')
        setAmount('')
      }).catch(error => {
        alert(error.response ? error.response.error : error)
      })
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post(URL + "delete.php", json, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id)
      setItems(newListWithoutRemoved)
    }).catch(error => {
      alert(error.response ? error.response.error : error)
    })
  }

  return (
    <div className='container-fluid'>
      <form onSubmit={save}>
        <div>
          <h2>Shoppinglist</h2>
        </div>
        <div>
          <label>New item</label>
          <input type="text" placeholder='type description' value={item}
            onChange={e => setItem(e.target.value)} />
          <input type="text" placeholder='type amount' value={amount} onChange={e => setAmount(e.target.value)} />
          <button>Add</button>
        </div>
      </form>
      <div className='items'>
        {
          items?.map(item => (
            <div className='row' key={item.id}>
              <div className='d-inline col-4 text-left'>
                {item.description}
              </div>
              <div className='d-inline col-4 text-left'>
                {item.amount}
              </div>

              <div className='d-inline col-4 text-left'>
                <a href="#" className='delete' onClick={() => remove(item.id)}>Delete</a>
              </div>
            </div>
          ))
        }
      </div>
    </div>

  );
}

export default App;
