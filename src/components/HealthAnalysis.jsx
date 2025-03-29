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
  YAxis
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
  Stethoscope
} from "lucide-react";

const HealthAnalysis = () => {
  const [healthData, setHealthData] = useState({
    lastPeriod: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    symptoms: {
      cramps: 3,
      bloating: 2,
      headache: 1
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
      mood: 3
    },
    hydration: 1200,
    medications: [
      { id: 1, name: "Multivitamin", time: "08:00", taken: false },
      { id: 2, name: "Iron Supplement", time: "14:00", taken: false }
    ],
    nutrition: {
      water: 1200,
      calories: 1800,
      protein: 45
    },
    fitness: {
      steps: 6500,
      exercise: 45
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
    cycleHistory: [
      { day: 1, fertility: 2, phase: "Menstrual" },
      { day: 5, fertility: 4, phase: "Follicular" },
      { day: 14, fertility: 9, phase: "Ovulation" },
      { day: 22, fertility: 5, phase: "Luteal" }
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

  const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981"];

  useEffect(() => {
    const calculateMetrics = () => {
      const pcodRisk = Math.min(
        Object.values(healthData.pcodFactors).filter(Boolean).length * 20 +
        (healthData.mentalHealth.stress > 5 ? 15 : 0),
        100
      );
      setAnalysis(prev => ({ ...prev, pcodRisk }));
    };
    calculateMetrics();
  }, [healthData]);

  // Existing handlers
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
      hydration: Math.min(prev.hydration + amount, 2000)
    }));
  };

  // New handlers
  const toggleMedication = (id) => {
    setHealthData(prev => ({
      ...prev,
      medications: prev.medications.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    }));
  };

  const updateNutrition = (type, amount) => {
    setHealthData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [type]: Math.max(0, prev.nutrition[type] + amount)
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

  const sendSafetyAlert = () => {
    alert('Emergency alert sent to trusted contacts and local authorities!');
  };

  // New Components
  const MedicationTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <Pill size={24} /> Medication Tracker
      </h2>
      <div className="space-y-3">
        {healthData.medications.map(med => (
          <div key={med.id} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
            <div>
              <span className="font-medium">{med.name}</span>
              <span className="text-sm text-purple-600 ml-2">{med.time}</span>
            </div>
            <button
              onClick={() => toggleMedication(med.id)}
              className={`p-1 rounded-full w-6 h-6 ${med.taken ? 'bg-green-500' : 'bg-gray-200'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const NutritionTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <Soup size={24} /> Nutrition Tracker
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <p className="text-xs text-purple-500">Water (ml)</p>
          <div className="text-xl font-bold text-purple-600 flex items-center justify-center gap-2">
            {healthData.nutrition.water}
            <button
              onClick={() => updateNutrition('water', 250)}
              className="text-sm bg-purple-600 text-white px-2 rounded hover:bg-purple-700"
            >
              +250
            </button>
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <p className="text-xs text-purple-500">Calories</p>
          <div className="text-xl font-bold text-purple-600">{healthData.nutrition.calories}</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <p className="text-xs text-purple-500">Protein (g)</p>
          <div className="text-xl font-bold text-purple-600">{healthData.nutrition.protein}</div>
        </div>
      </div>
    </div>
  );

  const FitnessTracker = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
        <Dumbbell size={24} /> Fitness Tracker
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 p-4 rounded-xl">
          <p className="text-xs text-purple-500">Steps Today</p>
          <div className="text-2xl font-bold text-purple-600">
            {healthData.fitness.steps.toLocaleString()}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <p className="text-xs text-purple-500">Exercise (min)</p>
          <div className="text-2xl font-bold text-purple-600">
            {healthData.fitness.exercise}
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 p-6">
      <button
        className="fixed top-[5.5rem] right-8 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 transition-transform hover:scale-105"
        onClick={sendSafetyAlert}
      >
        <AlertTriangle size={20} />
        <span className="hidden sm:inline">Emergency SOS</span>
      </button>

      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 flex items-center justify-center gap-2">
            <Venus size={32} /> Astitva Health Companion
          </h1>
          <p className="text-gray-600 mt-2">Integrated Women's Health Management</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <CalendarDays size={24} /> Cycle Tracker
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-xs text-purple-500 mb-1">Current Phase</p>
                <p className="font-bold text-purple-600">Follicular</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-xs text-purple-500 mb-1">Fertility Window</p>
                <p className="font-bold text-purple-600">{analysis.fertilityWindow}</p>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer>
                <LineChart data={analysis.cycleHistory}>
                  <XAxis dataKey="day" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="fertility"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#EC4899" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <Activity size={24} /> PCOD Monitor
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="radial-progress text-purple-600" 
                   style={{ "--value": analysis.pcodRisk, "--size": "6rem" }}>
                {analysis.pcodRisk}%
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(healthData.pcodFactors).map(([factor, status]) => (
                    <button
                      key={factor}
                      onClick={() => togglePCODFactor(factor)}
                      className={`p-2 rounded-lg text-sm ${
                        status ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {factor.replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-sm text-purple-600">
                {analysis.pcodRisk > 50 
                  ? "Consult a specialist for comprehensive care"
                  : "Maintain healthy lifestyle habits"}
              </p>
            </div>
          </div>

          <MedicationTracker />
          <NutritionTracker />
          <FitnessTracker />
          <CommunitySupport />
          <HealthReports />
          <SymptomTracker />
          <OvulationCalendar />

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <Shield size={24} /> Health & Safety
            </h2>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-purple-600 mb-2">Nearby Resources</h3>
                <div className="space-y-2">
                  {analysis.nearbyResources.map((resource, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-purple-100 rounded-lg">
                      <span>{resource.name}</span>
                      <span className="text-purple-600 text-sm">{resource.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-red-600 mb-2">Quick Safety Tips</h3>
                <ul className="list-disc pl-5 text-red-500 text-sm space-y-2">
                  <li>Emergency SOS: Shake phone 3 times</li>
                  <li>Nearest police station: 1.5km</li>
                  <li>24/7 helpline: 112</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysis;