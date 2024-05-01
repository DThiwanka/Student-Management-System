import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { BottomNavigation, BottomNavigationAction, Container, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import CustomBarChart from '../../components/CustomBarChart';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (!userDetails) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails, currentUser.sclassName._id]);

    const [selectedSection, setSelectedSection] = useState('table');

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Subject Marks
            </Typography>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Subject</StyledTableCell>
                        <StyledTableCell>Marks</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {userDetails && userDetails.examResult.map((result, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell>{result.subName && result.subName.subName}</StyledTableCell>
                            <StyledTableCell>{result.marksObtained}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );

    const renderChartSection = () => (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Subject Marks Chart
            </Typography>
            <CustomBarChart chartData={userDetails && userDetails.examResult} dataKey="marksObtained" />
        </Container>
    );

    const renderClassDetailsSection = () => (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Class Details
            </Typography>
            <Typography variant="h5" gutterBottom>
                You are currently in Class {sclassDetails && sclassDetails.sclassName}
            </Typography>
            <Typography variant="h6" gutterBottom>
                And these are the subjects:
            </Typography>
            {subjectsList && subjectsList.map((subject, index) => (
                <div key={index}>
                    <Typography variant="subtitle1">
                        {subject.subName} ({subject.subCode})
                    </Typography>
                </div>
            ))}
        </Container>
    );

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {userDetails && userDetails.examResult && userDetails.examResult.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}
                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction label="Table" value="table" icon={<TableChartIcon />} />
                                    <BottomNavigationAction label="Chart" value="chart" icon={<InsertChartIcon />} />
                                </BottomNavigation>
                            </Paper>
                        </>
                    ) : (
                        renderClassDetailsSection()
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentSubjects;
