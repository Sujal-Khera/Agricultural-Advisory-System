import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowRight, ArrowLeft, Droplets, Thermometer, FlaskConical, CloudRain, ShieldAlert, Activity, MapPin, Loader2, BarChart3, CloudLightning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CropWizard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [formData, setFormData] = useState({
    N: 50, P: 50, K: 50,
    temperature: 25.5, humidity: 65, ph: 6.5, rainfall: 100
  });

  // Auto-fetch location based weather
  useEffect(() => {
    if (step === 2 && formData.temperature === 25.5 && !geoLoading) {
      // Opt-in for auto-syncing when they reach step 2 
    }
  }, [step]);

  const handleIdentifyLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`http://localhost:8000/api/weather?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          temperature: parseFloat(data.temperature.toFixed(1)),
          humidity: parseFloat(data.humidity.toFixed(1)),
          rainfall: parseFloat(data.rain_mm.toFixed(1))
        }));
      } catch (err) {
        console.error("Weather fetch failed", err);
      } finally {
        setGeoLoading(false);
      }
    }, () => setGeoLoading(false));
  };

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('http://localhost:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: user?.id })
      });
      const data = await response.json();
      
      if (response.ok && data.crop) {
        setResult(data);
        setStep(3);
      } else {
        setErrorMsg(data.detail || "Analysis failed. Please check inputs.");
      }
    } catch (error) {
      setErrorMsg("Neural link failed. Please start the backend service.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-slate-950">
      {/* Dynamic Backgrounds */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-600 blur-[150px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600 blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Area */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 text-emerald-400 font-bold tracking-widest text-xs uppercase mb-4"
            >
              <Activity size={16} />
              <span>Diagnostic Module 01</span>
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-4xl md:text-6xl font-black text-white font-serif tracking-tight"
            >
              Agronomy Engine
            </motion.h1>
          </div>
          
          {/* Step Progress Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3 bg-white/5 border border-primary/20 rounded-2xl p-2 px-4 backdrop-blur-xl shrink-0"
          >
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <Badge 
                  variant={step === s ? "default" : "outline"}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center p-0 font-bold transition-all duration-500 ${
                    step === s ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110' : 
                    step > s ? 'border-emerald-500/50 text-emerald-400' : 'border-white/10 text-slate-500'
                  }`}
                >
                  {s}
                </Badge>
                {s < 3 && <div className={`w-10 h-[2px] mx-1 rounded-full ${step > s ? 'bg-emerald-500/40' : 'bg-white/5'}`} />}
              </div>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none" />
              
              <motion.div variants={itemVariants} className="flex items-center space-x-4 mb-12">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <FlaskConical className="text-emerald-400 w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Soil Macronutrients</h2>
                  <p className="text-emerald-400/60 font-medium text-sm tracking-wide uppercase">Calibrate Elemental Ranges (mg/kg)</p>
                </div>
              </motion.div>

              <div className="space-y-10">
                <motion.div variants={itemVariants}>
                  <SliderGroup label="Nitrogen Content (N)" name="N" value={formData.N} onChange={handleSliderChange} min={0} max={140} color="emerald" icon="N" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SliderGroup label="Phosphorus Content (P)" name="P" value={formData.P} onChange={handleSliderChange} min={5} max={145} color="emerald" icon="P" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SliderGroup label="Potassium Content (K)" name="K" value={formData.K} onChange={handleSliderChange} min={5} max={205} color="emerald" icon="K" />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="mt-14 flex justify-end">
                <Button 
                  onClick={() => setStep(2)}
                  className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl flex items-center space-x-3 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 group"
                >
                  <span className="uppercase tracking-widest text-sm">Climate Parameters</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 blur-3xl pointer-events-none" />
              
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                    <CloudLightning className="text-teal-400 w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Ecological Matrix</h2>
                    <p className="text-teal-400/60 font-medium text-sm tracking-wide uppercase">Environmental Sensory Input</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={handleIdentifyLocation}
                  disabled={geoLoading}
                  className="h-12 px-6 border-teal-400/30 bg-teal-400/5 text-teal-400 hover:bg-teal-400 hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(20,184,166,0.1)] rounded-xl group"
                >
                  {geoLoading ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} className="group-hover:animate-bounce mr-2" />}
                  <span>{geoLoading ? "Syncing..." : "Auto-Sync Weather"}</span>
                </Button>
              </motion.div>

              <div className="space-y-10">
                <motion.div variants={itemVariants}>
                  <SliderGroup label="Temperature (°C)" name="temperature" value={formData.temperature} onChange={handleSliderChange} min={5} max={50} step={0.1} color="teal" icon={<Thermometer size={16} />} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SliderGroup label="Relative Humidity (%)" name="humidity" value={formData.humidity} onChange={handleSliderChange} min={10} max={100} step={0.1} color="teal" icon={<Droplets size={16} />} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SliderGroup label="Soil Acidity (pH / 14)" name="ph" value={formData.ph} onChange={handleSliderChange} min={3.5} max={10} step={0.1} color="teal" icon="pH" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SliderGroup label="Rainfall Density (mm)" name="rainfall" value={formData.rainfall} onChange={handleSliderChange} min={20} max={300} step={0.1} color="teal" icon={<CloudRain size={16} />} />
                </motion.div>
              </div>

              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
                  <ShieldAlert size={18} />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="mt-14 flex items-center justify-between">
                <Button 
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white font-bold h-12 px-6 rounded-xl border border-transparent hover:border-white/10"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  <span className="uppercase tracking-widest text-[10px]">Back</span>
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-16 px-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl flex items-center space-x-4 transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)] relative overflow-hidden active:scale-95 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-slate-950" size={24} />
                  ) : (
                    <>
                      <Activity size={24} className="text-slate-950" />
                      <span className="uppercase tracking-widest text-sm">Execute Neural Model</span>
                      <motion.div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div
              key="result"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-12 md:p-16 shadow-[0_30px_100px_rgba(16,185,129,0.3)] relative overflow-hidden text-center border border-emerald-400/30">

                
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }} 
                  animate={{ scale: 1, rotate: 0 }} 
                  transition={{ type: "spring", damping: 15 }}
                  className="w-28 h-28 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/20 backdrop-blur-md shadow-2xl relative z-10"
                >
                  <Cpu className="text-white w-14 h-14" />
                </motion.div>
                
                <div className="relative z-10">
                  <p className="text-teal-200/80 font-bold tracking-[0.4em] uppercase text-xs mb-6">Inference Optimal Solution</p>
                  <h2 className="text-6xl md:text-8xl font-black text-white capitalize mb-10 font-serif italic tracking-tight drop-shadow-2xl">
                    {result.crop}
                  </h2>
                  
                  <div className="inline-flex items-center space-x-6 bg-slate-950/40 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-xl shadow-inner">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-teal-300/60 uppercase font-black tracking-widest pl-1">Confidence Score</span>
                      <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{result.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/query" state={{ initialMessage: `Tell me more about ${result.crop} cultivation and best practices.` }} className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2.5rem] p-10 transition-all flex items-center justify-between shadow-2xl">
                  <div className="flex items-center space-x-8">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                      <Cpu className="text-purple-400 w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Request Intel</h3>
                      <p className="text-slate-400 text-sm tracking-wide">Consult Neel for {result.crop} blueprints</p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-4 w-8 h-8" />
                </Link>

                <button 
                  onClick={() => { setStep(1); setResult(null); }}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2.5rem] p-10 transition-all flex items-center justify-between text-left shadow-2xl"
                >
                  <div className="flex items-center space-x-8">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                      <FlaskConical className="text-emerald-400 w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">New Vector</h3>
                      <p className="text-slate-400 text-sm tracking-wide">Re-calibrate analysis matrix</p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-4 w-8 h-8" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* Beautiful Form Slider Component designed specifically for the AI Engine Theme */
