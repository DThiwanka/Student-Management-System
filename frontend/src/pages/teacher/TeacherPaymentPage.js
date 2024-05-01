import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, CircularProgress, List, ListItem, ListItemText, Divider, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment, IconButton } from '@mui/material';
import { ExpandMore, CheckCircle, Cancel, Search, Clear, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

const TeacherPaymentPage = () => {
  const { id, subjectId } = useParams();
  const [paymentsData, setPaymentsData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/teacherPayment/${id}/${subjectId}`);
        setPaymentsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Error fetching payments. Please try again later.');
        setLoading(false);
      }
    };

    fetchPayments();
  }, [id, subjectId]);

  const filteredStudents = paymentsData?.formattedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = filteredStudents?.slice().sort((a, b) => {
    return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents?.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1); // Reset to first page when clearing search
  };

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Teacher Payment Page
      </Typography>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            Total Income: {paymentsData?.totalSum}
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" style={{ marginRight: '10px' }}>Sort by:</Typography>
          <div>
            <IconButton onClick={handleSort} size="small">
              {sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </div>
        </div>
        <TextField
          label="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <Clear />
                </IconButton>
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>
      {loading && <CircularProgress style={{ marginTop: '20px' }} />}
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      {paymentsData && (
        <div style={{ marginTop: '20px' }}>
          <List>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <Accordion key={index} style={{ marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography variant="subtitle1" style={{ flex: 1 }}>Student Name: {student.name}</Typography>
                      <Typography variant="body1" style={{ marginRight: '20px' }}>Total Amount: {student.totalAmount}</Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ width: '100%' }}>
                      <Divider />
                      <List>
                        {student.payment.map((payment, index) => (
                          <ListItem key={index} style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff', padding: '10px' }}>
                            <ListItemText
                              primary={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <Typography variant="body1">Date: {new Date(payment.date).toLocaleDateString()}</Typography>
                                    <Typography variant="body1">Amount: {payment.amount}</Typography>
                                  </div>
                                  <Typography variant="body1">Month: {payment.month}</Typography>
                                </div>
                              }
                              secondary={`Status: ${payment.status}`}
                              primaryTypographyProps={{ color: payment.status === 'Paid' ? 'textPrimary' : 'error' }}
                              secondaryTypographyProps={{ color: payment.status === 'Paid' ? 'textSecondary' : 'error' }}
                              secondary={payment.status === 'Paid' ? <CheckCircle color="success" /> : <Cancel color="error" />}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography variant="body1">No students found.</Typography>
            )}
          </List>
          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {Array.from({ length: Math.ceil(filteredStudents?.length / studentsPerPage) }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} style={{ marginRight: '5px' }}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default TeacherPaymentPage;
