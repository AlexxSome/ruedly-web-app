import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Info,
  DirectionsRun
} from '@mui/icons-material';

function WheelPositionResult({ result }) {
  if (!result || result.error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {result?.error || 'Completa el formulario y calcula el posicionamiento'}
        </Typography>
      </Box>
    );
  }

  // Ensure all necessary values are properly destructured with defaults
  const { 
    wheels: wheelsProp = [], 
    rightFoot = [], 
    leftFoot = [], 
    strategy = 'Configuración recomendada', 
    userContext = {}, 
    totalWheels = 0, 
    hasMoreWheels = false, 
    addedWheels = 0, 
    originalWheels = 0 
  } = result || {};
  
  // Ensure wheels is always an array
  const wheels = Array.isArray(wheelsProp) ? wheelsProp : [];
  
  // Helper function to check if a wheel is recommended
  const isWheelRecommended = (wheelHardness) => {
    if (!wheelHardness) return false;
    return wheels.some(w => w && w.hardness === wheelHardness && w.isRecommended);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle sx={{ color: 'success.main' }} />
        Posicionamiento Recomendado
      </Typography>

      {strategy && (
        <Alert 
          severity={hasMoreWheels || addedWheels > 0 ? 'success' : 'info'} 
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" gutterBottom>
            <strong>Estrategia:</strong> {strategy}
          </Typography>
          {userContext && (
            <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.8 }}>
              Basado en: {userContext.disciplina} • {userContext.priority} • {userContext.estilo}
            </Typography>
          )}
          
          {hasMoreWheels ? (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
              🔍 Se seleccionaron las 8 mejores ruedas de {totalWheels} según tu preferencia de "{userContext?.priority}".
            </Typography>
          ) : addedWheels > 0 ? (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
              ✨ Se agregaron {addedWheels} ruedas recomendadas para completar el set, priorizando {userContext?.priority.toLowerCase()}.
            </Typography>
          ) : null}
          
          {addedWheels > 0 && (
            <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
              <Typography variant="caption" display="block">
                <strong>Ruedas agregadas:</strong> {wheels && wheels.length > 0 
                  ? wheels
                    .filter(w => w.isRecommended)
                    .map(w => `${w.quantity}x ${w.hardness}`)
                    .join(', ')
                  : 'No se agregaron ruedas recomendadas'}
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Pie Derecho */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <DirectionsRun sx={{ color: 'primary.main' }} />
                Pie Derecho
              </Typography>
              <Grid container spacing={2}>
                {rightFoot.map((hardness, index) => (
                  <Grid item xs={6} key={index}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        bgcolor: index < 2 ? 'primary.light' : 'secondary.light',
                        color: index < 2 ? 'primary.contrastText' : 'secondary.contrastText',
                        position: 'relative',
                        overflow: 'visible',
                        '&::after': isWheelRecommended(rightFoot[index]) ? {
                          content: '"★"',
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'warning.main',
                          color: 'warning.contrastText',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          boxShadow: 1
                        } : {}
                      }}
                      title={isWheelRecommended(rightFoot[index]) ? 'Rueda recomendada' : ''}
                    >
                      <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
                        Posición {index + 1}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                        {hardness}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                        {index < 2 ? 'Delante' : 'Atrás'}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Izquierdo */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <DirectionsRun sx={{ color: 'primary.main' }} />
                Pie Izquierdo
              </Typography>
              <Grid container spacing={2}>
                {leftFoot.map((hardness, index) => (
                  <Grid item xs={6} key={index}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        bgcolor: index < 2 ? 'primary.light' : 'secondary.light',
                        color: index < 2 ? 'primary.contrastText' : 'secondary.contrastText',
                        position: 'relative',
                        overflow: 'visible',
                        '&::after': isWheelRecommended(leftFoot[index]) ? {
                          content: '"★"',
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'warning.main',
                          color: 'warning.contrastText',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          boxShadow: 1
                        } : {}
                      }}
                      title={isWheelRecommended(leftFoot[index]) ? 'Rueda recomendada' : ''}
                    >
                      <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
                        Posición {index + 1}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                        {hardness}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                        {index < 2 ? 'Delante' : 'Atrás'}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Resumen Visual */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Info sx={{ color: 'primary.main' }} />
          Resumen
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pie Derecho:
            </Typography>
            <Typography variant="body2">
              #1 {rightFoot[0]} | #2 {rightFoot[1]} | #3 {rightFoot[2]} | #4 {rightFoot[3]}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pie Izquierdo:
            </Typography>
            <Typography variant="body2">
              #1 {leftFoot[0]} | #2 {leftFoot[1]} | #3 {leftFoot[2]} | #4 {leftFoot[3]}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default WheelPositionResult;

