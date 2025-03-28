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
  Legend
} from "recharts";
import {
  Droplet,
  HeartPulse,
  CalendarDays,
  Flame,
  Dumbbell,
  Venus,
} from "lucide-react";

const HealthAnalysis = () => {
  // Initialize with sample data for better UX
  const [healthData, setHealthData] = useState({
    age: 28,
    weight: 62,
    height: 165,
    waist: 72,
    hips: 98,
    steps: 7500,
    water: 1200,
    lastPeriod: new Date().toISOString().split('T')[0],
    cycleLength: 28
  });

  const [analysis, setAnalysis] = useState({
    bmi: null,
    whr: null,
    nextPeriod: null,
    cycleHistory: [
      { date: '2023-10-01', length: 28 },
      { date: '2023-11-01', length: 29 },
      { date: '2023-12-01', length: 27 }
    ],
    hydration: 1200,
    stepsHistory: [
      { date: 'Mon', steps: 5000 },
      { date: 'Tue', steps: 7500 },
      { date: 'Wed', steps: 6000 },
      { date: 'Thu', steps: 8000 },
      { date: 'Fri', steps: 6500 },
      { date: 'Sat', steps: 9000 },
      { date: 'Sun', steps: 4000 }
    ],
    symptomFrequency: {
      'Cramps': 3,
      'Headache': 2,
      'Fatigue': 5
    }
  });

  const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];
  const symptomsList = ["Cramps", "Headache", "Fatigue", "Mood Swings"];

  // Calculate metrics on component mount and when data changes
  useEffect(() => {
    const bmi = calculateBMI();
    const whr = calculateWHR();
    const nextPeriod = predictCycle();
    
    setAnalysis(prev => ({
      ...prev,
      bmi,
      whr,
      nextPeriod
    }));
  }, [healthData]);

  // BMI Calculation
  const calculateBMI = () => {
    const { weight, height } = healthData;
    if (weight && height) {
      const hMeters = height / 100;
      return (weight / (hMeters * hMeters)).toFixed(1);
    }
    return null;
  };

  // WHR Calculation with health interpretation
  const calculateWHR = () => {
    const { waist, hips } = healthData;
    if (waist && hips) {
      const ratio = (waist / hips).toFixed(2);
      let interpretation = '';
      
      if (ratio < 0.80) interpretation = 'Low risk';
      else if (ratio < 0.85) interpretation = 'Moderate risk';
      else interpretation = 'High risk';
      
      return { ratio, interpretation };
    }
    return null;
  };

  // Hydration Tracker
  const updateHydration = (amount) => {
    const newHydration = Math.min(analysis.hydration + amount, 2000);
    setAnalysis(prev => ({
      ...prev,
      hydration: newHydration
    }));
    setHealthData(prev => ({
      ...prev,
      water: newHydration
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
    const newStepsEntry = {
      steps: healthData.steps,
      date: new Date().toLocaleDateString('en-US', { weekday: 'short' })
    };
    
    setAnalysis(prev => ({
      ...prev,
      stepsHistory: [...prev.stepsHistory.slice(-6), newStepsEntry]
    }));
  };

  const symptomData = Object.entries(analysis.symptomFrequency).map(
    ([name, value]) => ({ name, value })
  );

  // BMI Interpretation
  const getBMIInterpretation = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-3 md:mb-4 flex items-center justify-center gap-2">
            <HeartPulse size={32} className="hidden md:block" /> 
            <span>Health & Wellness Dashboard</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Track and analyze your health metrics in one place
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Body Analysis (BMI, WHR) */}
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-600 mb-3 md:mb-4 flex items-center gap-2">
              <Venus size={20} className="flex-shrink-0" /> Body Analysis
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'age', label: 'Age', unit: 'yrs' },
                  { key: 'weight', label: 'Weight', unit: 'kg' },
                  { key: 'height', label: 'Height', unit: 'cm' },
                  { key: 'waist', label: 'Waist', unit: 'cm' },
                  { key: 'hips', label: 'Hips', unit: 'cm' },
                  { key: 'steps', label: 'Steps', unit: '' }
                ].map(({ key, label, unit }) => (
                  <div key={key} className="space-y-1">
<label className="text-sm text-gray-500">{label} {unit && `(${unit})`}</label>
<input
                      type="number"
                      className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                      value={healthData[key]}
                      onChange={(e) =>
                        setHealthData({ ...healthData, [key]: e.target.value })
                      }
                      min="0"
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all text-sm md:text-base"
              >
                Update Analysis
              </button>
            </form>
            
            {analysis.bmi && (
              <div className="mt-4 md:mt-6 space-y-2">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span>BMI:</span>
                    <span className="font-bold text-purple-600">{analysis.bmi}</span>
                  </div>
                  <div className="text-xs text-purple-500 mt-1">
                    {getBMIInterpretation(analysis.bmi)}
                  </div>
                </div>
                {analysis.whr && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>WHR:</span>
                      <span className="font-bold text-purple-600">{analysis.whr.ratio}</span>
                    </div>
                    <div className="text-xs text-purple-500 mt-1">
                      {analysis.whr.interpretation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menstrual Cycle Tracker */}
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-600 mb-3 md:mb-4 flex items-center gap-2">
              <CalendarDays size={20} className="flex-shrink-0" /> Cycle Tracker
            </h2>
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Last Period</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                  value={healthData.lastPeriod}
                  onChange={(e) =>
                    setHealthData({ ...healthData, lastPeriod: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Cycle Length (days)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                  value={healthData.cycleLength}
                  onChange={(e) =>
                    setHealthData({ ...healthData, cycleLength: e.target.value })
                  }
                  min="20"
                  max="45"
                />
              </div>
              
              {analysis.nextPeriod && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-purple-600 font-semibold text-sm md:text-base">
                    Next predicted cycle: <span className="font-normal">{analysis.nextPeriod}</span>
                  </p>
                </div>
              )}
              
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.cycleHistory}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="length"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Hydration Tracker */}
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-600 mb-3 md:mb-4 flex items-center gap-2">
              <Droplet size={20} className="flex-shrink-0" /> Hydration
            </h2>
            <div className="text-center mb-3 md:mb-4">
              <div
                className="radial-progress text-purple-600 mx-auto text-sm md:text-base"
                style={{ 
                  "--value": (analysis.hydration / 2000) * 100,
                  "--size": "8rem",
                  "--thickness": "8px"
                }}
              >
                <div className="flex flex-col">
                  <span>{analysis.hydration}ml</span>
                  <span className="text-xs text-gray-500">
                    {(analysis.hydration / 2000 * 100).toFixed(0)}% of goal
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => updateHydration(amount)}
                  className="bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  +{amount}ml
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Tracker */}
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-600 mb-3 md:mb-4 flex items-center gap-2">
              <Flame size={20} className="flex-shrink-0" /> Symptom Tracker
            </h2>
            <div className="h-40 mb-3 md:mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={symptomData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                    {symptomData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} times`, 'Frequency']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {symptomsList.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                    analysis.symptomFrequency[symptom]
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {symptom}
                  {analysis.symptomFrequency[symptom] && (
                    <span className="text-xs bg-white text-purple-600 rounded-full w-5 h-5 flex items-center justify-center">
                      {analysis.symptomFrequency[symptom]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Tracker */}
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-600 mb-3 md:mb-4 flex items-center gap-2">
              <Dumbbell size={20} className="flex-shrink-0" /> Activity
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.stepsHistory}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="steps" 
                    fill="#8B5CF6" 
                    radius={[4, 4, 0, 0]} 
                    name="Daily Steps"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Trends */}
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-600 mb-3 md:mb-4">
              Weekly Steps Trend
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysis.stepsHistory}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="steps"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Steps"
                  />
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