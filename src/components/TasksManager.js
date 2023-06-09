import React from 'react';
import Task from './Task';


export class TasksManager extends React.Component {
    state = {
        urlAPI: "http://localhost:3005/tasks",
        newTaskText: "",
        tasks: [],
    }

    loadData() {
        this._fetch()
            .then(data => this.insertTasks(data))
            .catch(err => console.error(err))
    }

    insertTasks(data) {
        this.setState(() => ({
            tasks: data
        }))
    }

    addData(data) {
        const options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        }

        return this._fetch(options)
    }

    updateData(id, data) {
        const options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        }

        return this._fetch(options, `/${id}`);
    }

    _fetch(options = {}, additionalPath = "") {
        const { urlAPI } = this.state;
        const url = `${urlAPI}${additionalPath}`;
        return fetch(url, options)
            .then(resp => {
                if (resp.ok) { return resp.json() }
                return Promise.reject(resp);
            })
            .catch(err => console.log("Error:", err))
    }



    onClick = () => {
        const { tasks } = this.state;
        console.log(tasks)
    }

    onNewTaskTextChange = (e) => {
        this.setState(() => ({
            newTaskText: e.target.value
        }
        ));
    }

    addNewTask = (e) => {
        const { newTaskText } = this.state;
        e.preventDefault();
        if (!newTaskText) return

        const newTask = {
            name: newTaskText,
            time: null,
            isRunning: false,
            isDone: false,
            isRemoved: false
        }
        this.addData(newTask)
            .then(resp => newTask.id = resp.id)
            .then(() => {
                this.setState(prevState => {
                    return {
                        newTaskText: "",
                        tasks: [...prevState.tasks, newTask]
                    }
                })
            })
    }

    toggleTask = (id) => {
        this.setState((prevState) => ({
            tasks: prevState.tasks.map(task => {
                if (task.id !== id) return task
                else {
                    const taskToUpdate = {
                        ...task,
                        isDone: !task.isDone
                    };
                    this.updateData(id, taskToUpdate);
                    return taskToUpdate
                }
            })
        }))

        this.setState((prevState) => ({
            tasks: prevState.tasks.sort((task1, task2) => (
                task1.isDone - task2.isDone
            ))
        }))
    }

    removeTask = (id) => {
        this.setState((prevState) => ({
            tasks: prevState.tasks.map(task => {
                if (task.id !== id) return task
                else {
                    const taskToUpdate = {
                        ...task,
                        isRemoved: true
                    };
                    this.updateData(id, taskToUpdate);
                    return taskToUpdate
                }
            })
        }))

        this.setState((prevState) => ({
            tasks: prevState.tasks.filter(task => {
                if (task.isRemoved !== true) return task
            })
        }))
    }

    startTask = (id) => {
        const startingTime = Date.now();
        this.setState(prevState => ({
            tasks: prevState.tasks.map(task => {
                if (task.id !== id) return task
                else {

                    const taskToUpdate = {
                        ...task,
                        isRunning: true,
                        isDone: false,
                        startingTime: startingTime,
                    };

                    this.updateData(id, taskToUpdate);
                    return taskToUpdate
                }
            })
        }))
    }

    stopTask = (id) => {
        const stopTime = Date.now();
        this.setState(prevState => ({
            tasks: prevState.tasks.map(task => {
                if (task.id !== id) return task
                else {
                    const lapTime = stopTime - task.startingTime;
                    const time = lapTime + (task.time > 0 ? task.time : 0);
                    const totalTime = this.__getTime(time);
                    const taskToUpdate = {
                        ...task,
                        isRunning: false,
                        lapTime: lapTime,
                        time: time,
                        totalTime: totalTime

                    };
                    this.updateData(id, taskToUpdate);
                    return taskToUpdate
                }
            })
        }))
    }



    __getTime = (millis) => {
        return (new Date(millis).toISOString().slice(11, 19))
    }


    componentDidMount() {
        this.loadData();
    }


    render() {
        const { tasks, newTaskText } = this.state;
        return (
            <>
                <header className='header'>
                    <h1 className="header__title" onClick={this.onClick}>TasksManager</h1>
                    <div className="header__form">
                        <form onSubmit={this.addNewTask}>
                            <div className="header__label">
                                <label> Podaj nazwę zadania:
                                </label>
                            </div>
                            <div className='header__task'>
                                <input className="header__input"
                                    type="text" name="task" value={newTaskText} onChange={this.onNewTaskTextChange} />
                                <button className='header__btn'>
                                    DODAJ
                                </button>
                            </div>
                        </form>
                    </div>
                </header>
                <section className="section__tasks">
                    <h2 className="tasks__header">
                        Lista zadań do wykonania:
                    </h2>
                    <ul className='tasks__list'>
                        {tasks ? tasks.map(({ id, name, totalTime, isRunning, isDone, isRemoved }) => {
                            if (isRemoved) return null
                            return <Task
                                key={id}
                                id={id}
                                name={name}
                                totalTime={totalTime}
                                isRunning={isRunning}
                                isDone={isDone}
                                isRemoved={isRemoved}
                                startTask={this.startTask}
                                stopTask={this.stopTask}
                                toggleTask={this.toggleTask}
                                removeTask={this.removeTask}
                            />
                        }) : null}
                    </ul>
                </section>

            </>
        )
    }
}

export default TasksManager;

