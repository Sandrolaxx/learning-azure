import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Função auxiliar para buscar coordenadas de uma cidade
async function getCityCoordinates(city: string) {
  const response = await axios.get(
    'https://geocoding-api.open-meteo.com/v1/search',
    {
      params: {
        name: city,
        count: 1,
        language: 'pt',
        format: 'json'
      }
    }
  );

  if (!response.data.results || response.data.results.length === 0) {
    throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
  }

  const result = response.data.results[0];
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    country: result.country,
    admin1: result.admin1
  };
}

// Rota de health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota principal
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Weather API - Open-Meteo',
    endpoints: {
      health: '/health',
      weather: '/weather/:city',
      forecast: '/forecast/:city'
    }
  });
});

// Rota para consultar clima atual de uma cidade
app.get('/weather/:city', async (req: Request, res: Response) => {
  const { city } = req.params;

  try {
    // Buscar coordenadas da cidade
    const location = await getCityCoordinates(city);

    // Buscar dados do clima
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
          timezone: 'auto'
        }
      }
    );

    const data = response.data;
    
    res.json({
      city: location.name,
      country: location.country,
      region: location.admin1,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      temperature: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.pressure_msl,
      precipitation: data.current.precipitation,
      weather_code: data.current.weather_code,
      wind_speed: data.current.wind_speed_10m,
      wind_direction: data.current.wind_direction_10m,
      cloud_cover: data.current.cloud_cover,
      timestamp: data.current.time,
      units: data.current_units
    });
  } catch (error: any) {
    if (error.message === 'Cidade não encontrada. Verifique o nome e tente novamente.') {
      res.status(404).json({ error: 'Cidade não encontrada. Verifique o nome e tente novamente.' });
    } else {
      res.status(500).json({ 
        error: 'Erro ao consultar dados do clima',
        message: error.message 
      });
    }
  }
});

// Rota para consultar previsão
app.get('/forecast/:city', async (req: Request, res: Response) => {
  const { city } = req.params;
  const days = parseInt(req.query.days as string) || 7;

  try {
    // Buscar coordenadas da cidade
    const location = await getCityCoordinates(city);

    // Buscar previsão do tempo
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,cloud_cover,wind_speed_10m',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
          timezone: 'auto',
          forecast_days: days
        }
      }
    );

    const data = response.data;
    
    res.json({
      city: location.name,
      country: location.country,
      region: location.admin1,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      daily_forecast: data.daily.time.map((time: string, index: number) => ({
        date: time,
        weather_code: data.daily.weather_code[index],
        temp_max: data.daily.temperature_2m_max[index],
        temp_min: data.daily.temperature_2m_min[index],
        precipitation_sum: data.daily.precipitation_sum[index],
        precipitation_probability: data.daily.precipitation_probability_max[index],
        wind_speed_max: data.daily.wind_speed_10m_max[index]
      })),
      hourly_forecast: data.hourly.time.map((time: string, index: number) => ({
        datetime: time,
        temperature: data.hourly.temperature_2m[index],
        feels_like: data.hourly.apparent_temperature[index],
        humidity: data.hourly.relative_humidity_2m[index],
        precipitation: data.hourly.precipitation[index],
        precipitation_probability: data.hourly.precipitation_probability[index],
        weather_code: data.hourly.weather_code[index],
        cloud_cover: data.hourly.cloud_cover[index],
        wind_speed: data.hourly.wind_speed_10m[index]
      })),
      units: {
        daily: data.daily_units,
        hourly: data.hourly_units
      }
    });
  } catch (error: any) {
    if (error.message === 'Cidade não encontrada. Verifique o nome e tente novamente.') {
      res.status(404).json({ error: 'Cidade não encontrada. Verifique o nome e tente novamente.' });
    } else {
      res.status(500).json({ 
        error: 'Erro ao consultar previsão do tempo',
        message: error.message 
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🌤️  Weather API rodando na porta ${PORT}`);
  console.log(`📍 Endpoints disponíveis`);
  console.log(`   - GET /health`);
  console.log(`   - GET /weather/:city`);
  console.log(`   - GET /forecast/:city`);
});
