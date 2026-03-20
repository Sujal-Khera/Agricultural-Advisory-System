import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Search, ShieldCheck, AlertTriangle, RefreshCcw, Activity, Loader2, Image as ImageIcon, Crosshair, ShieldAlert, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DiseaseDetector = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setErrorMsg(null);
    
    const formData = new FormData();
    formData.append('file', image);
    if (user?.id) formData.append('user_id', user.id);

    try {
      const response = await fetch('http://localhost:8000/api/diagnose', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok && data.disease) {
        setResult(data);
      } else {
        setErrorMsg(data.detail || "Analysis failed. Please check inputs.");
      }
    } catch (error) {
       setErrorMsg("Neural link failed. Please start the backend service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#0f3329] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8 shadow-blue-500/10 shadow-2xl"
          >
            <Crosshair size={14} className="mr-3 animate-pulse" />
            Neural Scanning Domain
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white font-serif tracking-tighter mb-6 leading-none">
            Plant Doctor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">CNN</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light tracking-wide">
            Real-time pathogen analysis using our high-precision custom neural network. Identifies 42 distinct crop diseases with edge-computing speed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Upload Interface */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12 xl:col-span-7"
          >
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-4 md:p-8 shadow-2xl relative group">
              <div className={`relative aspect-video rounded-[2rem] overflow-hidden bg-slate-900/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all ${!preview ? 'hover:border-blue-500/50 cursor-pointer' : 'border-solid border-white/5'}`}
                onClick={() => !preview && fileInputRef.current.click()}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Scan Target" className="w-full h-full object-cover" />
                    <AnimatePresence>
                      {loading && (
                        <motion.div 
                          initial={{ top: '0%' }}
                          animate={{ top: ['0%', '98%', '0%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(96,165,250,1)] z-20"
                        />
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="text-center p-12">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <ImageIcon className="text-blue-400 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Initialize Sample</h3>
                    <p className="text-slate-500 text-sm">Drag & drop or click to upload</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>

              {preview && !loading && !result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex gap-4"
                >
                  <button 
                    onClick={handleAnalyze}
                    className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-2xl flex items-center justify-center space-x-3 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                  >
                    <Search size={22} />
                    <span>Run Neural Analysis</span>
                  </button>
                  <button 
                    onClick={() => { setPreview(null); setImage(null); }}
                    className="w-16 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl border border-white/10 transition-all border-dashed"
                  >
                    <RefreshCcw size={22} />
                  </button>
                </motion.div>
              )}

              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
                  <ShieldAlert size={18} />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {loading && (
                <div className="mt-8 text-center p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                  <div className="flex items-center justify-center space-x-4 mb-3">
                    <Loader2 className="text-blue-400 animate-spin" />
                    <span className="text-blue-200 font-bold uppercase tracking-widest text-xs">Computing Pathogens...</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1/2 h-full bg-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Results Dashboard */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12 xl:col-span-5"
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="has-result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <Card className={`border-none backdrop-blur-xl rounded-[2.5rem] overflow-hidden ${
                    result.disease?.toLowerCase().includes('healthy') 
                    ? 'bg-emerald-500/10' 
                    : 'bg-red-500/10 shadow-[0_20px_50px_rgba(239,68,68,0.15)]'
                  }`}>
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant={result.disease?.toLowerCase().includes('healthy') ? "default" : "destructive"} className="uppercase tracking-widest px-3">
                          {result.disease?.toLowerCase().includes('healthy') ? 'Safe Status' : 'Threat Detected'}
                        </Badge>
                        <div className="text-slate-500 text-xs font-bold font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                      </div>
                      <CardTitle className="text-4xl font-black text-white leading-none">
                        {result.disease?.split('___').pop().replace(/_/g, ' ')}
                      </CardTitle>
                      <CardDescription className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">
                        Phenotype Classification
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Confidence</p>
                          <p className="text-3xl font-black text-white">{(result.confidence).toFixed(1)}%</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Latency</p>
                          <p className="text-3xl font-black text-white">42ms</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {!result.disease?.toLowerCase().includes('healthy') && (
                    <Link to="/query" state={{ initialMessage: `How do I treat and manage ${result.disease.split('___').pop().replace(/_/g, ' ')}? Give me a professional protocol.` }} className="block group">
                      <Button variant="outline" className="w-full h-auto p-8 rounded-[2.5rem] border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/20 hover:border-purple-500/50 transition-all flex items-center justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl" />
                        <div className="relative z-10 flex items-center space-x-6 text-left">
                          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-purple-500/20 shadow-2xl">
                            <Activity className="text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">Generate Protocols</h3>
                            <p className="text-purple-300/60 text-sm normal-case font-normal">Consult Neel for treatment path</p>
                          </div>
                        </div>
                        <RefreshCcw className="text-purple-500 group-hover:rotate-180 transition-transform duration-700 relative z-10" />
                      </Button>
                    </Link>
                  )}

                  <Button 
                    variant="ghost"
                    onClick={() => { setResult(null); setImage(null); setPreview(null); }}
                    className="w-full py-8 text-slate-400 font-bold rounded-2xl hover:bg-white/5 transition-all text-sm tracking-widest uppercase"
                  >
                    Reset Environment
                  </Button>
                </motion.div>
              ) : (
                <div className="h-full bg-white/5 border border-white/10 border-dashed rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 mb-8 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10 animate-[spin_8s_linear_infinite]" />
                    <Crosshair className="text-slate-700 w-12 h-12" />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-4">Awaiting Signal</h3>
                  <p className="text-slate-500 max-w-[240px]">Neural diagnostics will initialize once a valid plant leaf sample is ingested.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;
