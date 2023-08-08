import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, Link, Typography, Container, styled } from '@mui/material';

import Logo from 'src/components/LogoSign';

import { Helmet } from 'react-helmet-async';
import LoginForm from './LoginForm';
import GoogleLoginButton from 'src/components/GoogleLoginButton/GoogleLoginButton';

const MainContent = styled(Box)(
    () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
    () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

function Login() {
    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <MainContent>
                <TopWrapper>
                    <Container maxWidth='sm'>
                        <Logo />
                        <Card sx={{ mt: 3, px: 4, pt: 5, pb: 3 }}>
                            <Box>
                                <Typography variant='h2' sx={{ mb: 1 }}>
                                    {'Sign in'}
                                </Typography>
                                <Typography variant='h4' color='text.secondary' fontWeight='normal' sx={{ mb: 3 }}>
                                    {'Fill in the fields below to sign into your account.'}
                                </Typography>
                            </Box>
                            <LoginForm />
                            <Box mt={1}>
                                <GoogleLoginButton />
                            </Box>
                            <Box my={4}>
                                <Typography component='span' variant='subtitle2' color='text.primary' fontWeight='bold'>
                                    {'Don’t have an account, yet?'}
                                </Typography>{' '}
                                <Link component={RouterLink} to='/register'>
                                    <b>Sign up here</b>
                                </Link>
                            </Box>
                        </Card>
                    </Container>
                </TopWrapper>
            </MainContent>
        </>
    );
}

export default Login;
