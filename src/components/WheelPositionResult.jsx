import React from 'react';
import {
  Paper,
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
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {result?.error || 'Completa el formulario y calcula el posicionamiento'}
        </Typography>
      </Paper>
    );
  }

  const { rightFoot, leftFoot, strategy, userContext } = result;

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle sx={{ color: 'success.main' }} />
        Posicionamiento Recomendado
      </Typography>

      {strategy && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Estrategia:</strong> {strategy}
          </Typography>
          {userContext && (
            <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.8 }}>
              Basado en: {userContext.disciplina} • {userContext.priority} • {userContext.estilo}
            </Typography>
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
                        color: index < 2 ? 'primary.contrastText' : 'secondary.contrastText'
                      }}
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
                        color: index < 2 ? 'primary.contrastText' : 'secondary.contrastText'
                      }}
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
    </Paper>
  );
}

export default WheelPositionResult;

