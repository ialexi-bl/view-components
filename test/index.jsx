import React from 'react'
import ReactDOM from 'react-dom'
import view from '../dist/index.esm'

const Button = view('button')`
  bg-magenta
  ${props => props.disabled && 'font'}
`

ReactDOM.render(
  <div>
    <style>{`
      .bg-magenta {
        background: palevioletred;
      }
      .font {
        font-size: 5rem;
      }
    `}</style>
    <Button disabled>I'm a button</Button>
  </div>,
  document.getElementById('root')
)
