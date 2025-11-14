import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Grid, Box, Tabs, Tab, Typography, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Header from './components/Header';
import WheelRecommendationForm from './components/WheelRecommendationForm';
import WheelRecommendationResult from './components/WheelRecommendationResult';
import WheelPositionForm from './components/WheelPositionForm';
import WheelPositionResult from './components/WheelPositionResult';
import { getWheelRecommendation } from './utils/wheelRecommendation';
import { calculateWheelPosition } from './utils/calculateWheelPosition';

// Tema personalizado con tonos verdes/azules
const theme = createTheme({
  palette: {
    primary: {
      main: '#5d9b86', // Verde azulado
      light: '#7fb8a8',
      dark: '#4a8573',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976D2', // Azul
      light: '#42A5F5',
      dark: '#1565C0',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  const [result, setResult] = useState(null);
  const [positionResult, setPositionResult] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleFormSubmit = (formData) => {
    const recommendation = getWheelRecommendation(formData);
    setResult(recommendation);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePositionSubmit = (data) => {
    const position = calculateWheelPosition(data);
    setPositionResult(position);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Tabs */}
          <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Recomendación de Ruedas" />
              <Tab label="Posicionamiento de Ruedas" />
            </Tabs>
          </Box>

          {/* Contenido principal */}
          {tabValue === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                <WheelRecommendationForm onSubmit={handleFormSubmit} />
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                <WheelPositionForm onSubmit={handlePositionSubmit} />
              </Box>
            </Box>
          )}

          {/* Modal para mostrar el resultado de recomendación */}
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2
              }
            }}
          >
            <DialogContent sx={{ p: 0, position: 'relative' }}>
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Close />
              </IconButton>
              <WheelRecommendationResult result={result} />
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

