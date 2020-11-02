import React from 'react';
import TodoList from './components/TodoList';
import './App.css';

const App = () => (
  <div className="todo-app">
    <header className="header">
      <h1 className="title">
        Todo App
      </h1>
    </header>
    <TodoList />
  </div>
);

export default App;
