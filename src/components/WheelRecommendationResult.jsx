import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  CheckCircle,
  Info,
  Speed,
  Settings
} from '@mui/icons-material';

// Importar imagen SVG
import patinPosicionesImage from '../assets/patin-posiciones.svg';

// Descripciones de perfiles
const PROFILE_DESCRIPTIONS = {
  'Elíptico': 'Perfil elíptico ofrece un buen equilibrio entre agarre y velocidad. Ideal para patinadores que buscan estabilidad y control en curvas, especialmente útil en pista y asfalto liso.',
  'Bullet': 'Perfil Bullet, está optimizado para máxima velocidad. Reduce la resistencia al aire y mejora el rendimiento en rectas, ideal para competencias de velocidad en pista.',
  'Más ancho para agarre': 'Perfil más ancho proporciona mayor superficie de contacto con el suelo, mejorando el agarre y la estabilidad. Ideal para skate cross, derrapes y terrenos irregulares.'
};

function WheelRecommendationResult({ result }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  const profileDescription = PROFILE_DESCRIPTIONS[profile] || 'Información del perfil no disponible';

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
              {isMobile ? (
                <Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                  >
                    {profile}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.7rem',
                      lineHeight: 1.4
                    }}
                  >
                    {profileDescription}
                  </Typography>
                </Box>
              ) : (
                <Tooltip 
                  title={profileDescription} 
                  arrow
                  placement="top"
                >
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      cursor: 'help',
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textUnderlineOffset: '4px'
                    }}
                  >
                    {profile}
                  </Typography>
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" display="block">
                Tamaño
              </Typography>
              <Typography variant="h6" fontWeight="bold">
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
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src={patinPosicionesImage}
              alt="Posicionamiento de ruedas"
              sx={{
                maxWidth: '50%',
                height: 'auto'
              }}
            />
          </Box>
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
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src={patinPosicionesImage}
              alt="Posicionamiento de ruedas"
              sx={{
                maxWidth: '50%',
                height: 'auto'
              }}
            />
          </Box>
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
        {isMobile ? (
          <Chip
            label={`Perfil: ${profile}`}
            color="primary"
            variant="outlined"
          />
        ) : (
          <Tooltip 
            title={profileDescription} 
            arrow
            placement="top"
          >
            <Chip
              label={`Perfil: ${profile}`}
              color="primary"
              variant="outlined"
              sx={{ cursor: 'help' }}
            />
          </Tooltip>
        )}
        {/*{matchScore > 0 && (*/}
        {/*  <Chip*/}
        {/*    label={`Coincidencia: ${matchScore}%`}*/}
        {/*    color="success"*/}
        {/*    variant="outlined"*/}
        {/*  />*/}
        {/*)}*/}
      </Box>
    </Box>
  );
}

export default WheelRecommendationResult;

