import React from 'react';
import ReactDOM from 'react-dom';

import TasksManager from './components/TasksManager'

import './styles/main.css';


const App = () => <TasksManager />;

ReactDOM.render(
    <App />,
    // <TasksManager />,
    document.querySelector('#root')
);
