import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Button } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
  useEffect(() => {
    // Lock scroll when the component mounts
    document.body.style.overflow = 'hidden';

    // Unlock scroll when the component unmounts
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  return (
    <StyledContainer>
      <StyledGrid container spacing={0}>
        <Grid item xs={12} md={6}>
          <StyledImage src={Students} alt="students" />
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <StyledTitle>
              Welcome to Lust Cap
              <br />
              Institute
            </StyledTitle>
            <StyledText>
              Welcome to Lustcap Institute, where we elevate class management to a whole new level. Our streamlined approach ensures seamless Institute organization while incorporating both students and Institute seamlessly. From tracking attendance to assessing performance, we've got you covered. Access records with ease, view marks effortlessly, and foster seamless communication throughout the institute.
            </StyledText>
            <StyledButtonContainer>
              <StyledLink to="/choose">
                <LightPurpleButton variant="contained" fullWidth>
                  Login
                </LightPurpleButton>
              </StyledLink>
            </StyledButtonContainer>
          </StyledPaper>
        </Grid>
      </StyledGrid>
    </StyledContainer>
  );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-top: 150px; /* Added margin-top */
`;

const StyledGrid = styled(Grid)`
  margin: 0 !important;
`;

const StyledPaper = styled.div`
  padding: 40px;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 400px;
`;

const StyledTitle = styled.h1`
  font-size: 2.5rem;
  color: #252525;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledText = styled.p`
  color: #555;
  margin-bottom: 20px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

