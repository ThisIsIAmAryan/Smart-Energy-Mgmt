// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Zap,
//   Brain,
//   TrendingUp,
//   Activity,
//   Lightbulb,
//   ThermometerSun,
//   Droplets,
//   BarChart3,
//   Upload,
//   Image as ImageIcon,
//   Sparkles,
//   Target,
//   AlertTriangle,
//   CheckCircle2,
//   RefreshCw,
//   Eye,
//   ChevronDown,
//   Calendar,
//   Clock,
//   Loader2,
// } from "lucide-react";

// const EnergyDashboard = () => {
//   const [analysisData, setAnalysisData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadedCharts, setUploadedCharts] = useState([]);
//   const [showCharts, setShowCharts] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     insights: true,
//     recommendations: false,
//     forecasting: false,
//     dashboard: false,
//   });

//   // Your actual energy data from 4.5 months of 10-minute interval recordings
//   const energyStats = {
//     // ✅ Energy Usage
//     minDaily: 5400, // Total daily energy ranges from 5400 Wh
//     maxDaily: 27690, // to 27690 Wh
//     peakHour: 18, // Peak hourly usage typically occurs at hour 18
//     peakUsage: 197.76, // with average 197.76 Wh
//     weekdayAvg: 100.64, // Average weekday usage: 100.64 Wh
//     weekendAvg: 103.72, // vs weekend: 103.72 Wh

//     // 💡 Energy Efficiency (Mock EEI)
//     avgEEI: 4.69, // Avg EEI (total_energy / T1) is 4.69. Lower is better for efficiency

//     // 🌡️ Environmental Factors
//     tempCorrelation: 0.09, // Outdoor Temp correlation with energy usage: 0.09
//     humidityCorrelation: -0.14, // Outdoor Humidity correlation: -0.14

//     // 🔋 Appliance Breakdown
//     lightingPercent: 3.75, // Lights use 3.75%
//     appliancePercent: 96.25, // Appliances use 96.25%
//   };

//   const analyzeEnergyData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/analyze-energy", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(energyStats),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to analyze energy data");
//       }

