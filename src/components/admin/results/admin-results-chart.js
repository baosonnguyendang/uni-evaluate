import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import Charts from './admin-charts'
import axios from 'axios'
import Loading from '../../common/Loading'

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: '24px',
        display: 'inline-block',
        width: '23%'
    },
    number: {
        textAlign: 'center'
    },
    paper: {
        minHeight: 440,
        marginTop: 24,
        position: 'relative',
        padding: '10px'
    },
    tab: {
        backgroundColor: '#abcdef',
        padding: 0,
        width: '100%',
    }
}))

const AdminChart = ({ code }) => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    //lấy ít data vẽ lên biểu đồ
    const [chartData, setChartData] = useState({})
    const [chartData2, setChartData2] = useState({})
    const [chartOptions2, setChartOptions2] = useState({})
    //array gom so nguoi tham gia va khong tham gia
    const [participate, setParicipate] = useState([])

    const [rate, setRate] = useState([]) //array luu moc diem
    const [range, setRange] = useState([]) //array chua so luong gv moi moc diem

    //diem so
    const [point, setPoint] = useState([0])
    useEffect(() => {
        setLoading(true)
        if (code) {
            axios.get(`/admin/form/${ code }/formrating`)
                .then(res => {
                    console.log(res.data)
                    let list = []
                    res.data.formRatings.map(r => {
                        list.push({ min: r.min_point, max: r.max_point })
                    })
                    setRate([...list])
                    axios.get(`/admin/form/${ code }/getPoints`)
                        .then(res => {
                            console.log(res.data)
                            setPoint([...res.data.userforms])
                            let dat = []
                            let label = []
                            list.map((x, index) => {
                                index == 0 ? label.push(`< ${ x.max }`) : label.push(`${ x.min } - ${ x.max }`)
                                index == list.length - 1 ? (dat[index] = res.data.userforms.filter(y => y >= x.min && y <= x.max).length) : (dat[index] = res.data.userforms.filter(y => y >= x.min && y < x.max).length)
                            })
                            setChartData2({
                                labels: label,
                                datasets: [
                                    {
                                        label: 'Số GV/VC',
                                        data: dat,
                                        //backgroundColor:'green',
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.2)',
                                            'rgba(255, 159, 64, 0.2)',
                                            'rgba(255, 205, 86, 0.2)',
                                            'rgba(75, 192, 192, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(153, 102, 255, 0.2)'
                                        ]
                                    }
                                ]
                            })
                            setRange([...dat])
                            setParicipate(participate => [res.data.userforms.length, res.data.total - res.data.userforms.length])
                            setLoading(false)
                        })
                        .catch(err => {
                            console.log(err)
                            setLoading(false)
                        })
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)

                })
        }
    }, [code])

    useEffect(() => {
        const getChartData = () => {
            setChartData({
                labels: [
                    'Đã đánh giá',
                    'Chưa đánh giá',
                ],
                datasets: [
                    {
                        data: [participate[0], participate[1]],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                        ]
                    }
                ]
            })
        }
        getChartData()
    }, [participate])
    return (
        <div>
            <Loading open={loading} />
            <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                            {isNaN(participate[0]) ? 0 : participate[0] + participate[1]}
                        </Typography>
                        <Typography align='center' variant="body2" component="p">
                            Tổng số GV/VC tham gia đánh giá
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                            {point.length > 0 ? Math.max(...point) : '_'}
                        </Typography>
                        <Typography align='center' variant="body2" component="p">
                            Điểm số cao nhất trong biểu mẫu
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                            {point.length > 0 ? Math.max(...point) : '_'}
                        </Typography>
                        <Typography align='center' variant="body2" component="p">
                            Điểm số thấp nhất trong biểu mẫu
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                            {chartData2.datasets ? chartData2.datasets[0].data[chartData2.datasets[0].data.length - 1] : '_'}
                        </Typography>
                        <Typography align='center' variant="body2" component="p">
                            Số GV/VC đạt mức cao nhất
                        </Typography>
                    </CardContent>
                </Card>
            </div>
            <div style={{ margin: '10px 10px 10px 0', width: '100%' }}>
                <Paper style={{ width: '34%', padding: '10px', display: 'inline-block' }}>
                    <Charts data={chartData} type={2} title={'Số GV/VC đánh giá'} />
                </Paper>
                <Paper style={{ width: '64.3%', height: '100%', float: 'right', padding: '10px', display: 'inline-block' }}>
                    <Charts data={chartData2} type={0} options={chartOptions2} title={'Phân bố điểm'} />
                </Paper>
            </div>
        </div>
    )
}

export default AdminChart
