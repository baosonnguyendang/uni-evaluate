import React, { useState, useEffect } from 'react'

import './styles.css'

import Chart from './charts'


export default function Charts(props) {
  const [chartData, setChartData] = useState({})
  // state = {
  //   chartData: {}
  // }

  useEffect(() => {
    getChartData()
  }, [])

  // componentWillMount() {
  //   this.getChartData()
  // }

  const getChartData = () => {
    setChartData({
      labels: [
        'Đã đánh giá',
        'Chưa đánh giá',
      ],
      datasets: [
        {
          data: [70, 3],
          //backgroundColor:'green',
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ]
        }
      ]
    })
  }

  return (
    <div>
      <div className="App">
        <h5>{props.title}</h5>
        <Chart type={props.type} chartData={props.data} displayLegend={false} />
      </div>
    </div>
  )
}

