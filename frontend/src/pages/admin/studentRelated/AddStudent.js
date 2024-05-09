import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { authError, underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress } from '@mui/material';
import { Card, CardContent, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector(state => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [className, setClassName] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const adminID = currentUser._id;
    const role = 'Student';
    const attendance = [];

    useEffect(() => {
        if (situation === 'Class') {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, 'Sclass'));
    }, [adminID, dispatch]);

    const generateRollNum = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 5;
        let result = 'STM-';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setRollNum(result);
    };

    useEffect(() => {
        generateRollNum(); // Generate initial roll number
    }, []); // Empty dependency array ensures this runs only once on component mount

    const changeHandler = event => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                classItem => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    };

    const fields = {
        name,
        rollNum,
        password,
        sclassName,
        adminID,
        role,
        attendance,
        dob,
        gender,
        email,
        phone,
        address,
        emergencyContact,
    };



    const checkRollNumberAvailability = fields => async dispatch => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/Student/checkRollNumber`, { rollNum: fields.rollNum });
            if (result.data.available) {
                // Roll number is available, proceed with registration
                return true; // Return true to indicate roll number availability
            } else {
                // Roll number already exists, ask for confirmation to regenerate
                const regenerate = window.confirm('Roll number already exists. Do you want to regenerate a new one?');
                if (regenerate) {
                    // If confirmed, regenerate and check again
                    generateRollNum();
                    alert(`New Student ID is ${rollNum}`);
                    return checkRollNumberAvailability(fields); // Recursively call checkRollNumberAvailability
                } else {
                    // If not confirmed, dispatch an error
                    throw new Error('Roll number already exists.');
                }
            }
        } catch (error) {
            throw error; // Throw error to be caught by the caller
        }
    };
    
    
    

    const submitHandler = async event => {
        event.preventDefault();
        if (sclassName === '') {
            setMessage('Please select a classname');
            setShowPopup(true);
        } else {
            setLoader(true);
            try {
                await dispatch(checkRollNumberAvailability(fields));
                // If roll number is available or regenerated, proceed with registration
                dispatch(registerUser(fields, role));
            } catch (error) {
                // Handle error, if any
                console.error('Error checking roll number availability:', error);
            }
        }
    };
    
    

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage('Network Error');
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Card variant="outlined" style={{ maxWidth: '600px', margin: 'auto', marginTop: '50px', padding: '20px' }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>Add Student</Typography>
                <form onSubmit={submitHandler}>
                    <TextField
                        fullWidth
                        label="Name"
                        placeholder="Enter student's name..."
                        value={name}
                        onChange={event => setName(event.target.value)}
                        autoComplete="name"
                        required
                        margin="normal"
                    />
                    {situation === 'Student' && (
                        <FormControl fullWidth required margin="normal">
                            <InputLabel>Class</InputLabel>
                            <Select
                                value={className}
                                onChange={changeHandler}
                                label="Class"
                            >
                                <MenuItem value="Select Class">Select Class</MenuItem>
                                {sclassesList.map((classItem, index) => (
                                    <MenuItem key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <TextField
                        fullWidth
                        label="Student ID Number"
                        placeholder="Enter student's NIC..."
                       value={rollNum}
                        readOnly
                        required
                        margin="normal"
                        disabled
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        placeholder="Enter student's password..."
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="Date of Birth"
                        placeholder="Enter student's Date of Birth..."
                        value={dob}
                        onChange={event => setDob(event.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControl fullWidth required margin="normal">
                        <InputLabel>Gender</InputLabel>
                        <Select
                            value={gender}
                            onChange={event => setGender(event.target.value)}
                            label="Gender"
                        >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        placeholder="Enter student's Email..."
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="tel"
                        label="Phone"
                        placeholder="Enter student's Phone..."
                        value={phone}
                        onChange={event => setPhone(event.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        placeholder="Enter student's Address..."
                        value={address}
                        onChange={event => setAddress(event.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="tel"
                        label="Emergency Contact"
                        placeholder="Enter student's Emergency Contact..."
                        value={emergencyContact}
                        onChange={event => setEmergencyContact(event.target.value)}
                        required
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loader}
                        style={{ marginTop: '20px', width: '100%' }}
                    >
                        {loader ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                    </Button>
                </form>
            </CardContent>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Card>
    );
};

export default AddStudent;
