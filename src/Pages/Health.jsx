// src/components/HealthAnalysis.jsx
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
  CartesianGrid
} from "recharts";
import {
  Droplet,
  HeartPulse,
  CalendarDays,
  Flame,
  Dumbbell,
  Venus
} from "lucide-react";
import { format, addDays } from "date-fns";

const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];
const SYMPTOMS = ["Cramps", "Headache", "Fatigue", "Mood Swings", "Bloating", "Nausea"];

const HealthAnalysis = () => {
  const [healthData, setHealthData] = useState({
    age: "",
    weight: "",
    height: "",
    waist: "",
    hips: "",
    steps: "",
    water: 0,
    symptoms: [],
    lastPeriod: "",
    cycleLength: "28"
  });

  const [analysis, setAnalysis] = useState({
    bmi: null,
    whr: null,
    nextPeriod: null,
    cycleHistory: [],
    hydration: 0,
    stepsHistory: [],
    symptomFrequency: {}
  });

  const [currentView, setCurrentView] = useState("overview");

  // BMI Calculation
  const calculateBMI = () => {
    const { weight, height } = healthData;
    if (weight && height) {
      const hMeters = height / 100;
      return (weight / (hMeters * hMeters)).toFixed(1);
    }
    return null;
  };

  // WHR Calculation
  const calculateWHR = () => {
    const { waist, hips } = healthData;
    if (waist && hips) return (waist / hips).toFixed(2);
    return null;
  };

  // Update Hydration
  const updateHydration = (amount) => {
    setAnalysis((prev) => ({
      ...prev,
      hydration: Math.min(prev.hydration + amount, 2000)
    }));
  };

  // Toggle Symptoms
  const toggleSymptom = (symptom) => {
    setAnalysis((prev) => ({
      ...prev,
      symptomFrequency: {
        ...prev.symptomFrequency,
        [symptom]: (prev.symptomFrequency[symptom] || 0) + 1
      }
    }));
  };

  // Predict Menstrual Cycle
  const predictCycle = () => {
    const { lastPeriod, cycleLength } = healthData;
    if (lastPeriod && cycleLength) {
      try {
        const nextDate = addDays(new Date(lastPeriod), parseInt(cycleLength));
        return format(nextDate, "MMM do, yyyy");
      } catch {
        return "Invalid date";
      }
    }
    return null;
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setAnalysis({
      ...analysis,
      bmi: calculateBMI(),
      whr: calculateWHR(),
      nextPeriod: predictCycle(),
      stepsHistory: [
        ...analysis.stepsHistory,
        { steps: healthData.steps || 0, date: format(new Date(), "MMM dd") }
      ]
    });
  };

  // Symptom Data for Chart
  const symptomData = Object.entries(analysis.symptomFrequency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700 flex items-center justify-center gap-2">
            <HeartPulse size={32} className="text-purple-700" />
            Women's Health Dashboard
          </h1>
          <p className="text-gray-700">Comprehensive health tracking and analysis</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          {["overview", "cycle", "hydration", "symptoms"].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-4 py-2 rounded-full capitalize transition ${
                currentView === view
                  ? "bg-purple-700 text-white"
                  : "bg-purple-200 text-purple-700 hover:bg-purple-300"
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Body Metrics */}
          {(currentView === "overview" || currentView === "cycle") && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
                <Venus size={20} className="text-purple-700" />
                Body Metrics
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {["Age", "Weight", "Height", "Waist", "Hips", "Steps"].map((label) => (
                    <div key={label}>
                      <label className="block text-sm text-gray-700">{label}</label>
                      <input
                        type="number"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800">
                  Update Metrics
                </button>
              </form>
            </div>
          )}

          {/* Hydration Tracker */}
          {(currentView === "overview" || currentView === "hydration") && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
                <Droplet size={20} className="text-purple-700" />
                Hydration Tracker
              </h2>
              <div className="text-center">
                <p className="text-purple-600 font-bold text-xl">{analysis.hydration}ml / 2000ml</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => updateHydration(amount)}
                    className="bg-purple-100 text-purple-700 p-2 rounded-lg hover:bg-purple-200"
                  >
                    +{amount}ml
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptom Tracker */}
          {(currentView === "overview" || currentView === "symptoms") && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
                <Flame size={20} className="text-purple-700" />
                Symptom Tracker
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className="bg-purple-200 text-purple-700 p-2 rounded-lg hover:bg-purple-300"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysis;
