import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, IconButton, TextField, ButtonGroup, Button,
    InputAdornment
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { BlackButton, BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import SearchIcon from '@mui/icons-material/Search';

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState('');

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                setMessage("Successfully deleted. " + deleteID)
                dispatch(getAllStudents(currentUser._id));
                setShowPopup(true)
            })
    }

    console.log(currentUser)

    const studentColumns = [
        { id: 'name', label: 'Student Name', minWidth: 170 },
        { id: 'rollNum', label: 'Student ID Number', minWidth: 100 },
        { id: 'sclassName', label: 'Institute', minWidth: 170 },
    ]

    const StudentButtonHaver = ({ row }) => {
        const options = ['Add Payments'];

        const handlePayments = () => {
            navigate("/Admin/students/student/payment/" + row.id)
        }

        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton variant="contained" onClick={() => navigate("/Admin/students/student/" + row.id)} sx={{ marginRight: '10px' }}>
                    View
                </BlueButton>
                <ButtonGroup variant="contained" sx={{ marginRight: '10px' }}>
                    <Button onClick={handlePayments}>{options[0]}</Button>
                </ButtonGroup>
            </>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    const studentRows = studentsList.filter(student =>
        student.rollNum.toLowerCase().includes(searchQuery.toLowerCase())
    ).map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        sclassName: student.sclassName.sclassName,
        id: student._id,
    }));

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <>
            <TextField
                variant="standard"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder='Find By Student ID'
                sx={{
                    marginBottom: '16px',
                    marginTop: '30px',
                    width: '95%',
                    marginLeft: '20px',
                }}
                InputProps={{
                    style: { backgroundColor: '#f5f5f5' },
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="primary" />
                        </InputAdornment>
                    ),
                }}
            />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {response ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
                                Add Students
                            </GreenButton>
                        </Box>
                    ) : (
                        <Paper sx={{ width: '95%', overflow: 'hidden', marginLeft: '25px' }}>
                            {Array.isArray(studentRows) && studentRows.length > 0 && (
                                <TableTemplate
                                    buttonHaver={StudentButtonHaver}
                                    columns={studentColumns}
                                    rows={studentRows}
                                />
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </Paper>

                    )}
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ShowStudents;
