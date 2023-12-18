import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { sessionTexts } from '@vegaplatformui/utils';
import Logo from '../assets/images/VegaLogo.webp';
import { authenticationState } from '../recoil/atom';
import { useKeycloak } from '@react-keycloak-fork/web';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { RouteUrls } from '../routes/routeUrls';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { keycloak } = useKeycloak();

    const [authenticated, setAuthenticated] = useRecoilState(authenticationState);

    useEffect(() => {
        if (authenticated) {
            sessionStorage.setItem(sessionTexts.route, RouteUrls.dashboard);
            navigate(`/${RouteUrls.dashboard}`);
        }
    }, [authenticated, navigate]);

    const onLoginClick = () => {
        keycloak.login();
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: ' 100vh',
                alignItems: 'center',
            }}
        >
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    {' '}
                    <CardMedia component='img' height='140' image={Logo} alt='Vega Logo' />
                    <CardContent>
                        <Typography gutterBottom variant='h5' component='div'>
                            Vega Cloud
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Vega Cloud is a next-generation Cloud Optimization Platform. With multi-cloud visibility, scalable management, and
                            advanced optimization strategies, the Vega Platform helps organizations optimize their FinOps journey, take action and cut
                            costs.
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size='small' color='primary' onClick={onLoginClick}>
                        Sign in
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};
