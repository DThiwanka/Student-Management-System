import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <LogoutContainer>
            <UserInfo>
                <h2>Hello, {currentUser.name}</h2>
                <p>Are you sure you want to log out?</p>
            </UserInfo>
            <ButtonContainer>
                <Button onClick={handleLogout}>Log Out</Button>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            </ButtonContainer>
        </LogoutContainer>
    );
};

export default Logout;

const LogoutContainer = styled.div`
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    width: 300px;
    max-width: 80%;
    margin: 50px auto;
`;

const UserInfo = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    background-color: #ea0606;
    color: #fff;
    border: none;
    margin: 0 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #d10000;
    }
`;

const CancelButton = styled(Button)`
    background-color: transparent;
    color: #ea0606;
    border: 1px solid #ea0606;

    &:hover {
        background-color: #fff;
        color: #d10000;
    }
`;
