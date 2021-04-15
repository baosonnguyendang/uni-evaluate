import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

const criteria = (name, id) => ({ name, id })

const createData = (name, id, listOfCriteria) => {
  return { name, id, listOfCriteria }
}

export default function AddCriterion() {
  const [data, setData] = React.useState([
    createData('Hoạt động giảng dạy', 'TC001',
      [
        criteria('Định mức giờ chuẩn hoàn thành', '00101'),
        criteria('Kết quả khảo sát chất lượng dịch vụ', '00102'),
      ]
    ),
    createData('Hoạt động khoa học', 'TC002',
      [
        criteria('ab', '00201'),
        criteria('cd', '00202'),
      ]
    ),
  ])

  const test = () => {
    data.map(item => {
      item.listOfCriteria.map(i => {
        console.log(i.name)
      })
    })
  }

  return (
    <div>
      <button onClick={test}>a</button>
    </div>
  )
}