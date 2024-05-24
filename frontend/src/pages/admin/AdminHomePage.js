import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Popover, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SeeNotice from '../../components/SeeNotice';
import StudentsIcon from "../../assets/img1.png";
import ClassesIcon from "../../assets/img2.png";
import TeachersIcon from "../../assets/img3.png";
import FeesIcon from "../../assets/img4.png";
import AttendanceIcon from "@mui/icons-material/EventNote";
import ExamResultsIcon from "@mui/icons-material/Assignment";
import PaymentsIcon from "@mui/icons-material/Payment";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    // Calculate the sum of payments
    const totalPayments = studentsList.reduce((acc, student) => {
        if (student.payment) {
            const paymentsTotal = student.payment.reduce((sum, payment) => sum + payment.amount, 0);
            return acc + paymentsTotal;
        }
        return acc;
    }, 0);

    // Calculate 20% of totalPayments
    const institutePaymentCut = totalPayments * 0.2;

    // State variables for search
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    // Update filtered students when studentsList changes or searchQuery changes
    useEffect(() => {
        const filtered = studentsList.filter(student =>
            student.rollNum.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [studentsList, searchQuery]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const StudentTableRow = ({ student }) => {
        const [attendanceAnchorEl, setAttendanceAnchorEl] = useState(null);
        const [examResultsAnchorEl, setExamResultsAnchorEl] = useState(null);
        const [paymentsAnchorEl, setPaymentsAnchorEl] = useState(null);

        const handleAttendancePopoverOpen = (event) => {
            setAttendanceAnchorEl(event.currentTarget);
        };

        const handleAttendancePopoverClose = () => {
            setAttendanceAnchorEl(null);
        };

        // const handleExamResultsPopoverOpen = (event) => {
        //     setExamResultsAnchorEl(event.currentTarget);
        // };

        const handleExamResultsPopoverClose = () => {
            setExamResultsAnchorEl(null);
        };

        const handlePaymentsPopoverOpen = (event) => {
            setPaymentsAnchorEl(event.currentTarget);
        };

        const handlePaymentsPopoverClose = () => {
            setPaymentsAnchorEl(null);
        };

        return (
            <TableRow key={student._id}>
                <TableCell>{student.rollNum}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                    <Button startIcon={<AttendanceIcon />} onClick={handleAttendancePopoverOpen}>View</Button>
                    <Popover
                        open={Boolean(attendanceAnchorEl)}
                        anchorEl={attendanceAnchorEl}
                        onClose={handleAttendancePopoverClose}
                    >
                        <AttendancePopoverContent>
                            {renderAttendance(student.attendance)}
                        </AttendancePopoverContent>
                    </Popover>
                </TableCell>
                {/* <TableCell>
                    <Button startIcon={<ExamResultsIcon />} onClick={handleExamResultsPopoverOpen}>View</Button>
                    <Popover
                        open={Boolean(examResultsAnchorEl)}
                        anchorEl={examResultsAnchorEl}
                        onClose={handleExamResultsPopoverClose}
                    >
                        <ExamResultsPopoverContent>
                            {renderExamResults(student.examResult)}
                        </ExamResultsPopoverContent>
                    </Popover>
                </TableCell> */}
                <TableCell>
                    <Button startIcon={<PaymentsIcon />} onClick={handlePaymentsPopoverOpen}>View</Button>
                    <Popover
                        open={Boolean(paymentsAnchorEl)}
                        anchorEl={paymentsAnchorEl}
                        onClose={handlePaymentsPopoverClose}
                    >
                        <PaymentsPopoverContent>
                            {renderPayments(student.payment)}
                        </PaymentsPopoverContent>
                    </Popover>
                </TableCell>
            </TableRow>
        );
    };

    const renderAttendance = (attendance) => {
        return (
            <div style={{ fontFamily: 'Arial, sans-serif', marginTop: '20px' }}>
                {attendance.map((item, index) => {
                    const date = new Date(item.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                    return (
                        <div key={index} style={{ marginBottom: '10px', backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ fontWeight: 'bold' }}>Date: {formattedDate}</div>
                            <div>Status: {item.status}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // const renderExamResults = (examResults) => {
    //     return (
    //         <div style={{ fontFamily: 'Arial, sans-serif', marginTop: '20px' }}>
    //             {examResults.map((result, index) => (
    //                 <div key={index} style={{ marginBottom: '10px', backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
    //                     <div style={{ fontWeight: 'bold' }}>{result.subNameToString}</div>
    //                     <div>Marks Obtained: {result.marksObtained}</div>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };


    const renderPayments = (payments) => {
        return (
            <div style={{ fontFamily: 'Arial, sans-serif', marginTop: '20px' }}>
                {payments.map((payment, index) => (
                    <div key={index} style={{ marginBottom: '10px', backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ fontWeight: 'bold' }}>Date: {payment.date}</div>
                        <div>Status: {payment.status}</div>
                        <div>Amount: {payment.amount}</div>
                        <div>Month: {payment.month}</div>
                        <div>Subject: {payment.subName}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <div className='d-inline'>
                    <Title> Total Income:</Title> <Data start={0} end={totalPayments} duration={2.5} prefix="LKR." />
                </div>
                <Grid container spacing={3} sx={{ mt: 1, mb: 1 }}>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={StudentsIcon} alt="Students" />
                            <Title>
                                Total Students
                            </Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={ClassesIcon} alt="Classes" />
                            <Title>
                                Total Institutes
                            </Title>
                            <Data start={0} end={numberOfClasses} duration={5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={TeachersIcon} alt="Teachers" />
                            <Title>
                                Total Teachers
                            </Title>
                            <Data start={0} end={numberOfTeachers} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <img src={FeesIcon} alt="Fees" />
                            <Title>
                                Institute Cut (20%)
                            </Title>
                            <Data start={0} end={institutePaymentCut} duration={2.5} prefix="LKR." suffix=".00" />
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Container>


            <Container>
                <TextField
                    variant="standard"
                    value={searchQuery}
                    placeholder='Find By Student ID'
                    onChange={handleSearchChange}
                    sx={{ marginBottom: '30px', marginTop: '30px', width: '100%' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead style={{ marginBottom: '10px', backgroundColor: '#7483e3'}}>
                                <TableRow >
                                    <TableCell>Student ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Attendance</TableCell>
                                    {/* <TableCell>Exam Results</TableCell> */}
                                    <TableCell>Payments</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents.map(student => (
                                    <StudentTableRow key={student._id} student={student} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </>
    );
};


const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

const AttendancePopoverContent = styled.div`
    padding: 16px;
`;

const AttendanceItem = styled.div`
    margin-bottom: 8px;
`;

const AttendanceDate = styled.span`
    font-weight: bold;
`;

const AttendanceStatus = styled.span`
    margin-left: 8px;
`;

const ExamResultsPopoverContent = styled.div`
    padding: 16px;
`;

const ExamResultItem = styled.li`
    margin-bottom: 8px;
`;

const ExamResultSubject = styled.span`
    font-weight: bold;
`;

const ExamResultMarks = styled.span`
    margin-left: 8px;
`;

const PaymentsPopoverContent = styled.div`
    padding: 16px;
`;

const PaymentItem = styled.li`
    margin-bottom: 8px;
`;

const PaymentDate = styled.span`
    font-weight: bold;
`;

const PaymentStatus = styled.span`
    margin-left: 8px;
`;

const PaymentAmount = styled.span`
    margin-left: 8px;
`;

const PaymentMonth = styled.span`
    margin-left: 8px;
`;

export default AdminHomePage;