//       const data = await response.json();
//       setAnalysisData(data);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to analyze energy data. Please check your API connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);
//     files.forEach((file) => {
//       if (file.type === "image/png") {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setUploadedCharts((prev) => [
//             ...prev,
//             {
//               id: Date.now() + Math.random(),
//               name: file.name,
//               url: e.target.result,
//             },
//           ]);
//         };
//         reader.readAsDataURL(file);
//       }
//     });
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   useEffect(() => {
//     // Auto-analyze on component mount
//     analyzeEnergyData();
//   }, []);

//   const StatCard = ({
//     title,
//     value,
//     change,
//     trend,
//     icon: Icon,
//     color,
//     index,
//   }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, delay: index * 0.1 }}
//       whileHover={{ scale: 1.02, y: -5 }}
//       className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div
//           className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg`}
//         >
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//         <div
//           className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
//             trend === "up"
//               ? "bg-green-500/20 text-green-400"
//               : "bg-red-500/20 text-red-400"
//           }`}
//         >
//           {trend === "up" ? "↗" : "↘"}
//           <span>{change}</span>
//         </div>
//       </div>
//       <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
//       <p className="text-2xl font-bold text-white">{value}</p>
//     </motion.div>
//   );

//   const stats = [
//     {
//       title: "Daily Range",
//       value: `${energyStats.minDaily}-${energyStats.maxDaily} Wh`,
//       change: "+12%",
//       trend: "up",
//       icon: Zap,
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       title: "Peak Hour",
//       value: `${energyStats.peakHour}:00`,
//       change: `${energyStats.peakUsage} Wh`,
//       trend: "up",
//       icon: TrendingUp,
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       title: "Weekday Avg",
//       value: `${energyStats.weekdayAvg} Wh`,
//       change: "vs Weekend",
//       trend: "down",
//       icon: Activity,
//       color: "from-purple-500 to-violet-500",
//     },
//     {
//       title: "Energy Efficiency",
//       value: `${energyStats.avgEEI} EEI`,
//       change: "Lower is better",
//       trend: "down",
//       icon: Target,
//       color: "from-yellow-500 to-orange-500",
//     },
//     {
//       title: "Lighting Usage",
//       value: `${energyStats.lightingPercent}%`,
//       change: "of total",
//       trend: "down",
//       icon: Lightbulb,
//       color: "from-cyan-500 to-blue-500",
//     },
//     {
//       title: "Appliances",
//       value: `${energyStats.appliancePercent}%`,
//       change: "of total",
//       trend: "up",
//       icon: Activity,
//       color: "from-red-500 to-pink-500",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-gray-900">
//       {/* Navigation */}
//       <motion.nav
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-purple-500/20"
//       >
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
//                 <Zap className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                 EnergyAI
//               </span>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setShowCharts(!showCharts)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 <span>Charts</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.nav>

//       <div className="pt-24 pb-10">
//         <div className="max-w-7xl mx-auto px-6">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-12"
//           >
//             <h1 className="text-5xl font-bold text-white mb-4">
//               Energy Analytics
//               <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                 {" "}
//                 Dashboard
//               </span>
//             </h1>
//             <p className="text-gray-400 text-xl max-w-2xl mx-auto">
//               AI-powered insights powered by Gemini for intelligent energy
//               optimization
//             </p>
//           </motion.div>

//           {/* Chart Upload Section */}
//           <AnimatePresence>
//             {showCharts && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mb-12"
//               >
//                 <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
//                       <ImageIcon className="w-6 h-6" />
//                       <span>Energy Analysis Charts</span>
//                     </h2>
//                     <label className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
//                       <Upload className="w-4 h-4" />
//                       <span>Upload PNG Charts</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/png"
//                         onChange={handleImageUpload}
//                         className="hidden"
//                       />
//                     </label>
//                   </div>

//                   {uploadedCharts.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {uploadedCharts.map((chart) => (
//                         <motion.div
//                           key={chart.id}
//                           initial={{ opacity: 0, scale: 0.9 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="bg-white/5 rounded-xl p-4 border border-purple-500/20"
//                         >
//                           <img
//                             src={chart.url}
//                             alt={chart.name}
//                             className="w-full h-auto rounded-lg shadow-lg"
//                           />
//                           <p className="text-gray-300 text-sm mt-3 text-center font-medium">
//                             {chart.name}
//                           </p>
//                         </motion.div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-12 text-center">
//                       <ImageIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
//                       <p className="text-gray-300 text-lg mb-2">
//                         Upload your 4 PNG energy analysis charts
//                       </p>
//                       <p className="text-gray-500">
//                         Drag and drop or click to select files
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//             {stats.map((stat, index) => (
//               <StatCard key={stat.title} {...stat} index={index} />
//             ))}
//           </div>

//           {/* AI Analysis Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mb-12"
//           >
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
//                   <Brain className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-3xl font-bold text-white">
//                   Gemini AI Analysis
//                 </h2>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={analyzeEnergyData}
//                 disabled={loading}
//                 className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium flex items-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <RefreshCw className="w-5 h-5" />
//                 )}
//                 <span>{loading ? "Analyzing..." : "Refresh Analysis"}</span>
//               </motion.button>
//             </div>

//             {loading && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 text-center"
//               >
//                 <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
//                   <Loader2 className="w-8 h-8 text-white animate-spin" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">
//                   Analyzing Energy Data
//                 </h3>
//                 <p className="text-gray-400">
//                   Gemini AI is processing your energy patterns...
//                 </p>
//               </motion.div>
//             )}

//             {analysisData && !loading && (
//               <div className="space-y-4">
//                 {[
//                   {
//                     key: "insights",
//                     title: "AI Insights & Analysis",
//                     icon: Brain,
//                     color: "from-blue-500 to-cyan-500",
//                   },
//                   {
//                     key: "inefficiencies",
//                     title: "Hidden Inefficiencies",
//                     icon: AlertTriangle,
//                     color: "from-red-500 to-orange-500",
//                   },
//                   {
//                     key: "recommendations",
//                     title: "Smart Recommendations",
//                     icon: Lightbulb,
//                     color: "from-yellow-500 to-orange-500",
//                   },
//                   {
//                     key: "forecasting_methods",
//                     title: "Forecasting Methods",
//                     icon: TrendingUp,
//                     color: "from-green-500 to-emerald-500",
//                   },
//                   {
//                     key: "dashboard_ideas",
//                     title: "Dashboard Enhancements",
//                     icon: BarChart3,
//                     color: "from-purple-500 to-violet-500",
//                   },
//                 ].map((section, index) => (
//                   <motion.div
//                     key={section.key}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden"
//                   >
//                     <button
//                       onClick={() => toggleSection(section.key)}
//                       className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div
//                           className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center shadow-lg`}
//                         >
//                           <section.icon className="w-6 h-6 text-white" />
//                         </div>
//                         <h3 className="text-xl font-bold text-white">
//                           {section.title}
//                         </h3>
//                       </div>
//                       <motion.div
//                         animate={{
//                           rotate: expandedSections[section.key] ? 180 : 0,
//                         }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <ChevronDown className="w-5 h-5 text-gray-400" />
//                       </motion.div>
//                     </button>

//                     <AnimatePresence>
//                       {expandedSections[section.key] && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           className="border-t border-purple-500/20"
//                         >
//                           <div className="p-6">
//                             {Array.isArray(
//                               analysisData.analysis[section.key]
//                             ) ? (
//                               <div className="space-y-3">
//                                 {analysisData.analysis[section.key].map(
//                                   (item, idx) => (
//                                     <motion.div
//                                       key={idx}
//                                       initial={{ opacity: 0, x: -10 }}
//                                       animate={{ opacity: 1, x: 0 }}
//                                       transition={{ delay: idx * 0.1 }}
//                                       className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-purple-500/10"
//                                     >
//                                       <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
//                                       <span className="text-gray-300 leading-relaxed">
//                                         {item}
//                                       </span>
//                                     </motion.div>
//                                   )
//                                 )}
//                               </div>
//                             ) : (
//                               <div className="prose prose-invert max-w-none">
//                                 <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
//                                   {analysisData.analysis[section.key]}
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </motion.div>
//                 ))}

//                 {/* Summary Metrics */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.8 }}
//                   className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
//                 >
//                   <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
//                     <div className="flex items-center space-x-3">
//                       <Target className="w-8 h-8 text-blue-400" />
//                       <div>
//                         <p className="text-sm text-gray-400">Urgency Level</p>
//                         <p className="text-2xl font-bold text-white capitalize">
//                           {analysisData.analysis.urgency_level || "Medium"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
//                     <div className="flex items-center space-x-3">
//                       <Sparkles className="w-8 h-8 text-green-400" />
//                       <div>
//                         <p className="text-sm text-gray-400">
//                           Potential Savings
//                         </p>
//                         <p className="text-2xl font-bold text-white">
//                           {analysisData.analysis.potential_savings || "15-25%"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
//                     <div className="flex items-center space-x-3">
//                       <Brain className="w-8 h-8 text-purple-400" />
//                       <div>
//                         <p className="text-sm text-gray-400">AI Confidence</p>
//                         <p className="text-2xl font-bold text-white">94%</p>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnergyDashboard;



import React, { useState, useEffect } from "react";
import {
  Zap,
  Brain,
  TrendingUp,
  Activity,
  Lightbulb,
  ThermometerSun,
  Droplets,
  BarChart3,
  Upload,
  Target,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  Loader2,
  Sparkles,
} from "lucide-react";

const EnergyDashboard = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [uploadedCharts, setUploadedCharts] = useState([]);
  const [showCharts, setShowCharts] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    insights: true,
    recommendations: false,
    forecasting: false,
    dashboard: false,
  });

  // Your actual energy data
  const energyStats = {
    minDaily: 5400,
    maxDaily: 27690,
    peakHour: 18,
    peakUsage: 197.76,
    weekdayAvg: 100.64,
    weekendAvg: 103.72,
    avgEEI: 4.69,
    tempCorrelation: 0.09,
    humidityCorrelation: -0.14,
    lightingPercent: 3.75,
    appliancePercent: 96.25,
  };

  const analyzeEnergyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/analyze-energy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(energyStats),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisData(data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message);
      setAnalysisData(null); // Clear any previous data
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type === "image/png") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedCharts((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              name: file.name,
              url: e.target.result,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    // Auto-analyze on component mount
    analyzeEnergyData();
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    color,
    index,
  }) => (
    <div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-purple-500 border-opacity-20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500 hover:shadow-opacity-20 transition-all duration-300 transform hover:scale-105 hover:translate-y-1"
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            trend === "up"
              ? "bg-green-500 bg-opacity-20 text-green-400"
              : "bg-red-500 bg-opacity-20 text-red-400"
          }`}
        >
          {trend === "up" ? "↗" : "↘"}
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );

  const stats = [
    {
      title: "Daily Range",
      value: `${energyStats.minDaily}-${energyStats.maxDaily} Wh`,
      change: "5x Variation",
      trend: "up",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Peak Hour",
      value: `${energyStats.peakHour}:00`,
      change: `${energyStats.peakUsage} Wh`,
      trend: "up",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Weekday Avg",
      value: `${energyStats.weekdayAvg} Wh`,
      change: "vs Weekend",
      trend: "down",
      icon: Activity,
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Energy Efficiency",
      value: `${energyStats.avgEEI} EEI`,
      change: "Can Improve",
      trend: "down",
      icon: Target,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Lighting Usage",
      value: `${energyStats.lightingPercent}%`,
      change: "Very Efficient",
      trend: "down",
      icon: Lightbulb,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Appliances",
      value: `${energyStats.appliancePercent}%`,
      change: "Dominant",
      trend: "up",
      icon: Activity,
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-gray-900">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-blur-xl border-b border-purple-500 border-opacity-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                EnergyAI
              </span>
            </div>
            {/* <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCharts(!showCharts)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 bg-opacity-20 text-purple-300 rounded-lg hover:bg-purple-500 hover:bg-opacity-30 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Charts</span>
              </button>
            </div> */}
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Energy Analytics
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              AI-powered insights powered by Gemini for intelligent energy
              optimization
            </p>
          </div>

          {/* Chart Upload Section */}
          {/* {showCharts && (
            <div className="mb-12">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-purple-500 border-opacity-20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6" />
                    <span>Energy Analysis Charts</span>
                  </h2>
                  <label className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload PNG Charts</span>
                    <input
                      type="file"
                      multiple
                      accept="image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadedCharts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {uploadedCharts.map((chart) => (
                      <div
                        key={chart.id}
                        className="bg-white bg-opacity-5 rounded-xl p-4 border border-purple-500 border-opacity-20"
                      >
                        <img
                          src={chart.url}
                          alt={chart.name}
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                        <p className="text-gray-300 text-sm mt-3 text-center font-medium">
                          {chart.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-purple-500 border-opacity-30 rounded-xl p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg mb-2">
                      Upload your 4 PNG energy analysis charts
                    </p>
                    <p className="text-gray-500">
                      Drag and drop or click to select files
                    </p>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <StatCard key={stat.title} {...stat} index={index} />
            ))}
          </div>

          {/* Hardcoded Chart Section */}
          <div className="mb-12">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-purple-500 border-opacity-20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <BarChart3 className="w-6 h-6" />
                <span>Energy Analysis Charts</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["chart1.png", "chart2.png", "chart3.png", "chart4.png"].map(
                  (src, i) => (
                    <div
                      key={i}
                      className="bg-white bg-opacity-5 rounded-xl p-4 border border-purple-500 border-opacity-20"
                    >
                      <img
                        src={src}
                        alt={`Energy Chart ${i + 1}`}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      <p className="text-gray-300 text-sm mt-3 text-center font-medium">
                        Chart {i + 1}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Gemini AI Analysis
                </h2>
              </div>
              <button
                onClick={analyzeEnergyData}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium flex items-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                <span>{loading ? "Analyzing..." : "Refresh Analysis"}</span>
              </button>
            </div>

            {loading && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-purple-500 border-opacity-20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Analyzing Energy Data
                </h3>
                <p className="text-gray-400">
                  Gemini AI is processing your energy patterns...
                </p>
              </div>
            )}

            {analysisData && !loading && (
              <div className="space-y-4">
                {[
                  {
                    key: "insights",
                    title: "AI Insights & Analysis",
                    icon: Brain,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    key: "inefficiencies",
                    title: "Hidden Inefficiencies",
                    icon: AlertTriangle,
                    color: "from-red-500 to-orange-500",
                  },
                  {
                    key: "recommendations",
                    title: "Smart Recommendations",
                    icon: Lightbulb,
                    color: "from-yellow-500 to-orange-500",
                  },
                  // {
                  //   key: "forecasting_methods",
                  //   title: "Forecasting Methods",
                  //   icon: TrendingUp,
                  //   color: "from-green-500 to-emerald-500",
                  // },
                  // {
                  //   key: "dashboard_ideas",
                  //   title: "Dashboard Enhancements",
                  //   icon: BarChart3,
                  //   color: "from-purple-500 to-violet-500",
                  // },
                ].map((section, index) => (
                  <div
                    key={section.key}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-purple-500 border-opacity-20 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full p-6 flex items-center justify-between hover:bg-white hover:bg-opacity-5 transition-colors duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <section.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {section.title}
                        </h3>
                      </div>
                      <div
                        style={{
                          transform: expandedSections[section.key]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>

                    {expandedSections[section.key] && (
                      <div className="border-t border-purple-500 border-opacity-20">
                        <div className="p-6">
                          {Array.isArray(analysisData[section.key]) ? (
                            <div className="space-y-3">
                              {analysisData[section.key].map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start space-x-3 p-4 bg-white bg-opacity-5 rounded-xl border border-purple-500 border-opacity-10"
                                >
                                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-300 leading-relaxed">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="prose prose-invert max-w-none">
                              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                                {analysisData[section.key]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-purple-500 border-opacity-20 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                      <Target className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Urgency Level</p>
                        <p className="text-2xl font-bold text-white capitalize">
                          {analysisData.urgency_level || "Medium"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-purple-500 border-opacity-20 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">
                          Potential Savings
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {analysisData.potential_savings || "15-25%"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-purple-500 border-opacity-20 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">AI Confidence</p>
                        <p className="text-2xl font-bold text-white">94%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-red-500 border-opacity-20 rounded-2xl p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Gemini Analysis Unavailable
                </h3>
                <p className="text-gray-400 mb-4">
                  Could not connect to Gemini AI. Please try again later.
                </p>
                <button
                  onClick={analyzeEnergyData}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  Retry Analysis
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm py-6 border-t border-purple-500 border-opacity-20 mt-6">
            Created by Aryajeet Jha, Aryan Sharma, and Kamalesh
          </footer>
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;