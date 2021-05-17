import React, { useState, useEffect } from 'react'

import { Bar, Line, Pie } from 'react-chartjs-2'

export default function Chart(props) {
  return (
    <div className="chart">
      {(() => {
        switch (props.type) {
          case 0:
            return (
              <Bar
                data={props.chartData}
                options={{
                  title: {
                    display: props.displayTitle,
                    text: 'Largest Cities in Massachusetts',
                    fontSize: 25
                  },
                  legend: {
                    display: props.displayLegend,
                    position: props.legendPosition,
                    labels: {
                      fontColor: '#000'
                    }
                  }
                }}
              />
            )
          case 1:
            return (
              <Line
                data={props.chartData}
                options={{
                  title: {
                    display: props.displayTitle,
                    text: 'Largest Cities in Massachusetts',
                    fontSize: 25
                  },
                  legend: {
                    display: props.displayLegend,
                    position: props.legendPosition,
                    labels: {
                      fontColor: '#000'
                    }
                  }
                }}
              />
            )
          case 2:
            return (
              <Pie
                data={props.chartData}
                options={{
                  title: {
                    display: props.displayTitle,
                    text: 'Largest Cities in Massachusetts',
                    fontSize: 25
                  },
                  legend: {
                    display: props.displayLegend,
                    position: props.legendPosition,
                    labels: {
                      fontColor: '#000'
                    }
                  }
                }}
              />
            )
          default:
            return null
        }
      })()}
    </div>
  )
}

Chart.defaultProps = {
  displayTitle: true,
  displayLegend: false,
  legendPosition: 'bottom'
}
