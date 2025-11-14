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
  IconButton
} from '@mui/material';
import { Add, Delete, Calculate, Settings } from '@mui/icons-material';

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

  const validate = () => {
    const newErrors = {};
    let totalWheels = 0;

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

    if (totalWheels !== 8) {
      newErrors.total = `Debes tener exactamente 8 ruedas. Total actual: ${totalWheels}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      
      onSubmit(wheelsData);
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
        Ruedas Disponibles
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ingresa las ruedas que tienes disponibles. Debes tener exactamente 8 ruedas en total.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, color: getTotalWheels() === 8 ? 'success.main' : 'error.main' }}>
            Total: {getTotalWheels()} / 8 ruedas
          </Typography>
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

