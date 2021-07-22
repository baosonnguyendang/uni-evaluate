import React from 'react'

import './styles.css'

import Chart from './charts'


export default function Charts(props) {
  return (
    <div>
      <div className="App">
        <h5>{props.title}</h5>
        <Chart type={props.type} chartData={props.data} options={props.options} />
      </div>
    </div>
  )
}

