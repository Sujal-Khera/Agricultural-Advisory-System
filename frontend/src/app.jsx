import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Cpu, Stethoscope, MessageSquareText, Menu, X, ArrowRight, UserCircle, LogOut, ChevronDown, Activity, Layers, ShieldCheck, BrainCircuit, Upload, Camera, Search, AlertTriangle, RefreshCcw, Loader2, Image as ImageIcon, Crosshair, ShieldAlert } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Spotlight } from "@/components/ui/spotlight-new";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FloatingDock } from "@/components/ui/floating-dock";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
// import { LampContainer } from "@/components/ui/lamp";
import { Terminal } from "@/components/ui/terminal";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { CardStack } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import CropWizard from './pages/CropWizard';
import DiseaseDetector from './pages/DiseaseDetector';
import ChatHelper from './pages/ChatHelper';
import WeatherWidget from './components/WeatherWidget';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}>
      {children}
    </span>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location]);

  return (
    <>
      <nav className="fixed w-full z-50 transition-all duration-300 bg-emerald-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <Cpu className="text-white w-7 h-7" />
              </motion.div>
              <span className="text-2xl font-bold text-white tracking-tight font-serif hidden sm:block">AgriAdvisor</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-6 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-xl">
              <NavLink to="/recommend" icon={<Cpu size={18} />} text="Crop Recommender" active={location.pathname === '/recommend'} />
              <div className="w-px h-4 bg-white/10"></div>
              <NavLink to="/diagnose" icon={<Stethoscope size={18} />} text="Plant Doctor" active={location.pathname === '/diagnose'} />
              <div className="w-px h-4 bg-white/10"></div>
              <NavLink to="/query" icon={<MessageSquareText size={18} />} text="Neel" active={location.pathname === '/query'} />
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <WeatherWidget />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div role="button" tabIndex={0} className="flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 group active:scale-95 outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
                        <UserCircle size={18} className="text-emerald-400" />
                      </div>
                      <span className="text-sm font-bold tracking-tight">
                        {user.user_metadata?.full_name || user.email.split('@')[0]}
                      </span>
                      <ChevronDown size={14} className="text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-emerald-900/95 border-white/10 backdrop-blur-2xl text-white rounded-2xl p-2 shadow-2xl animate-in zoom-in-95 duration-200">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-black mb-1">Authenticated Hub</p>
                        <p className="text-xs text-emerald-300 truncate font-mono">{user.email}</p>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="flex items-center space-x-3 px-3 py-3 text-red-400 focus:bg-red-500/10 focus:text-red-400 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <LogOut size={16} />
                        </div>
                        <span className="font-bold text-sm tracking-wide">Sign Out Protocol</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400/20"
                >
                  Log In
                </button>
              )}
            </div>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-emerald-950 border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col space-y-3">
                <MobileNavLink to="/recommend" icon={<Cpu size={18} />} text="Crop Recommender" />
                <MobileNavLink to="/diagnose" icon={<Stethoscope size={18} />} text="Plant Doctor" />
                <MobileNavLink to="/query" icon={<MessageSquareText size={18} />} text="Neel Assistant" />

                <div className="pt-4 mt-2 border-t border-white/5">
                  {user ? (
                    <div className="flex flex-col space-y-3">
                      <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-emerald-500 uppercase tracking-widest font-bold">Logged in as</p>
                        <p className="text-white font-medium truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center space-x-2 border border-red-500/20"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAuthOpen(true)}
                      className="w-full py-4 bg-emerald-600 rounded-2xl text-white font-bold shadow-lg shadow-emerald-500/20"
                    >
                      Sign In / Get Started
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {authOpen && (
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      )}
    </>
  );
};

const NavLink = ({ to, icon, text, active }) => (
  <Link to={to} className={`flex items-center space-x-2 transition-all font-medium text-sm px-3 py-1.5 rounded-lg ${active ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-200 hover:text-white'}`}>
    <span>{icon}</span>
    <span>{text}</span>
  </Link>
);