const SliderGroup = ({ label, name, value, onChange, min, max, step = 1, color, icon }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-white/50 uppercase tracking-[0.2em] flex items-center space-x-3">
          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] ${color === 'teal' ? 'bg-teal-500/20 text-teal-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {icon}
          </span>
          <span>{label}</span>
        </label>
        <div className={`text-2xl font-black font-mono ${color === 'teal' ? 'text-teal-400' : 'text-emerald-400'}`}>
          {value}<span className="text-sm opacity-50 ml-1 font-sans">{step < 1 ? '' : ''}</span>
        </div>
      </div>
      
      <div className="relative h-12 flex items-center group">
        <div className="absolute w-full h-3 bg-slate-900 rounded-full border border-white/5 overflow-hidden">
          <motion.div 
            className={`h-full ${color === 'teal' ? 'bg-gradient-to-r from-teal-600 to-teal-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
            style={{ width: `${percentage}%` }}
            layout
          />
        </div>
        <input 
          type="range" 
          name={name}
          min={min} 
          max={max} 
          step={step}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        {/* Thumb indicator that tracks with the value */}
        <motion.div 
          className={`absolute w-6 h-6 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 border-slate-950 flex items-center justify-center z-0 pointer-events-none ${color === 'teal' ? 'bg-teal-400 shadow-teal-500/50' : 'bg-emerald-400 shadow-emerald-500/50'}`}
          style={{ left: `calc(${percentage}% - 12px)` }}
          layout
        >
           <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
        </motion.div>
      </div>
      <div className="flex justify-between text-[10px] text-white/30 font-bold font-mono px-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default CropWizard;
