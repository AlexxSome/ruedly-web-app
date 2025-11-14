import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Grid, Box, Tabs, Tab, Typography } from '@mui/material';
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
      main: '#2E7D32', // Verde
      light: '#4CAF50',
      dark: '#1B5E20',
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

  const handleFormSubmit = (formData) => {
    const recommendation = getWheelRecommendation(formData);
    setResult(recommendation);
  };

  const handlePositionSubmit = (wheelsData) => {
    const position = calculateWheelPosition(wheelsData);
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
            <Grid container spacing={4}>
              {/* Columna izquierda: Formulario */}
              <Grid item xs={12} md={6}>
                <WheelRecommendationForm onSubmit={handleFormSubmit} />
              </Grid>

              {/* Columna derecha: Resultados */}
              <Grid item xs={12} md={6}>
                <WheelRecommendationResult result={result} />
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={4}>
              {/* Columna izquierda: Formulario */}
              <Grid item xs={12} md={6}>
                <WheelPositionForm onSubmit={handlePositionSubmit} />
              </Grid>

              {/* Columna derecha: Resultados */}
              <Grid item xs={12} md={6}>
                <WheelPositionResult result={positionResult} />
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

