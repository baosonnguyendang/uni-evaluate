import {
  FormGroup,
  FormLabel,
  TextField,
} from '@material-ui/core';
import Loading from '../../common/Loading'
import React, { useState, useEffect } from 'react';

import axios from 'axios'

import MUIDataTable from "mui-datatables";

export default function ResultsDashboard(props) {

  const [numOfStandards, setNumOfStandards] = useState(0)

  const [listOfStandards, setListOfStandards] = useState([])

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/admin/form/${props.code}/classifyStandards`)
      .then(res => {
        console.log(res.data)
        if (res.data.standard_points.length > 0) {
          let l = res.data.standard_points[0].standards.length
          setNumOfStandards(l)
          let c = []
          res.data.standard_points[0].standards.map(x => {
            c.push('TC ' + x.order)
          })
          setListOfStandards(c)
          let d = []
          res.data.standard_points.map(x => {
            let arr = []
            arr.push(x._id.lastname + ' ' + x._id.firstname)
            arr.push(x._id.staff_id)
            for (let i = 1; i <= l; i++) {
              let j = x.standards.find(y => y.order == i)
              arr.push(j.point > j.max_point ? j.max_point : j.point)
            }
            arr.push(x.final_point)
            d.push(arr)
          })
          setData([...d])
          setLoading(false)
        }
      })
      .catch(err => {
        console.log(err)
        setLoading(false)

      })
  }, [])

  const [ageFilterChecked, setAgeFilterChecked] = useState(false)

  const cot = [
    {
      label: 'Tên GV/VC',
      name: 'Name',
      options: {
        filter: true,
        filterType: 'textField'
      },
    },
    {
      label: 'Mã GV/VC',
      name: 'ID',
      options: {
        filter: true,
        filterType: 'multiselect'
      },
    },
  ]

  listOfStandards.map(standard => {
    cot.push(
      {
        name: standard,
        options: {
          filter: true,
          align: 'center',
          filterType: 'custom',

          // if the below value is set, these values will be used every time the table is rendered.
          // it's best to let the table internally manage the filterList
          //filterList: [25, 50],

          customFilterListOptions: {
            render: v => {
              if (v[0] && v[1] && ageFilterChecked) {
                return [`Từ: ${v[0]}`, `Đến: ${v[1]}`];
              } else if (v[0] && v[1] && !ageFilterChecked) {
                return `Từ: ${v[0]}, Đến: ${v[1]}`;
              } else if (v[0]) {
                return `Từ: ${v[0]}`;
              } else if (v[1]) {
                return `Đến: ${v[1]}`;
              }
              return [];
            },
            update: (filterList, filterPos, index) => {
              console.log('customFilterListOnDelete: ', filterList, filterPos, index);

              if (filterPos === 0) {
                filterList[index].splice(filterPos, 1, '');
              } else if (filterPos === 1) {
                filterList[index].splice(filterPos, 1);
              } else if (filterPos === -1) {
                filterList[index] = [];
              }

              return filterList;
            },
          },
          filterOptions: {
            names: [],
            logic(age, filters) {
              if (filters[0] && filters[1]) {
                return age < filters[0] || age > filters[1];
              } else if (filters[0]) {
                return age < filters[0];
              } else if (filters[1]) {
                return age > filters[1];
              }
              return false;
            },
            display: (filterList, onChange, index, column) => (
              <div>
                <FormLabel>Điểm {standard}</FormLabel>
                <FormGroup row>
                  <TextField
                    label='Từ'
                    value={filterList[index][0] || ''}
                    onChange={event => {
                      filterList[index][0] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                    style={{ width: '45%', marginRight: '5%' }}
                  />
                  <TextField
                    label='Đến'
                    value={filterList[index][1] || ''}
                    onChange={event => {
                      filterList[index][1] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                    style={{ width: '45%' }}
                  />
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={ageFilterChecked}
                        onChange={event => setAgeFilterChecked(event.target.checked)}
                      />
                    }
                    label='Separate Values'
                    style={{ marginLeft: '0px' }}
                  /> */}
                </FormGroup>
              </div>
            ),
          },
          print: false,
        },
      }
    )
  })

  cot.push(
    {
      label: 'Tổng điểm',
      name: 'Point',
      options: {
        filter: true,
        align: 'center',
        filterType: 'custom',

        // if the below value is set, these values will be used every time the table is rendered.
        // it's best to let the table internally manage the filterList
        //filterList: [25, 50],

        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1] && ageFilterChecked) {
              return [`Từ: ${v[0]}`, `Đến: ${v[1]}`];
            } else if (v[0] && v[1] && !ageFilterChecked) {
              return `Từ: ${v[0]}, Đến: ${v[1]}`;
            } else if (v[0]) {
              return `Từ: ${v[0]}`;
            } else if (v[1]) {
              return `Đến: ${v[1]}`;
            }
            return [];
          },
          update: (filterList, filterPos, index) => {
            console.log('customFilterListOnDelete: ', filterList, filterPos, index);

            if (filterPos === 0) {
              filterList[index].splice(filterPos, 1, '');
            } else if (filterPos === 1) {
              filterList[index].splice(filterPos, 1);
            } else if (filterPos === -1) {
              filterList[index] = [];
            }

            return filterList;
          },
        },
        filterOptions: {
          names: [],
          logic(age, filters) {
            if (filters[0] && filters[1]) {
              return age < filters[0] || age > filters[1];
            } else if (filters[0]) {
              return age < filters[0];
            } else if (filters[1]) {
              return age > filters[1];
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <FormLabel>Tổng điểm</FormLabel>
              <FormGroup row>
                <TextField
                  label='Từ'
                  value={filterList[index][0] || ''}
                  onChange={event => {
                    filterList[index][0] = event.target.value;
                    onChange(filterList[index], index, column);
                  }}
                  style={{ width: '45%', marginRight: '5%' }}
                />
                <TextField
                  label='Đến'
                  value={filterList[index][1] || ''}
                  onChange={event => {
                    filterList[index][1] = event.target.value;
                    onChange(filterList[index], index, column);
                  }}
                  style={{ width: '45%' }}
                />
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      checked={ageFilterChecked}
                      onChange={event => setAgeFilterChecked(event.target.checked)}
                    />
                  }
                  label='Separate Values'
                  style={{ marginLeft: '0px' }}
                /> */}
              </FormGroup>
            </div>
          ),
        },
        print: false,
      },
    },
  )

  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    selectableRows: 'none',
    setFilterChipProps: (colIndex, colName, data) => {
      //console.log(colIndex, colName, data);
      return {
        color: 'primary',
        variant: 'outlined',
        className: 'testClass123',
      };
    }
  };
  if (loading) return <div style={{ minHeight: 440 }}  >
    <Loading open />
  </div>
  return (
    <div>
      <MUIDataTable title={'KẾT QUẢ CHI TIẾT'} data={data} columns={cot} options={options} />
    </div>
  )

}