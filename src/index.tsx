import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals';
import configureStore from "./store/";

if (localStorage.getItem('lists')?.length === (0 || undefined)) {
  localStorage.setItem('lists', JSON.stringify([{id:0, name: 'OpachaName'}, {id:1, name: 'NuTakoeName'}]));
  localStorage.setItem('cards', JSON.stringify([
    {id: 0, name: 'OpaTask', listId: 0, details: 'Create another task'},
    {id: 1, name: 'TaskOpa', listId: 0, details: 'Add few things'},
  ]));
  localStorage.setItem('comments', JSON.stringify([
    {id: 0, text: 'О, привет, а я тебя знаю!', cardId: 0, author: 'VasyaPupkin'}
  ]));
}

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
