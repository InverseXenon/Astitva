import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart
} from "recharts";
import {
  HeartPulse,
  CalendarDays,
  Venus,
  AlertTriangle,
  Shield,
  Droplet,
  Zap,
  Thermometer,
  Activity,
  Pill,
  Soup,
  Dumbbell,
  MessageCircle,
  FileText,
  Bell,
  Stethoscope,
  Plus,
  Minus,
  CheckCircle,
  TrendingUp,
  Moon,
  Sun,
  Target,
  Award,
  Book,
  MapPin,
  Phone,
  Clock,
  Star
} from "lucide-react";

const HealthAnalysis = () => {
  const [healthData, setHealthData] = useState({
    lastPeriod: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    symptoms: {
      cramps: 3,
      bloating: 2,
      headache: 1,
      fatigue: 2,
      moodSwings: 3
    },
    pcodFactors: {
      irregularCycles: false,
      hairGrowth: false,
      weightGain: false,
      acne: false
    },
    mentalHealth: {
      stress: 4,
      sleep: 7,
      mood: 3,
      anxiety: 2
    },
    hydration: 1200,
    medications: [
      { id: 1, name: "Multivitamin", time: "08:00", taken: false, dosage: "1 tablet" },
      { id: 2, name: "Iron Supplement", time: "14:00", taken: false, dosage: "1 capsule" },
      { id: 3, name: "Omega-3", time: "20:00", taken: true, dosage: "2 capsules" }
    ],
    nutrition: {
      water: 1200,
      calories: 1800,
      protein: 45,
      carbs: 225,
      fat: 60,
      fiber: 25
    },
    fitness: {
      steps: 6500,
      exercise: 45,
      activeMinutes: 30,
      caloriesBurned: 320
    },
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
      weight: 58.5
    },
    communityPosts: [
      { id: 1, user: "Sarah", text: "Great tips for managing cramps! 💪" },
      { id: 2, user: "Priya", text: "Anyone tried yoga for PCOD?" }
    ]
  });

  const [analysis, setAnalysis] = useState({
    bmi: 22.5,
    whr: 0.72,
    fertilityWindow: "Day 10-15",
    pcodRisk: 35,
    healthScore: 85,
    cycleHistory: [
      { day: 1, fertility: 2, phase: "Menstrual", mood: 6 },
      { day: 5, fertility: 4, phase: "Follicular", mood: 7 },
      { day: 14, fertility: 9, phase: "Ovulation", mood: 8 },
      { day: 22, fertility: 5, phase: "Luteal", mood: 5 }
    ],
    weeklyProgress: [
      { week: "Week 1", hydration: 85, exercise: 70, nutrition: 80, sleep: 75 },
      { week: "Week 2", hydration: 90, exercise: 85, nutrition: 75, sleep: 80 },
      { week: "Week 3", hydration: 95, exercise: 90, nutrition: 85, sleep: 85 },
      { week: "Week 4", hydration: 88, exercise: 75, nutrition: 90, sleep: 78 }
    ],
    nearbyResources: [
      { name: "Women's Clinic", distance: "1.2km", type: "medical" },
      { name: "24/7 Pharmacy", distance: "0.8km", type: "pharmacy" }
    ],
    ovulationCalendar: [
      { date: "2024-03-01", fertile: false },
      { date: "2024-03-10", fertile: true },
      { date: "2024-03-14", fertile: true }
    ],
    healthReports: [
      { month: "February", summary: "Regular cycles, improved sleep" }
    ]
  });

  const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];

  useEffect(() => {
    const calculateMetrics = () => {
      const pcodRisk = Math.min(
        Object.values(healthData.pcodFactors).filter(Boolean).length * 20 +
        (healthData.mentalHealth.stress > 5 ? 15 : 0),
        100
      );
      
      const healthScore = Math.round(
        (healthData.hydration / 2000 * 20) +
        (healthData.fitness.steps / 10000 * 20) +
        (healthData.mentalHealth.sleep / 10 * 20) +
        (1 - healthData.mentalHealth.stress / 10) * 20 +
        (healthData.medications.filter(m => m.taken).length / healthData.medications.length * 20)
      );
      
      setAnalysis(prev => ({ ...prev, pcodRisk, healthScore }));
    };
    calculateMetrics();
  }, [healthData]);

  const togglePCODFactor = (factor) => {
    setHealthData(prev => ({
      ...prev,
      pcodFactors: {
        ...prev.pcodFactors,
        [factor]: !prev.pcodFactors[factor]
      }
    }));
  };

  const updateHydration = (amount) => {
    setHealthData(prev => ({
      ...prev,
      hydration: Math.min(Math.max(prev.hydration + amount, 0), 3000)
    }));
  };

  const toggleMedication = (id) => {
    setHealthData(prev => ({
      ...prev,
      medications: prev.medications.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    }));
  };

  const _updateNutrition = (type, amount) => {
    setHealthData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [type]: Math.max(0, prev.nutrition[type] + amount)
      }
    }));
  };

  const updateFitness = (type, amount) => {
    setHealthData(prev => ({
      ...prev,
      fitness: {
        ...prev.fitness,
        [type]: Math.max(0, prev.fitness[type] + amount)
      }
    }));
  };

  const generateHealthReport = () => {
    const pdfContent = `
      Monthly Health Report:
      - Average Cycle Length: ${healthData.cycleLength} days
      - PCOD Risk Factor: ${analysis.pcodRisk}%
      - Hydration Achievement: ${(healthData.hydration / 2000 * 100).toFixed(0)}%
    `;
    alert('Downloading health report:\n' + pdfContent);
  };

  const _sendSafetyAlert = () => {
    alert('Emergency alert sent to trusted contacts and local authorities!');
  };

  const HealthScoreCard = () => (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Health Score</h2>
          <p className="text-purple-100">Overall wellness rating</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{analysis.healthScore}</div>
          <div className="text-purple-200 text-sm">out of 100</div>
        </div>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3">
        <div 
          className="bg-white h-3 rounded-full transition-all duration-500"
          style={{ width: `${analysis.healthScore}%` }}
        ></div>
      </div>
      <div className="flex items-center mt-4 text-purple-100">
        <TrendingUp className="w-4 h-4 mr-2" />
        <span className="text-sm">+5 points from last week</span>
      </div>
    </div>
  );

  const VitalsCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <HeartPulse className="text-red-500" size={24} /> 
        Vital Signs
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{healthData.vitals.heartRate}</div>
          <div className="text-red-500 text-sm">Heart Rate (bpm)</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{healthData.vitals.bloodPressure}</div>
          <div className="text-blue-500 text-sm">Blood Pressure</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{healthData.vitals.temperature}°F</div>
          <div className="text-orange-500 text-sm">Temperature</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{healthData.vitals.weight}kg</div>
          <div className="text-green-500 text-sm">Weight</div>
        </div>
      </div>
    </div>
  );

  const HydrationTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Droplet className="text-blue-500" size={24} /> 
        Hydration Tracker
      </h2>
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {healthData.hydration}ml
        </div>
        <div className="text-gray-500">Goal: 2000ml</div>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((healthData.hydration / 2000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => updateHydration(250)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          250ml
        </button>
        <button
          onClick={() => updateHydration(500)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          500ml
        </button>
      </div>
    </div>
  );

  const MedicationTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Pill className="text-purple-500" size={24} /> 
        Medication Tracker
      </h2>
      <div className="space-y-4">
        {healthData.medications.map(med => (
          <div key={med.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleMedication(med.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  med.taken 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {med.taken && <CheckCircle size={16} />}
              </button>
              <div>
                <div className="font-medium text-gray-900">{med.name}</div>
                <div className="text-sm text-gray-500">{med.dosage} • {med.time}</div>
              </div>
            </div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        {healthData.medications.filter(m => m.taken).length} of {healthData.medications.length} medications taken today
      </div>
    </div>
  );

  const FitnessTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Dumbbell className="text-orange-500" size={24} /> 
        Fitness Tracker
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{healthData.fitness.steps.toLocaleString()}</div>
          <div className="text-orange-500 text-sm">Steps</div>
          <div className="text-xs text-gray-500 mt-1">Goal: 10,000</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{healthData.fitness.exercise}</div>
          <div className="text-green-500 text-sm">Exercise (min)</div>
          <div className="text-xs text-gray-500 mt-1">Goal: 60</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{healthData.fitness.activeMinutes}</div>
          <div className="text-purple-500 text-sm">Active Minutes</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{healthData.fitness.caloriesBurned}</div>
          <div className="text-red-500 text-sm">Calories Burned</div>
        </div>
      </div>
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => updateFitness('steps', 1000)}
          className="flex items-center bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
        >
          <Plus size={14} className="mr-1" />
          1K Steps
        </button>
        <button
          onClick={() => updateFitness('exercise', 15)}
          className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          <Plus size={14} className="mr-1" />
          15min
        </button>
      </div>
    </div>
  );

  const CycleTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Venus className="text-pink-500" size={24} /> 
        Menstrual Cycle
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-pink-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-pink-600">{healthData.cycleLength}</div>
          <div className="text-pink-500 text-sm">Cycle Length (days)</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-600">{analysis.fertilityWindow}</div>
          <div className="text-purple-500 text-sm">Fertility Window</div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Cycle Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={analysis.cycleHistory}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="fertility" stroke="#EC4899" fill="#FDF2F8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const ProgressChart = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="text-blue-500" size={24} /> 
        Weekly Progress
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analysis.weeklyProgress}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hydration" fill="#3B82F6" />
          <Bar dataKey="exercise" fill="#10B981" />
          <Bar dataKey="nutrition" fill="#F59E0B" />
          <Bar dataKey="sleep" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const CommunitySupport = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <MessageCircle size={24} /> Community Support
      </h2>
      <div className="space-y-4">
        {healthData.communityPosts.map(post => (
          <div key={post.id} className="bg-purple-50 p-3 rounded-lg">
            <p className="font-medium text-purple-600">{post.user}</p>
            <p className="text-gray-600">{post.text}</p>
          </div>
        ))}
        <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
          Join Discussion
        </button>
      </div>
    </div>
  );

  const HealthReports = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <FileText size={24} /> Health Reports
      </h2>
      <div className="space-y-3">
        {analysis.healthReports.map(report => (
          <div key={report.month} className="bg-purple-50 p-3 rounded-lg">
            <p className="font-medium text-purple-600">{report.month}</p>
            <p className="text-gray-600 text-sm">{report.summary}</p>
          </div>
        ))}
        <button
          onClick={generateHealthReport}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          Generate Monthly Report
        </button>
      </div>
    </div>
  );

  const SymptomTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <Thermometer size={24} /> Symptom Intensity
      </h2>
      <div className="h-48">
        <ResponsiveContainer>
          <BarChart data={Object.entries(healthData.symptoms).map(([name, value]) => ({ name, value }))}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const OvulationCalendar = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <CalendarDays size={24} /> Ovulation Calendar
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {analysis.ovulationCalendar.map((day, index) => (
          <div key={index} className={`p-2 rounded-lg text-center text-sm ${
            day.fertile ? 'bg-green-100 text-green-600' : 'bg-purple-50 text-purple-600'
          }`}>
            <p>{new Date(day.date).getDate()}</p>
            <p className="text-xs">{day.fertile ? 'Fertile' : 'Normal'}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <HeartPulse className="w-5 h-5 mr-2" />
              <span className="font-medium">AI-Powered Health Insights</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Health, Your Journey
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Comprehensive health tracking designed for women. Monitor your menstrual cycle, 
              track vital signs, manage medications, and achieve your wellness goals.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Health Score and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <HealthScoreCard />
          <VitalsCard />
          <HydrationTracker />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          <MedicationTracker />
          <FitnessTracker />
          <CycleTracker />
        </div>

        {/* Progress Chart */}
        <div className="mb-12">
          <ProgressChart />
        </div>

        {/* PCOD Risk Assessment */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={24} /> 
            PCOD Risk Assessment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Risk Level</span>
                  <span className="font-bold text-lg">{analysis.pcodRisk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      analysis.pcodRisk < 30 ? 'bg-green-500' :
                      analysis.pcodRisk < 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${analysis.pcodRisk}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(healthData.pcodFactors).map(([factor, checked]) => (
                  <label key={factor} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePCODFactor(factor)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700 capitalize">
                      {factor.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-3">Recommendations</h3>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Maintain regular exercise routine</li>
                <li>• Follow balanced diet with low refined carbs</li>
                <li>• Monitor weight and stress levels</li>
                <li>• Consider consulting a gynecologist</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="text-green-500" size={24} /> 
              Emergency Services
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency SOS
              </button>
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                <MapPin className="w-5 h-5 mr-2" />
                Nearby Hospitals
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="text-blue-500" size={24} /> 
              Health Reports
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2" />
                Generate Monthly Report
              </button>
              <button className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center">
                <Book className="w-5 h-5 mr-2" />
                Health Tips & Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysis;