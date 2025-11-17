import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from '@mui/material';
import { Add, Delete, Calculate, Settings, Info } from '@mui/icons-material';

const HARDNESS_OPTIONS = [
  { value: 'Firm', label: 'Firm' },
  { value: 'XFirm', label: 'XFirm' },
  { value: 'XXFirm', label: 'XXFirm' },
  { value: '82A', label: '82A' },
  { value: '83A', label: '83A' },
  { value: '84A', label: '84A' },
  { value: '85A', label: '85A' },
  { value: '86A', label: '86A' },
  { value: '87A', label: '87A' },
  { value: '88A', label: '88A' },
  { value: '89A', label: '89A' },
  { value: '90A', label: '90A' }
];

function WheelPositionForm({ onSubmit }) {
  const [wheels, setWheels] = useState([
    { hardness: '', quantity: '' }
  ]);
  const [userData, setUserData] = useState({
    disciplina: '',
    pesoKg: '',
    experiencia: '',
    estilo: '',
    suelo: '',
    temperatura: 'sin especificar',
    priority: ''
  });
  const [errors, setErrors] = useState({});

  const handleAddWheel = () => {
    setWheels([...wheels, { hardness: '', quantity: '' }]);
  };

  const handleRemoveWheel = (index) => {
    if (wheels.length > 1) {
      setWheels(wheels.filter((_, i) => i !== index));
    }
  };

  const handleWheelChange = (index, field) => (event) => {
    const value = event.target.value;
    const newWheels = [...wheels];
    newWheels[index][field] = value;
    setWheels(newWheels);
    
    // Limpiar error
    if (errors[`wheel_${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`wheel_${index}_${field}`];
      setErrors(newErrors);
    }
  };

  const handleUserDataChange = (field) => (event) => {
    const value = event.target.value;
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };


  const validate = () => {
    const newErrors = {};
    let totalWheels = 0;

    // Validar ruedas
    wheels.forEach((wheel, index) => {
      if (!wheel.hardness) {
        newErrors[`wheel_${index}_hardness`] = 'Selecciona una dureza';
      }
      if (!wheel.quantity || wheel.quantity <= 0) {
        newErrors[`wheel_${index}_quantity`] = 'Ingresa una cantidad válida';
      } else {
        totalWheels += parseInt(wheel.quantity);
      }
    });
    
    // Si no hay ruedas, mostrar error
    if (totalWheels === 0) {
      newErrors.total = 'Ingresa al menos una rueda';
    }
    
    // Validar datos del usuario necesarios para recomendaciones
    if (totalWheels < 8) {
      if (!userData.priority) newErrors.priority = 'Selecciona una prioridad para recomendar ruedas adicionales';
      if (!userData.suelo) newErrors.suelo = 'Selecciona un tipo de suelo para recomendar ruedas adicionales';
    }

    // Validar datos del usuario
    if (!userData.disciplina) newErrors.disciplina = 'Selecciona una disciplina';
    if (!userData.pesoKg || userData.pesoKg <= 0) newErrors.pesoKg = 'Ingresa un peso válido';
    if (!userData.experiencia) newErrors.experiencia = 'Selecciona tu nivel de experiencia';
    if (!userData.estilo) newErrors.estilo = 'Selecciona un estilo';
    if (!userData.suelo) newErrors.suelo = 'Selecciona un tipo de suelo';
    if (!userData.priority) newErrors.priority = 'Selecciona una prioridad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para seleccionar y completar las ruedas según la prioridad del usuario
  const selectAndCompleteWheels = (wheelsData, userData) => {
    // Aplanar el array de ruedas
    let allWheels = [];
    wheelsData.forEach(wheel => {
      for (let i = 0; i < wheel.quantity; i++) {
        allWheels.push(wheel.hardness);
      }
    });
    
    const totalWheels = allWheels.length;
    const wheelsNeeded = 8 - totalWheels;
    
    // Si faltan ruedas, agregar recomendadas
    if (wheelsNeeded > 0) {
      const recommendedWheels = getRecommendedWheels(userData);
      let recommendedCount = 0;
      
      // Agregar ruedas recomendadas hasta completar 8
      while (allWheels.length < 8) {
        allWheels.push(recommendedWheels[recommendedCount % recommendedWheels.length]);
        recommendedCount++;
      }
    }
    
    // Ordenar por dureza según la prioridad del usuario
    if (userData.priority === 'Más agarre') {
      // Para más agarre, ordenar de más blanda a más dura
      allWheels.sort((a, b) => compareHardness(a, b));
    } else if (userData.priority === 'Más velocidad') {
      // Para más velocidad, ordenar de más dura a más blanda
      allWheels.sort((a, b) => -compareHardness(a, b));
    } else {
      // Para balance, alternar entre blanda y dura
      allWheels.sort((a, b) => compareHardness(a, b));
      const balancedWheels = [];
      let left = 0;
      let right = allWheels.length - 1;
      
      while (left <= right) {
        if (left === right) {
          balancedWheels.push(allWheels[left]);
        } else {
          balancedWheels.push(allWheels[left], allWheels[right]);
        }
        left++;
        right--;
      }
      allWheels = balancedWheels;
    }
    
    return {
      wheels: allWheels,
      addedWheels,
      originalWheels: totalWheels
    };
  };

  // Función para comparar durezas de ruedas
  const compareHardness = (a, b) => {
    const hardnessOrder = ['82A', '83A', '84A', '85A', '86A', '87A', '88A', '89A', '90A', 'Firm', 'XFirm', 'XXFirm'];
    return hardnessOrder.indexOf(a) - hardnessOrder.indexOf(b);
  };
  
  // Obtener ruedas recomendadas según las preferencias del usuario
  const getRecommendedWheels = (count, userData) => {
    let recommended = [];
    
    // Basado en la prioridad del usuario
    if (userData.priority === 'Más agarre') {
      // Para más agarre, recomendamos ruedas más blandas
      recommended = ['82A', '83A', '84A', '85A', '86A'];
    } else if (userData.priority === 'Más velocidad') {
      // Para más velocidad, recomendamos ruedas más duras
      recommended = ['86A', '87A', '88A', '89A', '90A'];
    } else {
      // Balanceado
      recommended = ['84A', '85A', '86A', '87A', '88A'];
    }
    
    // Ajustar según el tipo de suelo
    if (userData.suelo === 'asfalto rugoso' || userData.suelo === 'calle') {
      // Para superficies ásperas, ruedas un poco más duras
      recommended = recommended.map(w => {
        const hardness = parseInt(w);
        if (!isNaN(hardness) && hardness < 88) return `${hardness + 2}A`;
        return w;
      });
    } else if (userData.suelo === 'pista' || userData.suelo === 'pavimento liso') {
      // Para superficies lisas, ruedas más blandas
      recommended = recommended.map(w => {
        const hardness = parseInt(w);
        if (!isNaN(hardness) && hardness > 84) return `${hardness - 2}A`;
        return w;
      });
    }
    
    // Asegurar que no haya duplicados
    recommended = [...new Set(recommended)];
    
    // Repetir el array si es necesario para alcanzar el conteo deseado
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(recommended[i % recommended.length]);
    }
    
    return result;
  };
  
  // Procesar las ruedas: completar con recomendadas o seleccionar las mejores
  const processWheels = (wheelsData, userData) => {
    // Aplanar el array de ruedas
    let allWheels = [];
    wheelsData.forEach(wheel => {
      for (let i = 0; i < wheel.quantity; i++) {
        allWheels.push(wheel.hardness);
      }
    });
    
    const totalWheels = allWheels.length;
    
    // Si no hay suficientes ruedas, agregar recomendadas
    if (totalWheels < 8) {
      const wheelsToAdd = 8 - totalWheels;
      const recommendedWheels = getRecommendedWheels(wheelsToAdd, userData);
      allWheels = [...allWheels, ...recommendedWheels];
    }
    // Si hay más de 8 ruedas, seleccionar las mejores según la prioridad
    else if (totalWheels > 8) {
      if (userData.priority === 'Más agarre') {
        // Para más agarre, seleccionar las más blandas
        allWheels = allWheels.sort(compareHardness).slice(0, 8);
      } else if (userData.priority === 'Más velocidad') {
        // Para más velocidad, seleccionar las más duras
        allWheels = allWheels.sort((a, b) => -compareHardness(a, b)).slice(0, 8);
      } else {
        // Balanceado: mezclar suaves y duras
        allWheels.sort(compareHardness);
        const balanced = [];
        let left = 0;
        let right = allWheels.length - 1;
        
        while (balanced.length < 8 && left <= right) {
          balanced.push(allWheels[left]);
          if (balanced.length < 8 && left !== right) {
            balanced.push(allWheels[right]);
          }
          left++;
          right--;
        }
        allWheels = balanced.slice(0, 8);
      }
    }
    
    // Contar cuántas ruedas se agregaron
    const addedWheels = Math.max(0, 8 - totalWheels);
    
    return {
      wheels: allWheels,
      addedWheels,
      originalWheels: totalWheels
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convertir a formato para la función de cálculo
      const wheelsData = wheels
        .filter(w => w.hardness && w.quantity)
        .map(w => ({
          hardness: w.hardness,
          quantity: parseInt(w.quantity)
        }));
      
      // Procesar las ruedas (completar con recomendadas o seleccionar las mejores)
      const { wheels: processedWheels, addedWheels, originalWheels } = processWheels(wheelsData, userData);
      
      // Contar cuántas hay de cada dureza
      const wheelCounts = {};
      processedWheels.forEach(wheel => {
        wheelCounts[wheel] = (wheelCounts[wheel] || 0) + 1;
      });
      
      // Formatear el resultado
      const resultWheels = Object.entries(wheelCounts).map(([hardness, quantity]) => ({
        hardness,
        quantity,
        isRecommended: !wheels.some(w => w.hardness === hardness)
      }));
      
      // Determinar la estrategia de posicionamiento
      let strategy = 'Configuración equilibrada';
      if (userData.priority === 'Más agarre') {
        strategy = 'Configuración para máximo agarre';
      } else if (userData.priority === 'Más velocidad') {
        strategy = 'Configuración para máxima velocidad';
      }
      
      // Pasar los resultados al componente padre
      onSubmit({
        wheels: resultWheels,
        userData: userData,
        strategy,
        addedWheels,
        originalWheels,
        hasMoreWheels: originalWheels > 8
      });
    }
  };

  const getTotalWheels = () => {
    return wheels.reduce((sum, wheel) => {
      return sum + (parseInt(wheel.quantity) || 0);
    }, 0);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings sx={{ color: 'primary.main' }} />
        Posicionamiento de Ruedas
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
      Indica las ruedas que ya tienes y te ayudamos a ordenarlas en cada posición del patín para lograr mejor agarre, control y fluidez al patinar.
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Sección: Datos del Usuario */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
            Información del Patinador
          </Typography>
          <Grid container spacing={2}>
            {/* Disciplina */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.disciplina}>
                <InputLabel>Disciplina</InputLabel>
                <Select
                  value={userData.disciplina}
                  onChange={handleUserDataChange('disciplina')}
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
                value={userData.pesoKg}
                onChange={handleUserDataChange('pesoKg')}
                placeholder="Ej: 70"
                error={!!errors.pesoKg}
                helperText={errors.pesoKg}
              />
            </Grid>

            {/* Experiencia */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.experiencia}>
                <InputLabel>Experiencia</InputLabel>
                <Select
                  value={userData.experiencia}
                  onChange={handleUserDataChange('experiencia')}
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
                  value={userData.estilo}
                  onChange={handleUserDataChange('estilo')}
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
                  value={userData.suelo}
                  onChange={handleUserDataChange('suelo')}
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
                  value={userData.temperatura}
                  onChange={handleUserDataChange('temperatura')}
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
                  value={userData.priority}
                  onChange={handleUserDataChange('priority')}
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
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sección: Ruedas Disponibles */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
            Ruedas Disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ingresa las ruedas que tienes disponibles (mínimo 1). 
            {getTotalWheels() < 8 ? (
              <Typography component="span" color="info.main" sx={{ fontWeight: 'bold' }}>
                Se completarán con {8 - getTotalWheels()} ruedas recomendadas según tus preferencias.
              </Typography>
            ) : getTotalWheels() > 8 ? (
              <Typography component="span" color="info.main" sx={{ fontWeight: 'bold' }}>
                Se seleccionarán automáticamente las 8 mejores ruedas según tus preferencias.
              </Typography>
            ) : (
              <Typography component="span" color="success.main" sx={{ fontWeight: 'bold' }}>
                Tienes exactamente 8 ruedas. ¡Perfecto!
              </Typography>
            )}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: 1, 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              minWidth: '200px'
            }}>
              <Typography variant="subtitle2" color="text.secondary">Resumen de ruedas</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: getTotalWheels() > 0 ? 'success.main' : 'text.secondary',
                    fontWeight: 'bold'
                  }}
                >
                  {getTotalWheels()} ruedas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ingresadas
                </Typography>
                {getTotalWheels() > 0 && getTotalWheels() < 8 && (
                  <>
                    <Typography variant="body2" color="text.secondary">+</Typography>
                    <Typography variant="body2" color="info.main" fontWeight="bold">
                      {8 - getTotalWheels()} recomendadas
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            
            {getTotalWheels() > 0 && getTotalWheels() < 8 && (
              <Box sx={{ 
                bgcolor: 'info.light', 
                p: 1, 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Info color="info" fontSize="small" />
                <Typography variant="caption" color="info.dark">
                  Las ruedas recomendadas se elegirán en base a tus preferencias de {userData.priority?.toLowerCase() || 'prioridad'}
                </Typography>
              </Box>
            )}
          </Box>
          {errors.total && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.total}
            </FormHelperText>
          )}
        </Box>

        <Grid container spacing={2}>
          {wheels.map((wheel, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <FormControl sx={{ flex: 1 }} error={!!errors[`wheel_${index}_hardness`]}>
                  <InputLabel>Dureza</InputLabel>
                  <Select
                    value={wheel.hardness}
                    onChange={handleWheelChange(index, 'hardness')}
                    label="Dureza"
                  >
                    {HARDNESS_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[`wheel_${index}_hardness`] && (
                    <FormHelperText>{errors[`wheel_${index}_hardness`]}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  type="number"
                  label="Cantidad"
                  value={wheel.quantity}
                  onChange={handleWheelChange(index, 'quantity')}
                  error={!!errors[`wheel_${index}_quantity`]}
                  helperText={errors[`wheel_${index}_quantity`]}
                  inputProps={{ min: 1, max: 8 }}
                  sx={{ width: 150 }}
                />

                {wheels.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveWheel(index)}
                    sx={{ mt: 1 }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2, mb: 3 }}>
          <Button
            startIcon={<Add />}
            onClick={handleAddWheel}
            variant="outlined"
            size="small"
          >
            Agregar Tipo de Rueda
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<Calculate />}
          sx={{ py: 1.5 }}
        >
          Calcular Posicionamiento
        </Button>
      </form>
    </Paper>
  );
}

export default WheelPositionForm;
