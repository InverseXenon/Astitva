// src/components/HealthAnalysis.jsx
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Droplet, HeartPulse, CalendarDays, Flame, Dumbbell, Venus } from 'lucide-react';

const HealthAnalysis = () => {
  const [healthData, setHealthData] = useState({
    age: '',
    weight: '',
    height: '',
    waist: '',
    hips: '',
    steps: '',
    water: 0,
    symptoms: [],
    lastPeriod: '',
    cycleLength: ''
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

  const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

  // BMI Calculation
  const calculateBMI = () => {
    const { weight, height } = healthData;
    if (weight && height) {
      const hMeters = height / 100; // assuming height is in cm
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

  // Hydration Tracker update
  const updateHydration = (amount) => {
    setAnalysis(prev => ({
      ...prev,
      hydration: Math.min(prev.hydration + amount, 2000)
    }));
  };

  // Symptom Tracker
  const toggleSymptom = (symptom) => {
    setAnalysis(prev => {
      const frequency = { ...prev.symptomFrequency };
      frequency[symptom] = (frequency[symptom] || 0) + 1;
      return { ...prev, symptomFrequency: frequency };
    });
  };

  // Menstrual Cycle Prediction
  const predictCycle = () => {
    const { lastPeriod, cycleLength } = healthData;
    if (lastPeriod && cycleLength) {
      const nextDate = new Date(lastPeriod);
      nextDate.setDate(nextDate.getDate() + parseInt(cycleLength));
      return nextDate.toLocaleDateString();
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnalysis({
      ...analysis,
      bmi: calculateBMI(),
      whr: calculateWHR(),
      nextPeriod: predictCycle(),
      stepsHistory: [...analysis.stepsHistory, { steps: healthData.steps, date: new Date().toLocaleDateString() }]
    });
  };

  const symptomData = Object.entries(analysis.symptomFrequency).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-600 mb-4 flex items-center justify-center gap-2">
            <HeartPulse size={40} /> Health & Wellness Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Comprehensive health tracking and analysis platform</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Body Analysis (BMI, WHR) */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <Venus size={24} /> Body Analysis
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Age"
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                  value={healthData.age}
                  onChange={(e) => setHealthData({...healthData, age: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                  value={healthData.weight}
                  onChange={(e) => setHealthData({...healthData, weight: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Height (cm)"
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                  value={healthData.height}
                  onChange={(e) => setHealthData({...healthData, height: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Waist (cm)"
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                  value={healthData.waist}
                  onChange={(e) => setHealthData({...healthData, waist: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Hips (cm)"
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                  value={healthData.hips}
                  onChange={(e) => setHealthData({...healthData, hips: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Daily Steps"
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                  value={healthData.steps}
                  onChange={(e) => setHealthData({...healthData, steps: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all"
              >
                Analyze
              </button>
            </form>
            {analysis.bmi && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                  <span>BMI:</span>
                  <span className="font-bold text-purple-600">{analysis.bmi}</span>
                </div>
                <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                  <span>WHR:</span>
                  <span className="font-bold text-purple-600">{analysis.whr}</span>
                </div>
              </div>
            )}
          </div>

          {/* Menstrual Cycle Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <CalendarDays size={24} /> Cycle Tracker
            </h2>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                value={healthData.lastPeriod}
                onChange={(e) => setHealthData({...healthData, lastPeriod: e.target.value})}
              />
              <input
                type="number"
                placeholder="Cycle Length (days)"
                className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                value={healthData.cycleLength}
                onChange={(e) => setHealthData({...healthData, cycleLength: e.target.value})}
              />
              {analysis.nextPeriod && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-600 font-semibold">
                    Next predicted cycle: {analysis.nextPeriod}
                  </p>
                </div>
              )}
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.cycleHistory}>
                    <Line
                      type="monotone"
                      dataKey="length"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Hydration Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <Droplet size={24} /> Hydration
            </h2>
            <div className="text-center mb-4">
              <div className="radial-progress text-purple-600 mx-auto"
                   style={{"--value": (analysis.hydration/2000)*100}}>
                {analysis.hydration}ml
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => updateHydration(amount)}
                  className="bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  +{amount}ml
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <Flame size={24} /> Symptom Tracker
            </h2>
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={symptomData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {symptomData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Cramps', 'Headache', 'Fatigue', 'Mood Swings'].map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className="flex items-center justify-center gap-2 bg-purple-50 p-2 rounded-lg hover:bg-purple-100"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <Dumbbell size={24} /> Activity
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.stepsHistory}>
                  <Bar dataKey="steps" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Trends */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Health Trends</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysis.stepsHistory}>
                  <Line
                    type="monotone"
                    dataKey="steps"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysis;