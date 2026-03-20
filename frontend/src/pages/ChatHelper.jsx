import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Cpu, User, Loader2, MessageSquare, Trash2, Maximize2, Activity, Volume2, Mic, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ChatHelper = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I am Neel, your specialized agricultural intelligence. How can I assist you in the field today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const isInitialMount = useRef(true);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition (STT)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Text to Speech (TTS)
  const speakMessage = (text) => {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Handle incoming queries from other modules
  useEffect(() => {
    if (isInitialMount.current && location.state?.initialMessage) {
      isInitialMount.current = false;
      const initialQuery = location.state.initialMessage;
      // Auto-trigger analysis
      triggerInitialAnalysis(initialQuery);
    }
  }, [location]);

  const triggerInitialAnalysis = async (queryText) => {
    setMessages(prev => [...prev, { role: 'user', content: queryText }]);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: queryText,
          context: "[]",
          user_id: user?.id
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "My link to the neural core was interrupted. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsgText = input;
    const userMessage = { role: 'user', content: userMsgText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userMsgText,
          context: JSON.stringify(messages.slice(-5)), // Send context history as string
          user_id: user?.id
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "My link to the neural core was interrupted. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] mt-20 flex flex-col bg-[#0f3329] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 backdrop-blur-md bg-emerald-950/50 z-10 w-full flex justify-center">
        <div className="max-w-4xl w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border border-primary/20 shadow-lg shadow-primary/10">
              <AvatarImage src="/neel-icon.png" alt="Neel" />
              <AvatarFallback className="bg-gradient-to-tr from-emerald-600 to-teal-600">
                <Cpu className="text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-black text-white font-serif tracking-tight">Neel Neural Core</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="h-5 px-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] uppercase font-black">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Global Core Active
                </Badge>
              </div>
            </div>
          </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              setMessages([messages[0]]);
            }}
            className="p-2.5 text-emerald-500 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-xl border border-transparent hover:border-red-400/20"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar scroll-smooth z-10"
      >
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] group relative flex items-end gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className={`h-10 w-10 border border-white/10 shrink-0 ${msg.role === 'user' ? 'shadow-blue-500/20' : 'shadow-purple-500/20'}`}>
                  {msg.role === 'user' ? (
                    <>
                      <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`} />
                      <AvatarFallback className="bg-emerald-600 text-white"><User size={16} /></AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/neel-icon.png" />
                      <AvatarFallback className="bg-emerald-800 text-emerald-400"><Cpu size={16} /></AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <div className={`p-5 rounded-[2rem] text-[15px] leading-relaxed relative ${
                  msg.role === 'user' 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 rounded-br-none' 
                  : 'bg-white/5 border border-white/10 backdrop-blur-xl text-slate-200 rounded-tl-none'
                }`}>
                  <div className="prose prose-invert prose-p:leading-relaxed max-w-none">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className={`text-[9px] uppercase tracking-widest font-black opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.role === 'user' ? ((user && user.email) ? user.email.split('@')[0] : 'Operator') : 'Neel Node Alpha'}
                    </div>
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => speakMessage(msg.content)}
                        className="p-1 px-2 text-emerald-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all active:scale-95 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/10"
                        title="Neural Voice Response"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none">
                <div className="flex space-x-2">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8 bg-emerald-950/80 backdrop-blur-2xl border-t border-white/5 z-10">
        <div className="max-w-4xl mx-auto relative group flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening to Field Operator..." : "Type your agronomic query..."}
              className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-8 pr-16 text-white focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 transition-all placeholder:text-slate-600 shadow-2xl ${isListening ? 'ring-2 ring-red-500/50 border-red-500/50 bg-red-500/5' : ''}`}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-emerald-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="translate-x-0.5 -translate-y-0.5" />}
            </button>
          </div>
          
          <button
            onClick={toggleListening}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
              isListening 
              ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse' 
              : 'bg-white/5 border-white/10 text-emerald-500 hover:bg-white/10 hover:border-emerald-500/30 shadow-xl'
            }`}
          >
            {isListening ? <StopCircle size={22} /> : <Mic size={22} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-emerald-600 mt-4 uppercase tracking-[0.2em] font-black opacity-60">Neural Telemetry (STT/TTS) Active</p>
      </div>
    </div>
  );
};

export default ChatHelper;
