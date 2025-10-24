// Backend - server.js
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Energy data validation
const validateEnergyData = (data) => {
  const errors = [];
  if (!data.minDaily || data.minDaily < 0)
    errors.push("Invalid minDaily value");
  if (!data.maxDaily || data.maxDaily < 0)
    errors.push("Invalid maxDaily value");
  if (!data.peakHour || data.peakHour < 0 || data.peakHour > 23)
    errors.push("Invalid peakHour");
  return errors;

};

const buildEnergyPrompt = (energyStats) => {
  return `
Hey Gemini,
Here's a structured summary from a building energy dataset. This data is recorded every 10 minutes over 4.5 months and represents total energy use (appliances + lighting).

✅ Energy Usage:
• Total daily energy ranges from ${energyStats.minDaily} Wh to ${energyStats.maxDaily} Wh.
• Peak hourly usage typically occurs at hour ${energyStats.peakHour} with average ${energyStats.peakUsage} Wh.
• Average weekday usage: ${energyStats.weekdayAvg} Wh vs weekend: ${energyStats.weekendAvg} Wh.

💡 Energy Efficiency (Mock EEI):
• Avg EEI (total_energy / T1) is ${energyStats.avgEEI}. Lower is better for efficiency.
• (Note: Actual building area not available — T1 used as proxy.)

🌡️ Environmental Factors:
• Outdoor Temp correlation with energy usage: ${energyStats.tempCorrelation}
• Outdoor Humidity correlation: ${energyStats.humidityCorrelation}

🔋 Appliance Breakdown:
• Lights use ${energyStats.lightingPercent}%, Appliances use ${energyStats.appliancePercent}%.

📌 Recommendation:
Review nighttime consumption patterns; possible idle wastage.

🎯 Please analyze these trends, find any hidden patterns, and suggest smart energy optimizations.

Questions:
1. Are there any inefficiencies not obvious from the numbers?
2. What forecasting or anomaly detection methods do you recommend?
3. What smart city dashboard ideas or visualizations should we add?

Please respond in JSON format with these sections:
{
  "insights": "Detailed analysis of energy patterns and trends",
  "inefficiencies": "Hidden inefficiencies and waste patterns identified",
  "recommendations": ["Array of specific actionable recommendations"],
  "forecasting_methods": "Recommended forecasting and anomaly detection approaches",
  "dashboard_ideas": "Smart city dashboard visualization suggestions",
  "urgency_level": "low/medium/high",
  "potential_savings": "Estimated energy savings percentage"
}
`;
};

app.get("/", (req, res) => {
  res.json({
    message: "Energy Analytics API with Gemini AI",
    status: "running",
    endpoints: ["/api/analyze-energy", "/api/health"],
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Main energy analysis endpoint
app.post("/api/analyze-energy", async (req, res) => {
  try {
    const energyStats = req.body;

    // Validate input data
    const validationErrors = validateEnergyData(energyStats);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    const prompt = buildEnergyPrompt(energyStats);

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // const response = await result.response;
    // const text = response.text();

    const text = result.candidates[0].content.parts[0].text;

    // Parse the response
    let analysis;
    try {
      // Try to extract JSON from markdown or raw JSON
      const jsonMatch =
        text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      analysis = jsonMatch
        ? JSON.parse(jsonMatch[1] || jsonMatch[0])
        : JSON.parse(text);

      // Validate the response structure
      if (!analysis.insights || !analysis.recommendations) {
        throw new Error("Invalid response structure from Gemini");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      return res.status(500).json({
        success: false,
        error: "Failed to parse AI response",
        rawResponse: text,
      });
    }

    res.json({
      success: true,
      analysis,
      rawResponse: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing energy data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze energy data",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});
// app.post("/api/analyze-energy", async (req, res) => {
//   try {
//     const energyStats = req.body;

//     // Validate input data
//     const validationErrors = validateEnergyData(energyStats);
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         errors: validationErrors,
//       });
//     }

//     const prompt = buildEnergyPrompt(energyStats);

//     // Send request to Gemini AI
//     const result = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     const text = result.candidates[0].content.parts[0].text;

//     let analysis;
//     try {
//       // Try to extract JSON from response
//       const jsonMatch =
//         text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         analysis = JSON.parse(jsonMatch[1] || jsonMatch[0]);
//       } else {
//         analysis = JSON.parse(text);
//       }
//     } catch (parseError) {
//       // Fallback if JSON parsing fails
//       analysis = {
//         insights: text.substring(0, 500) + "...",
//         inefficiencies:
//           "Analysis shows potential areas for optimization based on usage patterns.",
//         recommendations: [
//           "Implement smart scheduling for non-critical appliances",
//           "Review nighttime consumption patterns",
//           "Consider energy-efficient lighting solutions",
//         ],
//         forecasting_methods:
//           "Time-series analysis with ARIMA models recommended for energy forecasting.",
//         dashboard_ideas:
//           "Add real-time monitoring, predictive alerts, and comparative analysis widgets.",
//         urgency_level: "medium",
//         potential_savings: "15-25%",
//       };
//     }

//     res.json({
//       success: true,
//       energyStats,
//       analysis,
//       rawResponse: text,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error("Error analyzing energy data:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to analyze energy data. Please try again.",
//       details:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });



// Get mock statistics for charts (you can replace with real data)
app.get("/api/stats", (req, res) => {
  const stats = {
    dailyUsage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      energy: Math.floor(Math.random() * 10000) + 10000,
      efficiency: Math.random() * 2 + 3,
    })),
    hourlyPattern: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      usage:
        Math.floor(Math.random() * 200) +
        50 +
        (hour >= 8 && hour <= 18 ? 100 : 0),
    })),
    breakdown: {
      appliances: 96.25,
      lighting: 3.75,
    },
    environmental: Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      temperature: Math.floor(Math.random() * 10) + 18,
      humidity: Math.floor(Math.random() * 20) + 50,
      energy: Math.floor(Math.random() * 5000) + 12000,
    })),
  };

  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Energy Dashboard API ready`);
  console.log(`🤖 Gemini AI integration active`);
});