const MobileNavLink = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center space-x-4 px-6 py-4 rounded-2xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/5">
    <span className="text-emerald-400">{icon}</span>
    <span className="text-lg">{text}</span>
  </Link>
);

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-[#0f3329]">
      {/* Light Emerald Mesh Gradient Background - Page Wide Style */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-15%] w-[100%] h-[100%] bg-emerald-400/20 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -120, 0], y: [0, -60, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-10%] w-[90%] h-[90%] bg-teal-400/20 blur-[140px] rounded-full"
        />
      </div>

      <section className="relative min-h-[95vh] flex items-center justify-center pt-20 overflow-hidden">
        <Spotlight gradientFirst="rgba(52, 211, 153, 0.18)" gradientSecond="rgba(16, 185, 129, 0.1)" gradientThird="rgba(4, 120, 87, 0.05)" className="-top-40 left-0 md:left-60 md:-top-20" />

        <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Dialog>
              <DialogTrigger asChild>
                <div role="button" tabIndex={0} className="inline-flex cursor-pointer transition-transform active:scale-95">
                  <Badge variant="outline" className="px-6 py-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-black tracking-[0.4em] uppercase shadow-emerald-500/10 shadow-2xl hover:bg-emerald-500/20">
                    <Activity className="w-3 h-3 mr-3 animate-pulse" />
                    AgriCore v2.0 Operational
                  </Badge>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-slate-900/95 border-white/10 backdrop-blur-3xl text-white sm:max-w-[600px] rounded-[2rem] p-8 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black font-serif italic mb-2 tracking-tighter">Diagnostic Core Alpha</DialogTitle>
                  <DialogDescription className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-6">
                    Verified Neural Heart: operator://sujal.k@agricore.internal
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Inference Speed</p>
                    <p className="text-2xl font-black text-emerald-400">38.4ms</p>
                    <p className="text-[9px] text-slate-600 mt-1">NVIDIA RTX Edge Optimised</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Model Params</p>
                    <p className="text-2xl font-black text-blue-400">22.4M</p>
                    <p className="text-[9px] text-slate-600 mt-1">ResNet-34 TorchScript</p>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-[10px] text-slate-400 leading-relaxed bg-black/30 p-6 rounded-2xl border border-white/5">
                  <p className="text-emerald-500/60 uppercase font-black mb-2 flex items-center">
                    <Activity size={12} className="mr-2" /> Live Model Telemetry
                  </p>
                  <p className="border-l border-white/10 pl-4 py-1">Layer 1-33: Weights Locked (Verified 0xA2...F8)</p>
                  <p className="border-l border-white/10 pl-4 py-1">Fully Connected (Dense): AgriCrop Head Active</p>
                  <p className="border-l border-teal-500/40 pl-4 py-1 text-teal-400">Memory Allocation: 842.1 MB / 4.0 GB VRAM</p>
                  <p className="border-l border-white/10 pl-4 py-1">Status: High Signal / Low Thermal Drift</p>
                </div>

                <div className="mt-8 flex justify-end">
                  <Badge variant="outline" className="px-4 py-1 border-white/10 text-slate-500 font-mono text-[9px] uppercase">AgriCore-P2P_Network_Secure</Badge>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-8 font-serif"
          >
            Precision <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500">Agronomy.</span>
          </motion.h1>

          <div className="mt-6 text-xl md:text-3xl text-slate-400 leading-tight max-w-3xl mx-auto font-extralight tracking-tight min-h-[80px]">
            <TextGenerateEffect words="Deploying high-precision neural networks to the field. Instant disease diagnosis, soil-mapped insights, and Neel integrated." />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/diagnose">
                <HoverBorderGradient
                  containerClassName="rounded-2xl w-full"
                  className="bg-slate-950 text-white flex items-center space-x-3 px-10 py-5 h-16 w-full text-lg font-black uppercase tracking-widest"
                >
                  <Activity size={20} className="text-emerald-400 animate-pulse" />
                  <span>Run Neural Scan</span>
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </HoverBorderGradient>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/recommend">
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-black uppercase tracking-widest border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-xl rounded-2xl transition-all w-full text-white">
                  Calibrate Engine
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <AuroraBackground showRadialGradient={true} className="bg-transparent py-32 h-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center relative z-20">
          <h2 className="text-5xl md:text-7xl font-bold text-white font-serif tracking-tight mb-6">Neural Ecosystem</h2>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">Precision agriculture through specialized AI agents working at edge speeds.</p>
          <div className="flex justify-center mt-8">
            <AnimatedTooltip items={[
              { id: 1, name: "Pathogen Specialist", designation: "ResNet34 Core", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" },
              { id: 2, name: "Soil Chemist", designation: "RF Classifier", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" },
              { id: 3, name: "Neel AI", designation: "Agronomy LLM", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80" }
            ]} />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 px-6 sm:px-12 lg:px-24 pb-44 relative z-20 w-full animate-in fade-in slide-in-from-bottom-20 duration-1000">
          <ShowcaseCard
            to="/recommend"
            icon={<Cpu className="text-emerald-400 w-10 h-10" />}
            title="Agronomy Engine"
            desc="Leverage an 8-feature Random Forest model to determine optimal crop viability based on real-time soil chemistry and meteorological forecasts."
            color="emerald"
          />
          <ShowcaseCard
            to="/diagnose"
            icon={<Stethoscope className="text-blue-400 w-10 h-10" />}
            title="Plant Doctor CNN"
            desc="A deep 20-epoch convolutional network trained on 100k+ samples. Accurately detect 42 distinct crop pathogens via simple photo analysis."
            color="blue"
          />
          <ShowcaseCard
            to="/query"
            icon={<MessageSquareText className="text-purple-400 w-10 h-10" />}
            title="Consult Neel"
            desc="Your neural agronomy consultant. Context-aware AI that understands your field data and provides actionable treatment protocols."
            color="purple"
            dark={true}
          />
        </div>
      </AuroraBackground>

      <section className="bg-transparent py-32 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] p-8 h-[500px] flex flex-col items-center justify-center overflow-hidden group">
              <EvervaultCard text="SECURE" className="scale-125" />
              <div className="mt text-center">
                <h3 className="text-2xl font-bold font-serif text-white mb-2">Neural Integrity Layer</h3>
                <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">Encrypted Field Telemetry Active</p>
              </div>
              <Icon className="absolute h-10 w-10 -top-5 -left-5 text-emerald-500/40" />
              <Icon className="absolute h-10 w-10 -bottom-5 -right-5 text-blue-500/40" />
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <Badge variant="outline" className="mb-6 px-4 py-1.5 border-blue-500/30 text-blue-400">Live Protocols</Badge>
              <h2 className="text-5xl font-black text-white font-serif leading-tight">Farmer-Generated <br /> Wisdom Stacks.</h2>
              <p className="mt-6 text-xl text-slate-400 font-light leading-relaxed">Our neural network learns from millions of peer-verified treatment paths, creating a living repository of agricultural success.</p>
            </div>

            <div className="flex justify-start pt-10">
              <CardStack items={[
                { id: 0, name: "Dr. Amara Okoro", designation: "Soil Scientist", content: <p>The <Highlight>ResNet34 accuracy</Highlight> on potato blight detection is unmatched in current open-source field trials.</p> },
                { id: 1, name: "Rajesh Kumar", designation: "Commercial Farmer", content: <p>Switching to the <Highlight>AgriCore Engine</Highlight> reduced our water overhead by 22% in the first cycle.</p> },
                { id: 2, name: "Sarah Chen", designation: "System architect", content: <p>Latency on edge inference is now <Highlight>sub-40ms</Highlight>, enabling real-time tractor-mounted detection.</p> }
              ]} />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <Terminal
            commands={[
              "Initializing AgriCore Neural Engine...",
              "Mounting ResNet34 Disease Detector via PyTorch.",
              "Fetching real-time weather telemetry from OpenWeather.",
              "Optimizing crop allocation parameters.",
              "System online. operator sujal.k@agricore.hub verified."
            ]}
            outputs={{
              0: ["[OK] SSL Handshake completed.", "[OK] Neural Core v2.0 Warm-up."],
              1: ["[OK] Model weights loaded (95.4% Accuracy)."],
              2: ["[OK] Coordinates fixed: 12.84°N, 80.15°E."],
              4: ["[AUTHENTICATED] Boot sequence complete."]
            }}
          />
        </div>

        <div className="text-center px-4">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-purple-500/20 shadow-2xl">
              <Activity className="text-purple-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium tracking-widest uppercase italic">Propelling the Green Revolution with Silicon</p>
            <div className="flex space-x-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Protocol</span>
              <span className="hover:text-white cursor-pointer transition-colors">Compute</span>
            </div>
          </div>
        </div>
      </footer>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-fit">
        <FloatingDock
          items={[
            { title: "Home", icon: <Cpu className="w-full h-full" />, href: "/" },
            { title: "Diagnosis", icon: <Stethoscope className="w-full h-full" />, href: "/diagnose" },
            { title: "Recommend", icon: <Activity className="w-full h-full" />, href: "/recommend" },
            { title: "Consult Neel", icon: <MessageSquareText className="w-full h-full" />, href: "/query" }
          ]}
        />
      </div>
    </div>
  );
};

const ShowcaseCard = ({ to, icon, title, desc, color, dark }) => (
  <CardContainer className="inter-var shrink-0">
    <CardBody
      className={`relative group/card w-[85vw] md:w-[450px] h-auto rounded-[3rem] p-12 shadow-2xl border flex flex-col overflow-hidden transition-all duration-500 ${dark ? 'bg-slate-900 border-purple-500/20' : 'bg-white/5 border-white/10 backdrop-blur-2xl'}`}
    >
      <div className={`absolute -top-24 -right-24 w-64 h-64 opacity-20 blur-[80px] rounded-full group-hover/card:opacity-40 transition-opacity duration-700 ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>

      <CardItem translateZ="50" className="w-20 h-20 rounded-3xl mb-12 flex items-center justify-center border transition-all duration-500 group-hover/card:rotate-12 group-hover/card:scale-110 shadow-2xl"
        style={{
          background: color === 'emerald' ? 'rgba(16, 185, 129, 0.1)' : color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
          borderColor: color === 'emerald' ? 'rgba(16, 185, 129, 0.2)' : color === 'blue' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)'
        }}
      >
        {icon}
      </CardItem>

      <CardItem translateZ="60" className="text-3xl font-bold text-white mb-6 font-serif leading-tight">
        {title}
      </CardItem>

      <CardItem translateZ="40" className="text-slate-400 leading-relaxed mb-12 flex-1 text-lg font-light tracking-wide">
        {desc}
      </CardItem>

      <CardItem translateZ="20" className="w-full">
        <Link to={to} className={`font-bold flex items-center text-sm uppercase tracking-widest transition-all ${color === 'emerald' ? 'text-emerald-400 group-hover/card:text-emerald-300' : color === 'blue' ? 'text-blue-400 group-hover/card:text-blue-300' : 'text-purple-400 group-hover/card:text-purple-300'}`}>
          Launch Module <ArrowRight className="ml-3 w-4 h-4 group-hover/card:translate-x-2 transition-transform" />
        </Link>
      </CardItem>
    </CardBody>
  </CardContainer>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-slate-950 selection:bg-leaf-500/30 selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/recommend" element={<div className="min-h-screen bg-[#0f3329]"><CropWizard /></div>} />
          <Route path="/diagnose" element={<div className="min-h-screen bg-[#0f3329]"><DiseaseDetector /></div>} />
          <Route path="/query" element={<div className="h-screen overflow-hidden bg-[#0f3329]"><ChatHelper /></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
