import React from 'react'
import './actions.css';

const ACTIONS = [
  {label: 'Одобрить', keyCombination: 'Пробел', id: 1},
  {label: 'Отклонить', keyCombination: 'Del', id: 2},
  {label: 'Эскалация', keyCombination: 'Shift + Enter', id:3},
  {label: 'Сохранить', keyCombination: 'F7', id:4}
]

function Actions() {
  return (
    <div className='actions'>
      <ul>
        {
          ACTIONS.map(action => <li key={action.id}>
            <button className='action'>
              <div className="label">{action.label}</div>
              <div className="key-combination">{action.keyCombination}</div>
            </button>
          </li>)
        }
      </ul>
    </div>
  )
}

export default Actions;