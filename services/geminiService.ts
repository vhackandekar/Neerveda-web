import { GoogleGenAI, Type } from "@google/genai";
import { WaterQualityMetrics, AIRecommendation, SystemHealthData, PredictiveAlert, RecommendationStatus, SystemHealthStatus } from '../types';

// Fix: Initialize GoogleGenAI with a named apiKey parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Using the recommended 'gemini-2.5-flash' model
const model = 'gemini-2.5-flash';

export const getWaterReuseInsight = async (metrics: WaterQualityMetrics): Promise<AIRecommendation> => {
    const prompt = `
        Analyze the following water quality metrics for a household greywater recycling system.
        - pH: ${metrics.ph}
        - Total Dissolved Solids (TDS): ${metrics.tds} ppm
        - Turbidity: ${metrics.turbidity} NTU
        - Temperature: ${metrics.temperature}°C

        Based on these metrics, provide a JSON response with the following structure:
        {
          "status": "Excellent" | "Good" | "Caution" | "Unsafe",
          "recommendation": "A short, actionable recommendation for the user.",
          "suitableUses": ["A list of suitable non-potable uses, e.g., 'Toilet flushing', 'Garden irrigation'"],
          "unsuitableUses": ["A list of unsuitable uses, e.g., 'Drinking', 'Bathing'"],
          "explanation": "A brief explanation of why the water is in its current state and why the recommendations are made."
        }

        Guidelines:
        - pH should ideally be between 6.5 and 8.5.
        - TDS should be below 500 ppm for general use.
        - Turbidity should be below 5 NTU.
        - Status should be 'Excellent' if all metrics are optimal, 'Good' if slightly off but safe for most uses, 'Caution' if one or more metrics are borderline, and 'Unsafe' if any metric indicates a potential hazard for reuse.
        - Suitable uses can include toilet flushing, garden irrigation (for non-edible plants), cleaning floors.
        - Unsuitable uses always include drinking, cooking, bathing, and irrigating edible plants if quality is not excellent.
    `;
    
    // Fix: Using responseSchema for structured JSON output as per guidelines
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    status: { type: Type.STRING, enum: Object.values(RecommendationStatus) },
                    recommendation: { type: Type.STRING },
                    suitableUses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    unsuitableUses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    explanation: { type: Type.STRING }
                },
                required: ["status", "recommendation", "suitableUses", "unsuitableUses", "explanation"]
            }
        }
    });

    // Fix: Correctly extracting the response text and parsing it
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIRecommendation;
};

export const getPredictiveMaintenanceAlert = async (healthData: SystemHealthData): Promise<PredictiveAlert> => {
    const prompt = `
        Analyze the following system health data from a household greywater recycling unit:
        - Filter Pressure: ${healthData.filterPressure} PSI (Normal range: 5-15 PSI)
        - Pump Uptime: ${healthData.pumpUptimeHours} hours (Recommended checkup every 800 hours)
        - Water Turbidity Trend: ${healthData.waterTurbidityTrend}

        Based on this data, provide a JSON response with a predictive maintenance alert. The structure should be:
        {
            "component": "The primary component at risk (e.g., 'Filter', 'Pump').",
            "status": "Optimal" | "Degraded" | "Critical",
            "prediction": "A concise prediction of the potential issue (e.g., 'Filter is likely to clog within the next 48 hours.').",
            "recommendation": "A clear, actionable recommendation for the user (e.g., 'Schedule a backwash cycle for the filter system.')."
        }

        Guidelines:
        - If pressure is > 15 PSI, the filter is a primary concern. Status is likely 'Degraded' or 'Critical'.
        - If pump uptime is approaching or has exceeded 800 hours, it's a concern. Status is 'Degraded'.
        - If turbidity is 'increasing' and pressure is high, it's a critical filter issue.
        - If all values are normal, the status is 'Optimal', and the prediction should be positive.
    `;

    // Fix: Using responseSchema for structured JSON output as per guidelines
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    component: { type: Type.STRING },
                    status: { type: Type.STRING, enum: Object.values(SystemHealthStatus) },
                    prediction: { type: Type.STRING },
                    recommendation: { type: Type.STRING }
                },
                required: ["component", "status", "prediction", "recommendation"]
            }
        }
    });

    // Fix: Correctly extracting the response text and parsing it
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PredictiveAlert;
};
