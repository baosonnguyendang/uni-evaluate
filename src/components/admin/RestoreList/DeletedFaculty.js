import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import Typography from '@material-ui/core/Typography';

import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import { useParams } from 'react-router-dom'
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    table: {
        minWidth: 650
    },
    selectTableCell: {
        width: 120,
        paddingRight: 0,
    },
    tableCell: {
        height: 40,
    },
    input: {
        height: 40
    },
    name: {
        width: '30%',
        height: 40,
    },
    number: {
        width: '15%',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper1: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    field: {
        marginBottom: 10,
        width: '100%'
    },
    btn: {
        marginRight: 5,
        minWidth: 180,
    },
}));
const CustomTableCell = ({ row, name }) => {
    const classes = useStyles();
    return (
        <TableCell align="left" className={classes.tableCell}>
            {row[name]}
        </TableCell>
    );
};

const DeletedFaculty = () => {
    const dispatch = useDispatch()
    const classes = useStyles();
    const [rows, setRows] = useState(null);
    const token = localStorage.getItem('token')
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    const { id } = useParams()

    const fetchDeletedDept = () => {
        return axios.get('/admin/department/deleted/parent', config)
            .then(res => {
                console.log(res.data)
                setRows(res.data.departments)
            })
            .catch(e => {
                console.log(e.response)
            })
    }
    useEffect(() => {
        fetchDeletedDept()
    }, [])
    // loading restore criteron
    const [loading, setLoading] = useState(false)

    // modal xoá
    const [statusDelete, setStatusDelete] = useState({ open: false })
    const closeDialog = () => {
        setStatusDelete({ open: false })
    }
    const onRestore = id => {
        setStatusDelete({ open: true, onClick: () => restoreDeptWithAPI(id) })
    }
    // khôi phục đơn vị vs api
    const restoreDeptWithAPI = (id) => {
        setLoading(true)
        closeDialog()
        axios.post(`/admin/department/${id}/restore`, {}, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                const newRows = rows.filter(row => row.department_code !== id)
                setRows(newRows)
                dispatch(showSuccessSnackbar('Khôi phục đơn vị thành công'))
                setLoading(false)
            })
            .catch(err => {
                console.log(err.response.status)
                dispatch(showErrorSnackbar('Khôi phục đơn vị thất bại'))
                setLoading(false)
            })
    }
    if (!rows)
        return <Skeleton />
    return (
        <>
            <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text='Bạn muốn khôi phục ?' />
            <Loading open={loading} />
            <Typography component="h1" variant="h5" color="inherit" noWrap >
                Danh sách đơn vị đã xoá
            </Typography >
            <Paper className={classes.root}>
                <Table className={classes.table} aria-label="caption table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                            <TableCell className={classes.number} >Mã đơn vị</TableCell>
                            <TableCell className={classes.name} >Tên đơn vị</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row._id}>
                                <CustomTableCell {...{ row, name: "department_code" }} />
                                <CustomTableCell {...{ row, name: "name" }} />
                                <TableCell align='right' className={classes.selectTableCell}>
                                    <IconButton
                                        aria-label="restore"
                                        onClick={() => onRestore(row.department_code)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        <RestoreFromTrashIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {rows.length === 0 && <TableRow><TableCell colSpan={5}>Không có đơn vị</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}

export default DeletedFaculty
