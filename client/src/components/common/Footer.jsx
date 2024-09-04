import { Paper, Stack, Button, Box, IconButton } from '@mui/material';
import React from 'react';
import Container from './Container';
import Logo from './Logo';
import menuConfigs from '../../configs/menu.configs';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Container>
      <Paper
        square={true}
        sx={{
          backgroundImage: 'url(https://phimfit.com/static/skin/footer-bg.jpg)',
          position: 'relative',
          backgroundColor: 'transparent',
          padding: '3rem',
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: 'column', md: 'row ' }}
          sx={{ height: 'max-content', zIndex: 1 }}
        >
          <Box>
            <Logo />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', // Xếp thành cột
              gap: 2,
            }}
          >
            <Box>
              {menuConfigs.main.map((item, index) => (
                <Button key={index} sx={{ color: 'inherit' }} component={Link} to={item.path}>
                  {item.display}
                </Button>
              ))}
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent:'center',
                gap: 2,
                cursor: 'pointer',
              }}
            >
              <IconButton
                component="a"
                href="https://www.facebook.com/dang.dinh.viet.long.1902.k3"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'inherit',
                  fontSize: '2rem',
                  transition: ' color 0.3s ease',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <FacebookIcon sx={{ fontSize: '2rem' }} />
              </IconButton>

              <IconButton
                component="a"
                href="#"
                sx={{
                  color: 'inherit',
                  fontSize: '2rem',
                  transition: ' color 0.3s ease',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <EmailIcon sx={{ fontSize: '2rem' }} />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Footer;
