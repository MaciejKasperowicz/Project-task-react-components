import React from 'react';


export class Task extends React.Component {
    render() {
        const { id, name, totalTime, isRunning, isDone, startTask, stopTask, toggleTask, removeTask } = this.props;
        return (
            <li className={
                isRunning ? 'task__item task__item--isRunning' : "task__item"
                    && isDone ? 'task__item task__item--isDone' : "task__item"
            }>
                <div className="task__summary">
                    <h3 className='task__title'>{name}</h3>
                    <h4 className="task__time">Czas wykonywania: {totalTime}</h4>
                </div>

                <div className="task__btns">
                    <button className='task__btn task__btn--startStop task__btn--start'
                        disabled={isRunning ? true : false || isDone ? true : false}
                        onClick={() => startTask(id)}>
                        START TASK
                    </button>
                    <button className='task__btn task__btn--startStop task__btn--stop'
                        disabled={isRunning ? false : true}
                        onClick={() => stopTask(id)}>
                        STOP TASK
                    </button>
                    <button className='task__btn task__btn--toggleRemove task__btn--toggle'
                        disabled={totalTime ? false : true}
                        onClick={() => toggleTask(id)}
                    >
                        {isDone ? "SET INCOMPLETE" : "SET FINISHED"}
                    </button>
                    <button className='task__btn task__btn--toggleRemove task__btn--remove'
                        disabled={isDone ? false : true}
                        onClick={() => removeTask(id)}>
                        REMOVE
                    </button>
                </div>


            </li>
        )
    }
}

export default Task