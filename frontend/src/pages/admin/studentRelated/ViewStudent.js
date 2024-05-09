import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, Collapse, IconButton, Table, TableHead, TableRow, TableCell, TableBody, TextField, Tab, InputAdornment, MenuItem, Select } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import Popup from '../../../components/Popup';
import SearchIcon from '@mui/icons-material/Search';

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response); }
    else if (error) { console.log(error); }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [payment, setPayment] = useState([]);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === "" ? { name, rollNum } : { name, rollNum, password };

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
            setPayment(userDetails.payment || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, studentID, address))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            });
    };

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            });
    };

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Attendance:</h3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell>Present</TableCell>
                                <TableCell>Total Sessions</TableCell>
                                <TableCell>Attendance Percentage</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{subName}</TableCell>
                                        <TableCell>{present}</TableCell>
                                        <TableCell>{sessions}</TableCell>
                                        <TableCell>{subjectAttendancePercentage}%</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" onClick={() => handleOpen(subId)}>
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                            <IconButton onClick={() => removeSubAttendance(subId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <Button variant="contained" onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}>
                                                Change
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <div>
                        Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                    </div>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(studentID, "RemoveStudentAtten")}>Delete All</Button>
                    <Button variant="contained" onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>Add Attendance</Button>
                </>
            );
        };

        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                    </>
                    :
                    <Button variant="contained" onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>Add Attendance</Button>
                }
            </>
        );
    };

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Subject Marks:</h3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell>Marks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{result.subName.subName}</TableCell>
                                        <TableCell>{result.marksObtained}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>Add Marks</Button>
                </>
            );
        };

        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                    </>
                    :
                    <Button variant="contained" onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>Add Marks</Button>
                }
            </>
        );
    };

    const StudentPaymentSection = () => {
        const [searchTerm, setSearchTerm] = useState('');

        const filteredPayments = payment.filter(payment => {
            if (paymentStatusFilter === 'All') {
                return payment._id.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                return payment._id.toLowerCase().includes(searchTerm.toLowerCase()) && payment.status === paymentStatusFilter;
            }
        });

        const handleSearchChange = (event) => {
            setSearchTerm(event.target.value);
        };

        const handlePaymentStatusChange = (event) => {
            setPaymentStatusFilter(event.target.value);
        };

        const renderTableSection = () => {
            return (
                <>
                    <h3>Payments:</h3>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px',marginTop: '20px' }}>
                        <TextField
                            label="Search Transaction ID"
                            variant='outlined'
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ flex: 1, marginRight: '10px' }}
                            InputProps={{
                                style: { backgroundColor: '#f5f5f5' },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Select
                            value={paymentStatusFilter}
                            onChange={handlePaymentStatusChange}
                            style={{ flex: 1 }}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Not Paid">Not Paid</MenuItem>
                        </Select>
                    </div>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                                <TableCell style={{ borderBottom: '2px solid #ddd' }}>Transaction ID</TableCell>
                                <TableCell style={{ borderBottom: '2px solid #ddd' }}>Subject</TableCell>
                                <TableCell style={{ borderBottom: '2px solid #ddd' }}>Month</TableCell>
                                <TableCell style={{ borderBottom: '2px solid #ddd' }}>Date</TableCell>
                                <TableCell style={{ borderBottom: '2px solid #ddd' }}>Payment Status</TableCell>
                                <TableCell style={{ borderBottom: '2px solid #ddd' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPayments.map((result, index) => {
                                return (
                                    <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white', cursor: 'pointer' }}>
                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>{result._id}</TableCell>
                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>{result.subNameToString}</TableCell>
                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>{result.month}</TableCell>
                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>{result.date}</TableCell>
                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>{result.status}</TableCell>
                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>{result.amount}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" onClick={() => navigate("/Admin/students/student/payment/" + studentID)} style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white' }}>Add Payment</Button>
                </>
            );
        };
        

        return (
            <>
                {payment && Array.isArray(payment) && payment.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                    </>
                    :
                    <Button variant="contained" onClick={() => navigate("/Admin/students/student/payment/" + studentID)} style={{ marginTop: '30px' }}>Add Payment</Button>
                }
            </>
        );
    };


    const StudentDetailsSection = () => {
        return (
            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <p style={{ marginBottom: '15px', fontSize: '16px' }}>
                    <strong>Name:</strong> {userDetails.name}
                    <br />
                    <strong>NIC Number:</strong> {userDetails.rollNum}
                    <br />
                    <strong>Class:</strong> {sclassName.sclassName}
                    <br />
                    <strong>School:</strong> {studentSchool.schoolName}
                </p>
                <Button variant="contained" onClick={deleteHandler} style={{ backgroundColor: '#dc3545', color: 'white', marginRight: '10px', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</Button>
                <Button variant="contained" onClick={() => { setShowTab(!showTab) }} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Edit Student
                </Button>
                <Collapse in={showTab} timeout="auto" unmountOnExit>
                    <div style={{ marginTop: '20px' }}>
                        <form onSubmit={submitHandler}>
                            <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Edit Details</h3>
                            <TextField
                                label="Name"
                                variant="outlined"
                                placeholder="Enter user's name..."
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                                required
                            />
                            <TextField
                                label="Roll Number"
                                variant="outlined"
                                placeholder="Enter user's Roll Number..."
                                value={rollNum}
                                onChange={(event) => setRollNum(event.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                                required
                            />
                            <TextField
                                type="password"
                                label="Password"
                                variant="outlined"
                                placeholder="Enter user's password..."
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <Button type="submit" variant="contained" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Update</Button>
                        </form>
                    </div>
                </Collapse>
            </div>

        );
    };

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Payment" value="2" />
                                </TabList>
                            </Box>
                            <Box sx={{ marginTop: '3rem', marginBottom: '4rem' }}>
                                <TabPanel value="1">
                                    <StudentDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <StudentPaymentSection />
                                </TabPanel>
                            </Box>
                        </TabContext>
                    </Box>
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ViewStudent;
