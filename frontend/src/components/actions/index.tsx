import React from 'react'
import './actions.css';

const ACTIONS = [
  {label: 'Одобрить', keyCombination: 'Пробел', id: 1, color: '#88BD35'},
  {label: 'Отклонить', keyCombination: 'Del', id: 2, color: '#F7882E'},
  {label: 'Эскалация', keyCombination: 'Shift + Enter', id:3, color: '#1764CC'},
  {label: 'Сохранить', keyCombination: 'F7', id:4, color: 'transparent'}
]

function Actions() {
  return (
    <div className='actions'>
      <ul>
        {
          ACTIONS.map(action => <li key={action.id}>
            <button className='action'>
              <div className="label">{action.label}</div>
              <div className="key-combination" style={{'--circle-color': action.color} as React.CSSProperties}>{action.keyCombination}</div>
            </button>
          </li>)
        }
      </ul>
    </div>
  )
}

export default Actions;