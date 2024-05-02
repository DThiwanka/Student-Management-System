import React, { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom'
import { authLogout } from '../../redux/userRelated/userSlice';
import { Button, Collapse } from '@mui/material';
import styled from 'styled-components';

const AdminProfile = () => {
    const [showTab, setShowTab] = useState(false);
    const buttonText = showTab ? 'Cancel' : 'Edit profile';

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { currentUser, response, error } = useSelector((state) => state.user);
    const address = "Admin"

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName }

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, currentUser._id, address))
    }

    const deleteHandler = () => {
        try {
            dispatch(deleteUser(currentUser._id, "Students"));
            dispatch(deleteUser(currentUser._id, address));
            dispatch(authLogout());
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <CenteredContainer>
            <ProfileContainer>
                <div style={styles.container}>
                    <strong style={styles.label}>Name:</strong> {currentUser.name}
                    <br />
                    <strong style={styles.label}>Email:</strong> {currentUser.email}
                    <br />
                    <strong style={styles.label}>School:</strong>: {currentUser.schoolName}
                    <br />
                </div>
                <Button variant="contained" color="error" style={styles.button} onClick={deleteHandler}>Delete</Button>
                <Button variant="contained" style={styles.button} sx={styles.showButton}
                    onClick={() => setShowTab(!showTab)}>
                    {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{buttonText}
                </Button>
                <Collapse style={styles.details} in={showTab} timeout="auto" unmountOnExit>
                    <div className="register">
                        <form className="registerForm" onSubmit={submitHandler}>
                            <span className="registerTitle" style={styles.title}>Edit Details</span>
                            <label style={styles.label}>Name</label>
                            <input className="registerInput" type="text" placeholder="Enter your name..."
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name" required />

                            <label style={styles.label}>School</label>
                            <input className="registerInput" type="text" placeholder="Enter your school name..."
                                value={schoolName}
                                onChange={(event) => setSchoolName(event.target.value)}
                                autoComplete="name" required />

                            <label style={styles.label}>Email</label>
                            <input className="registerInput" type="email" placeholder="Enter your email..."
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email" required />

                            <label style={styles.label}>Password</label>
                            <input className="registerInput" type="password" placeholder="Enter your password..."
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="new-password" />

                            <button className="registerButton" type="submit" style={styles.button}>Update</button>
                        </form>
                    </div>
                </Collapse>
            </ProfileContainer>
        </CenteredContainer>
    )
}

export default AdminProfile;

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Adjust height as needed */
`;

const ProfileContainer = styled.div`
    /* Add any additional styles if needed */
`;

const styles = {
    container: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '20px',
        marginBottom: '20px',
        maxWidth: '400px',
        fontSize: '25px', // Adjust font size as needed
    },
    button: {
        marginTop: '10px',
        marginRight: '10px',
    },
    details: {
        marginTop: '10px',
    },
    label: {
        fontSize: '25px', // Adjust font size as needed
        fontWeight: 'bold',
        marginRight: '5px',
    },
    title: {
        fontSize: '25px', // Adjust font size as needed
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'block',
    },
};
