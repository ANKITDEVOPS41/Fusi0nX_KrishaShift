import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import { config } from '@/lib/config';

export interface CropPrediction {
  crop: string;
  profitability: number;
  confidence: number;
  factors: {
    weather: number;
    soil: number;
    market: number;
    season: number;
    location: number;
  };
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  expectedYield: number;
  expectedRevenue: number;
  expectedCost: number;
  expectedProfit: number;
}

export interface WeatherPrediction {
  location: [number, number];
  predictions: {
    date: Date;
    temperature: { min: number; max: number };
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    confidence: number;
  }[];
  alerts: {
    type: 'drought' | 'flood' | 'heatwave' | 'frost' | 'storm';
    severity: 'low' | 'medium' | 'high';
    probability: number;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];
}

export interface DiseaseDetection {
  crop: string;
  disease: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  affectedArea: number; // percentage
  treatment: {
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
  economicImpact: {
    yieldLoss: number;
    costOfTreatment: number;
    totalLoss: number;
  };
}

export interface SoilAnalysis {
  location: [number, number];
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  salinity: number;
  recommendations: {
    fertilizers: string[];
    amendments: string[];
    crops: string[];
  };
  healthScore: number; // 0-100
}

export interface MarketForecast {
  crop: string;
  timeframe: '7d' | '30d' | '90d' | '1y';
  predictions: {
    date: Date;
    price: number;
    confidence: number;
    factors: {
      supply: number;
      demand: number;
      weather: number;
      policy: number;
      international: number;
    };
  }[];
  accuracy: number; // Historical accuracy percentage
  riskMetrics: {
    volatility: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

class MLService {
  private models: Map<string, tf.LayersModel> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeModels();
  }

  // Initialize TensorFlow models
  private async initializeModels(): Promise<void> {
    try {
      console.log('Initializing ML models...');

      // Set TensorFlow backend
      await tf.setBackend(config.ml.tensorflow.backend);

      // Load pre-trained models
      await Promise.all([
        this.loadModel('crop-profitability', '/models/crop_profitability.json'),
        this.loadModel('price-prediction', '/models/price_prediction.json'),
        this.loadModel('weather-forecast', '/models/weather_forecast.json'),
        this.loadModel('disease-detection', '/models/disease_detection.json'),
        this.loadModel('soil-analysis', '/models/soil_analysis.json'),
      ]);

      this.isInitialized = true;
      console.log('ML models initialized successfully');
    } catch (error) {
      console.error('Error initializing ML models:', error);
    }
  }

  // Load individual model
  private async loadModel(name: string, url: string): Promise<void> {
    try {
      const model = await tf.loadLayersModel(url);
      this.models.set(name, model);
      console.log(`Model ${name} loaded successfully`);
    } catch (error) {
      console.error(`Error loading model ${name}:`, error);
      // Fallback to API-based predictions
    }
  }

  // Predict crop profitability
  async predictCropProfitability(
    farmData: {
      location: [number, number];
      soilType: string;
      farmSize: number;
      irrigationAvailable: boolean;
      previousCrop: string;
      season: 'kharif' | 'rabi' | 'summer';
    },
    crops: string[]
  ): Promise<CropPrediction[]> {
    try {
      const model = this.models.get('crop-profitability');

      if (model && this.isInitialized) {
        return this.predictWithLocalModel(model, farmData, crops);
      } else {
        return this.predictWithAPI('crop-profitability', { farmData, crops });
      }
    } catch (error) {
      console.error('Error predicting crop profitability:', error);
      throw error;
    }
  }

  // Local model prediction for crop profitability
  private async predictWithLocalModel(
    model: tf.LayersModel,
    farmData: any,
    crops: string[]
  ): Promise<CropPrediction[]> {
    const predictions: CropPrediction[] = [];

    for (const crop of crops) {
      // Prepare input features
      const features = this.prepareCropFeatures(farmData, crop);
      const inputTensor = tf.tensor2d([features]);

      // Make prediction
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const result = await prediction.data();

      // Parse results
      const profitability = result[0];
      const confidence = result[1];
      const yieldPrediction = result[2];
      const costPrediction = result[3];

      predictions.push({
        crop,
        profitability: profitability * 100,
        confidence: confidence * 100,
        factors: {
          weather: result[4] * 100,
          soil: result[5] * 100,
          market: result[6] * 100,
          season: result[7] * 100,
          location: result[8] * 100,
        },
        recommendations: this.generateRecommendations(crop, farmData, result),
        riskLevel: profitability > 0.7 ? 'low' : profitability > 0.4 ? 'medium' : 'high',
        expectedYield: yieldPrediction,
        expectedRevenue: yieldPrediction * this.getMarketPrice(crop),
        expectedCost: costPrediction,
        expectedProfit: (yieldPrediction * this.getMarketPrice(crop)) - costPrediction,
      });

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();
    }

    return predictions;
  }

  // API-based prediction fallback
  private async predictWithAPI(endpoint: string, data: any): Promise<any> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/api/ml/${endpoint}`, data);
      return response.data.predictions;
    } catch (error) {
      console.error(`Error with API prediction ${endpoint}:`, error);
      throw error;
    }
  }

  // Prepare features for crop prediction
  private prepareCropFeatures(farmData: any, crop: string): number[] {
    const features = [
      farmData.location[0], // latitude
      farmData.location[1], // longitude
      farmData.farmSize,
      farmData.irrigationAvailable ? 1 : 0,
      this.encodeSoilType(farmData.soilType),
      this.encodeCrop(farmData.previousCrop),
      this.encodeCrop(crop),
      this.encodeSeason(farmData.season),
      // Add weather features (would be fetched from weather service)
      25, // average temperature
      60, // humidity
      800, // rainfall
      // Add market features
      this.getMarketPrice(crop),
      this.getMarketDemand(crop),
    ];

    return features;
  }

  // Predict weather patterns
  async predictWeather(
    location: [number, number],
    days: number = 15
  ): Promise<WeatherPrediction> {
    try {
      const model = this.models.get('weather-forecast');

      if (model && this.isInitialized) {
        return this.predictWeatherWithModel(model, location, days);
      } else {
        return this.predictWithAPI('weather-forecast', { location, days });
      }
    } catch (error) {
      console.error('Error predicting weather:', error);
      throw error;
    }
  }

  // Local weather prediction
  private async predictWeatherWithModel(
    model: tf.LayersModel,
    location: [number, number],
    days: number
  ): Promise<WeatherPrediction> {
    // Get historical weather data
    const historicalData = await this.getHistoricalWeather(location, 30);

    // Prepare input sequence
    const features = this.prepareWeatherFeatures(historicalData);
    const inputTensor = tf.tensor3d([features]);

    // Make prediction
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const result = await prediction.data();

    // Parse results into weather predictions
    const predictions = [];
    for (let i = 0; i < days; i++) {
      const baseIndex = i * 6; // 6 features per day
      predictions.push({
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        temperature: {
          min: result[baseIndex],
          max: result[baseIndex + 1],
        },
        humidity: result[baseIndex + 2],
        rainfall: result[baseIndex + 3],
        windSpeed: result[baseIndex + 4],
        pressure: result[baseIndex + 5],
        confidence: Math.min(0.95 - (i * 0.05), 0.6), // Decreasing confidence over time
      });
    }

    // Generate alerts based on predictions
    const alerts = this.generateWeatherAlerts(predictions);

    // Clean up
    inputTensor.dispose();
    prediction.dispose();

    return {
      location,
      predictions,
      alerts,
    };
  }

  // Detect crop diseases from images
  async detectDisease(
    imageData: ImageData | HTMLImageElement,
    crop: string
  ): Promise<DiseaseDetection> {
    try {
      const model = this.models.get('disease-detection');

      if (model && this.isInitialized) {
        return this.detectDiseaseWithModel(model, imageData, crop);
      } else {
        // Convert image to base64 for API
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        if (imageData instanceof HTMLImageElement) {
          canvas.width = imageData.width;
          canvas.height = imageData.height;
          ctx.drawImage(imageData, 0, 0);
        } else {
          canvas.width = imageData.width;
          canvas.height = imageData.height;
          ctx.putImageData(imageData, 0, 0);
        }

        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        return this.predictWithAPI('disease-detection', { image: base64Image, crop });
      }
    } catch (error) {
      console.error('Error detecting disease:', error);
      throw error;
    }
  }

  // Local disease detection
  private async detectDiseaseWithModel(
    model: tf.LayersModel,
    imageData: ImageData | HTMLImageElement,
    crop: string
  ): Promise<DiseaseDetection> {
    // Preprocess image
    let imageTensor: tf.Tensor;

    if (imageData instanceof HTMLImageElement) {
      imageTensor = tf.browser.fromPixels(imageData);
    } else {
      imageTensor = tf.browser.fromPixels(imageData);
    }

    // Resize to model input size (224x224)
    const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const normalized = resized.div(255.0);
    const batched = normalized.expandDims(0);

    // Make prediction
    const prediction = model.predict(batched) as tf.Tensor;
    const result = await prediction.data();

    // Parse results (assuming model outputs disease probabilities)
    const diseases = [
      'healthy', 'bacterial_blight', 'brown_spot', 'leaf_smut',
      'powdery_mildew', 'rust', 'viral_disease'
    ];

    const maxIndex = result.indexOf(Math.max(...Array.from(result)));
    const confidence = result[maxIndex];
    const detectedDisease = diseases[maxIndex];

    // Clean up tensors
    imageTensor.dispose();
    resized.dispose();
    normalized.dispose();
    batched.dispose();
    prediction.dispose();

    return {
      crop,
      disease: detectedDisease,
      confidence: confidence * 100,
      severity: confidence > 0.8 ? 'severe' : confidence > 0.5 ? 'moderate' : 'mild',
      affectedArea: confidence * 100, // Simplified
      treatment: this.getTreatmentRecommendations(detectedDisease),
      economicImpact: this.calculateEconomicImpact(crop, detectedDisease, confidence),
    };
  }

  // Analyze soil from satellite/sensor data
  async analyzeSoil(
    location: [number, number],
    sensorData?: any
  ): Promise<SoilAnalysis> {
    try {
      const model = this.models.get('soil-analysis');

      if (model && this.isInitialized && sensorData) {
        return this.analyzeSoilWithModel(model, location, sensorData);
      } else {
        return this.predictWithAPI('soil-analysis', { location, sensorData });
      }
    } catch (error) {
      console.error('Error analyzing soil:', error);
      throw error;
    }
  }

  // Forecast market prices
  async forecastMarketPrices(
    crop: string,
    timeframe: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<MarketForecast> {
    try {
      const model = this.models.get('price-prediction');

      if (model && this.isInitialized) {
        return this.forecastPricesWithModel(model, crop, timeframe);
      } else {
        return this.predictWithAPI('price-forecast', { crop, timeframe });
      }
    } catch (error) {
      console.error('Error forecasting prices:', error);
      throw error;
    }
  }

  // Generate crop recommendations based on multiple factors
  async generateCropRecommendations(
    farmData: {
      location: [number, number];
      soilType: string;
      farmSize: number;
      irrigationAvailable: boolean;
      budget: number;
      experience: 'beginner' | 'intermediate' | 'expert';
      riskTolerance: 'low' | 'medium' | 'high';
    }
  ): Promise<{
    recommendations: CropPrediction[];
    diversificationSuggestions: string[];
    riskAnalysis: {
      portfolioRisk: number;
      expectedReturn: number;
      recommendations: string[];
    };
  }> {
    try {
      // Get predictions for all suitable crops
      const suitableCrops = this.getSuitableCrops(farmData);
      const predictions = await this.predictCropProfitability(farmData, suitableCrops);

      // Sort by profitability and risk
      const sortedPredictions = predictions.sort((a, b) => {
        const scoreA = a.profitability * a.confidence / 10000;
        const scoreB = b.profitability * b.confidence / 10000;
        return scoreB - scoreA;
      });

      // Generate diversification suggestions
      const diversificationSuggestions = this.generateDiversificationSuggestions(
        sortedPredictions,
        farmData
      );

      // Calculate portfolio risk
      const riskAnalysis = this.calculatePortfolioRisk(sortedPredictions, farmData);

      return {
        recommendations: sortedPredictions.slice(0, 5), // Top 5 recommendations
        diversificationSuggestions,
        riskAnalysis,
      };
    } catch (error) {
      console.error('Error generating crop recommendations:', error);
      throw error;
    }
  }

  // Utility methods
  private encodeSoilType(soilType: string): number {
    const types = ['clay', 'sandy', 'loamy', 'black', 'red', 'alluvial'];
    return types.indexOf(soilType) + 1;
  }

  private encodeCrop(crop: string): number {
    const crops = ['groundnut', 'sunflower', 'soybean', 'mustard', 'safflower', 'niger', 'castor'];
    return crops.indexOf(crop) + 1;
  }

  private encodeSeason(season: string): number {
    const seasons = ['kharif', 'rabi', 'summer'];
    return seasons.indexOf(season) + 1;
  }

  private getMarketPrice(crop: string): number {
    // This would fetch real market prices
    const prices: Record<string, number> = {
      groundnut: 5500,
      sunflower: 6200,
      soybean: 4800,
      mustard: 5800,
      safflower: 5200,
      niger: 7500,
      castor: 6800,
    };
    return prices[crop] || 5000;
  }

  private getMarketDemand(crop: string): number {
    // This would fetch real demand data
    const demand: Record<string, number> = {
      groundnut: 0.8,
      sunflower: 0.9,
      soybean: 0.7,
      mustard: 0.85,
      safflower: 0.6,
      niger: 0.5,
      castor: 0.75,
    };
    return demand[crop] || 0.7;
  }

  private generateRecommendations(crop: string, farmData: any, result: Float32Array): string[] {
    const recommendations = [];

    if (result[4] < 0.5) { // Weather factor low
      recommendations.push('Consider weather-resistant varieties');
    }

    if (result[5] < 0.5) { // Soil factor low
      recommendations.push('Improve soil health with organic matter');
    }

    if (result[6] < 0.5) { // Market factor low
      recommendations.push('Explore contract farming opportunities');
    }

    return recommendations;
  }

  private async getHistoricalWeather(location: [number, number], days: number): Promise<any[]> {
    // This would fetch real historical weather data
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
      temperature: { min: 20 + Math.random() * 10, max: 30 + Math.random() * 10 },
      humidity: 50 + Math.random() * 30,
      rainfall: Math.random() * 20,
      windSpeed: 5 + Math.random() * 10,
      pressure: 1010 + Math.random() * 20,
    }));
  }

  private prepareWeatherFeatures(historicalData: any[]): number[][] {
    return historicalData.map(day => [
      day.temperature.min,
      day.temperature.max,
      day.humidity,
      day.rainfall,
      day.windSpeed,
      day.pressure,
    ]);
  }

  private generateWeatherAlerts(predictions: any[]): any[] {
    const alerts = [];

    // Check for extreme weather conditions
    predictions.forEach((pred, index) => {
      if (pred.temperature.max > 40) {
        alerts.push({
          type: 'heatwave',
          severity: 'high',
          probability: 0.8,
          startDate: pred.date,
          endDate: new Date(pred.date.getTime() + 24 * 60 * 60 * 1000),
          description: 'Extreme heat expected. Ensure adequate irrigation.',
        });
      }

      if (pred.rainfall > 50) {
        alerts.push({
          type: 'flood',
          severity: 'medium',
          probability: 0.7,
          startDate: pred.date,
          endDate: new Date(pred.date.getTime() + 24 * 60 * 60 * 1000),
          description: 'Heavy rainfall expected. Check drainage systems.',
        });
      }
    });

    return alerts;
  }

  private getTreatmentRecommendations(disease: string): any {
    const treatments: Record<string, any> = {
      bacterial_blight: {
        organic: ['Neem oil spray', 'Copper sulfate solution'],
        chemical: ['Streptomycin', 'Copper oxychloride'],
        preventive: ['Crop rotation', 'Resistant varieties'],
      },
      brown_spot: {
        organic: ['Trichoderma application', 'Baking soda spray'],
        chemical: ['Mancozeb', 'Propiconazole'],
        preventive: ['Proper spacing', 'Avoid overhead irrigation'],
      },
      // Add more diseases...
    };

    return treatments[disease] || {
      organic: ['Consult agricultural expert'],
      chemical: ['Consult agricultural expert'],
      preventive: ['Follow good agricultural practices'],
    };
  }

  private calculateEconomicImpact(crop: string, disease: string, confidence: number): any {
    const baseYield = 2000; // kg per hectare
    const yieldLoss = confidence * 0.3; // 30% max loss
    const treatmentCost = confidence * 5000; // ₹5000 max treatment cost

    return {
      yieldLoss: yieldLoss * 100,
      costOfTreatment: treatmentCost,
      totalLoss: (baseYield * yieldLoss * this.getMarketPrice(crop) / 100) + treatmentCost,
    };
  }

  private getSuitableCrops(farmData: any): string[] {
    // This would use location and soil data to determine suitable crops
    return ['groundnut', 'sunflower', 'soybean', 'mustard', 'safflower'];
  }

  private generateDiversificationSuggestions(predictions: CropPrediction[], farmData: any): string[] {
    const suggestions = [];

    if (predictions.length > 1) {
      suggestions.push('Consider growing 2-3 different crops to reduce risk');
    }

    if (farmData.irrigationAvailable) {
      suggestions.push('Utilize irrigation for high-value crops');
    }

    suggestions.push('Allocate 20% of land for experimental crops');

    return suggestions;
  }

  private calculatePortfolioRisk(predictions: CropPrediction[], farmData: any): any {
    const avgProfitability = predictions.reduce((sum, p) => sum + p.profitability, 0) / predictions.length;
    const riskVariance = predictions.reduce((sum, p) => sum + Math.pow(p.profitability - avgProfitability, 2), 0) / predictions.length;
    const portfolioRisk = Math.sqrt(riskVariance);

    return {
      portfolioRisk,
      expectedReturn: avgProfitability,
      recommendations: [
        portfolioRisk > 20 ? 'Consider more stable crops' : 'Good risk-return balance',
        'Diversify across different crop categories',
        'Monitor market trends regularly',
      ],
    };
  }

  // Cleanup method
  dispose(): void {
    this.models.forEach(model => model.dispose());
    this.models.clear();
  }
}

export const mlService = new MLService();
export default mlService;