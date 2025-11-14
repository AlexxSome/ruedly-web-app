import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle,
  Info,
  Speed,
  Settings
} from '@mui/icons-material';

// Importar imagen - si no existe, el build fallará y podrás agregarla
// Coloca tu imagen en: src/assets/wheel-position.png
let wheelPositionImage;
try {
  wheelPositionImage = new URL('../assets/wheel-position.png', import.meta.url).href;
} catch {
  wheelPositionImage = null;
}

function WheelRecommendationResult({ result }) {
  if (!result || !result.recommendation) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Completa el formulario y calcula tu recomendación
        </Typography>
      </Box>
    );
  }

  const { recommendation, isFallback, matchScore } = result;
  const { hardness, profile, notes, mixedConfig, wheelSize } = recommendation;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle sx={{ color: 'success.main' }} />
        Tu Recomendación
      </Typography>

      {isFallback && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Esta es una recomendación general. Para una recomendación más precisa, completa todos los campos del formulario.
        </Alert>
      )}

      {/* Información Principal */}
      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" display="block">
                Dureza
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {hardness}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" display="block">
                Perfil
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {profile}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" display="block">
                Tamaño
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {wheelSize}mm
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Configuración Mixta */}
      {mixedConfig && mixedConfig.positions && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Settings sx={{ color: 'primary.main' }} />
            Configuración por Posición
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(mixedConfig.positions).map(([position, hardnessValue]) => (
              <Grid item xs={6} sm={3} key={position}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Rueda {position}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {hardnessValue}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          {mixedConfig.description && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {mixedConfig.description}
              </Typography>
            </Box>
          )}
          {/* Imagen de posicionamiento */}
          {wheelPositionImage && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={wheelPositionImage}
                alt="Posicionamiento de ruedas"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Si no hay configuración mixta, mostrar dureza única */}
      {!mixedConfig && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Settings sx={{ color: 'primary.main' }} />
            Configuración
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              Todas las ruedas: <strong>{hardness}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Esta configuración uniforme es más fácil de mantener y rotar.
            </Typography>
          </Alert>
          {/* Imagen de posicionamiento */}
          {wheelPositionImage && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={wheelPositionImage}
                alt="Posicionamiento de ruedas"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              />
            </Box>
          )}
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Notas */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Info sx={{ color: 'primary.main' }} />
          Notas y Recomendaciones
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {notes}
        </Typography>
      </Box>

      {/* Chips informativos */}
      <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          icon={<Speed />}
          label={`Tamaño: ${wheelSize}mm`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<Settings />}
          label={`Dureza: ${hardness}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Perfil: ${profile}`}
          color="primary"
          variant="outlined"
        />
        {matchScore > 0 && (
          <Chip
            label={`Coincidencia: ${matchScore}%`}
            color="success"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
}

export default WheelRecommendationResult;

