import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  Grid,
  FormHelperText,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import { Calculate, Speed } from '@mui/icons-material';

const SET_CONFIG_OPTIONS = [
  {
    value: "Automática según la regla",
    title: "Automática según la regla",
    description: "Usa la configuración pensada para ese escenario (por ejemplo mixedConfig con posiciones 1–4). No requiere conocimientos técnicos, es el modo más 'inteligente'.",
    advantages: ["Configuración optimizada para tu escenario", "No requiere conocimientos técnicos"],
    disadvantages: ["Menos control manual", "Puede sugerir configuraciones mixtas más complejas"]
  },
  {
    value: "Dureza única en todo el set",
    title: "Dureza única en todo el set",
    description: "Usa una sola dureza para las 4 ruedas (la de la recomendación base).",
    advantages: ["Comportamiento muy predecible", "Fácil de rotar y mantener", "Ideal para principiantes"],
    disadvantages: ["Menos optimizado para situaciones específicas", "Puede perder agarre o velocidad en extremos"]
  },
  {
    value: "Mixto: más agarre delante, más velocidad atrás",
    title: "Mixto: más agarre delante, más velocidad atrás",
    description: "Ruedas delanteras ligeramente más blandas, ruedas traseras ligeramente más duras.",
    advantages: ["Entrada a la curva más segura", "Mejor conservación de velocidad en rectas", "Útil en velocidad pista y fondo"],
    disadvantages: ["Configuración más compleja de entender/rotar", "Puede sentirse inestable al principio"]
  },
  {
    value: "Mixto: configuración de control y agarre",
    title: "Mixto: configuración de control y agarre",
    description: "Mantiene durezas más bien blandas o balanceadas en todas las posiciones, con una ligera variación si hace falta.",
    advantages: ["Mucho control en frenadas y trucos", "Mejor absorción de irregularidades", "Ideal para free style y skate cross"],
    disadvantages: ["No es la opción más rápida para rectas largas", "Mayor desgaste en escenarios abrasivos"]
  }
];

function WheelRecommendationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    disciplina: '',
    pesoKg: '',
    edad: '',
    experiencia: '',
    estilo: '',
    suelo: '',
    temperatura: 'sin especificar',
    priority: '',
    modoDureza: '',
    wheelSize: '',
    setConfigMode: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.disciplina) newErrors.disciplina = 'Selecciona una disciplina';
    if (!formData.pesoKg || formData.pesoKg <= 0) newErrors.pesoKg = 'Ingresa un peso válido';
    if (!formData.edad || formData.edad <= 0) newErrors.edad = 'Ingresa una edad válida';
    if (!formData.experiencia) newErrors.experiencia = 'Selecciona tu nivel de experiencia';
    if (!formData.estilo) newErrors.estilo = 'Selecciona un estilo';
    if (!formData.suelo) newErrors.suelo = 'Selecciona un tipo de suelo';
    if (!formData.priority) newErrors.priority = 'Selecciona una prioridad';
    if (!formData.modoDureza) newErrors.modoDureza = 'Selecciona un tipo de dureza';
    if (!formData.wheelSize) newErrors.wheelSize = 'Selecciona un tamaño de rueda';
    if (!formData.setConfigMode) newErrors.setConfigMode = 'Selecciona un modo de configuración';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Speed sx={{ color: 'primary.main' }} />
        Configuración de Ruedas
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Set Config Mode - Destacado */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
              Tipo de Configuración del Set
            </Typography>
            <Grid container spacing={2}>
              {SET_CONFIG_OPTIONS.map((option) => (
                <Grid item xs={12} sm={6} key={option.value}>
                  <Card 
                    sx={{ 
                      border: formData.setConfigMode === option.value ? 2 : 1,
                      borderColor: formData.setConfigMode === option.value ? 'primary.main' : 'divider',
                      height: '100%'
                    }}
                  >
                    <CardActionArea onClick={() => handleChange('setConfigMode')({ target: { value: option.value } })}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {option.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {option.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="success.main" fontWeight="bold">
                            Ventajas:
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {option.advantages.join(', ')}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {errors.setConfigMode && (
              <FormHelperText error sx={{ mt: 1 }}>
                {errors.setConfigMode}
              </FormHelperText>
            )}
          </Grid>

          {/* Disciplina */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.disciplina}>
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={formData.disciplina}
                onChange={handleChange('disciplina')}
                label="Disciplina"
              >
                <MenuItem value="velocidad">Velocidad</MenuItem>
                <MenuItem value="fondo">Fondo</MenuItem>
                <MenuItem value="skate cross">Skate Cross</MenuItem>
                <MenuItem value="derrapes">Derrapes</MenuItem>
                <MenuItem value="free style (calle)">Free Style (Calle)</MenuItem>
              </Select>
              {errors.disciplina && <FormHelperText>{errors.disciplina}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Peso */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Peso (kg)"
              value={formData.pesoKg}
              onChange={handleChange('pesoKg')}
              placeholder="Ej: 70"
              error={!!errors.pesoKg}
              helperText={errors.pesoKg}
            />
          </Grid>

          {/* Edad */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Edad"
              value={formData.edad}
              onChange={handleChange('edad')}
              error={!!errors.edad}
              helperText={errors.edad}
            />
          </Grid>

          {/* Experiencia */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.experiencia}>
              <InputLabel>Experiencia</InputLabel>
              <Select
                value={formData.experiencia}
                onChange={handleChange('experiencia')}
                label="Experiencia"
              >
                <MenuItem value="principiante">Principiante</MenuItem>
                <MenuItem value="intermedio">Intermedio</MenuItem>
                <MenuItem value="avanzado">Avanzado</MenuItem>
                <MenuItem value="alta competencia">Alta Competencia</MenuItem>
                <MenuItem value="alto rendimiento">Alto Rendimiento</MenuItem>
              </Select>
              {errors.experiencia && <FormHelperText>{errors.experiencia}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Estilo */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.estilo}>
              <InputLabel>Estilo</InputLabel>
              <Select
                value={formData.estilo}
                onChange={handleChange('estilo')}
                label="Estilo"
              >
                <MenuItem value="explosivo (velocidad)">Explosivo (velocidad)</MenuItem>
                <MenuItem value="fondo">Fondo</MenuItem>
                <MenuItem value="mixto">Mixto</MenuItem>
                <MenuItem value="tecnico">Técnico</MenuItem>
                <MenuItem value="free style">Free Style</MenuItem>
              </Select>
              {errors.estilo && <FormHelperText>{errors.estilo}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Suelo */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.suelo}>
              <InputLabel>Tipo de Suelo</InputLabel>
              <Select
                value={formData.suelo}
                onChange={handleChange('suelo')}
                label="Tipo de Suelo"
              >
                <MenuItem value="pista">Pista</MenuItem>
                <MenuItem value="asfalto liso">Asfalto Liso</MenuItem>
                <MenuItem value="asfalto rugoso">Asfalto Rugoso</MenuItem>
                <MenuItem value="indoor">Indoor</MenuItem>
                <MenuItem value="calle">Calle</MenuItem>
              </Select>
              {errors.suelo && <FormHelperText>{errors.suelo}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Temperatura */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Temperatura</InputLabel>
              <Select
                value={formData.temperatura}
                onChange={handleChange('temperatura')}
                label="Temperatura"
              >
                <MenuItem value="sin especificar">Sin especificar</MenuItem>
                <MenuItem value="frio">Frío</MenuItem>
                <MenuItem value="templado">Templado</MenuItem>
                <MenuItem value="caluroso">Caluroso</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Priority */}
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.priority}>
              <Typography variant="subtitle2" gutterBottom>
                ¿Qué priorizas?
              </Typography>
              <RadioGroup
                row
                value={formData.priority}
                onChange={handleChange('priority')}
              >
                <FormControlLabel value="Más agarre" control={<Radio />} label="Más agarre" />
                <FormControlLabel value="Más velocidad" control={<Radio />} label="Más velocidad" />
                <FormControlLabel 
                  value="Balance entre agarre y velocidad" 
                  control={<Radio />} 
                  label="Balance" 
                />
              </RadioGroup>
              {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Modo Dureza */}
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.modoDureza}>
              <Typography variant="subtitle2" gutterBottom>
                Tipo de Dureza
              </Typography>
              <RadioGroup
                row
                value={formData.modoDureza}
                onChange={handleChange('modoDureza')}
              >
                <FormControlLabel 
                  value="numérica (82A–90A)" 
                  control={<Radio />} 
                  label="Numérica (82A–90A)" 
                />
                <FormControlLabel 
                  value="estándar (Firm/XFirm/XXFirm)" 
                  control={<Radio />} 
                  label="Estándar (Firm/XFirm/XXFirm)" 
                />
              </RadioGroup>
              {errors.modoDureza && <FormHelperText>{errors.modoDureza}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Wheel Size */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.wheelSize}>
              <InputLabel>Tamaño de Ruedas (mm)</InputLabel>
              <Select
                value={formData.wheelSize}
                onChange={handleChange('wheelSize')}
                label="Tamaño de Ruedas (mm)"
              >
                <MenuItem value={80}>80</MenuItem>
                <MenuItem value={84}>84</MenuItem>
                <MenuItem value={90}>90</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={110}>110</MenuItem>
                <MenuItem value={125}>125</MenuItem>
              </Select>
              {errors.wheelSize && <FormHelperText>{errors.wheelSize}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<Calculate />}
              sx={{ py: 1.5, mt: 2 }}
            >
              Calcular Recomendación
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default WheelRecommendationForm;

