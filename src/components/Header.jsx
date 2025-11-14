import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import RuedlyLogo from './RuedlyLogo';

function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main', mb: 3 }}>
      <Toolbar>
        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          <RuedlyLogo />
        </Box>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            Ruedly
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.9, fontSize: '0.85rem', mb: 2 }}>
            Tu guía para elegir las ruedas perfectas
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

