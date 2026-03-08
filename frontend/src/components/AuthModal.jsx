import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Cpu } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        alert("Registration successful! You may now sign in.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-950/95 border-white/10 backdrop-blur-3xl text-white sm:max-w-md rounded-[3rem] p-0 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-pulse" />
        
        <div className="p-10">
          <DialogHeader className="mb-8">
            <div className="flex justify-center mb-6">
              <Badge variant="outline" className="px-4 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest font-black">
                <ShieldCheck size={12} className="mr-2" /> AgriCore Auth Secure
              </Badge>
            </div>
            <DialogTitle className="text-4xl font-black text-center font-serif tracking-tighter leading-none mb-2">
              {isLogin ? 'Welcome Back.' : 'Initialize Protocol.'}
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400 text-sm font-light tracking-tight">
              {isLogin 
                ? 'Resume your neural field telemetry and history.' 
                : 'Join the global network of high-precision agronomy.'}
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-mono border border-red-500/20 animate-in fade-in slide-in-from-top-4">
              [ERROR]: {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
               <div className="mt-8 text-center">
                  <h3 className="text-2xl font-bold font-serif text-white mb-2">Neural Integrity Layer</h3>
                  <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">Encrypted Field Telemetry Active</p>
               </div>
            )}
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <Input 
                  type="text" 
                  placeholder="Full Name" 
                  required={!isLogin}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 focus:border-emerald-500/50 rounded-2xl transition-all"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <Input 
                type="email" 
                placeholder="Email Address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 bg-white/5 border-white/10 focus:border-emerald-500/50 rounded-2xl transition-all"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <Input 
                type="password" 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-14 bg-white/5 border-white/10 focus:border-emerald-500/50 rounded-2xl transition-all"
              />
            </div>

            <Button 
              disabled={loading}
              type="submit"
              className="w-full h-16 mt-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-lg uppercase tracking-widest rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all border border-emerald-400/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <div className="flex items-center space-x-3">
                  <span>{isLogin ? 'Authenticate' : 'Register'}</span>
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </form>
        </div>
        
        <div className="px-10 py-6 bg-white/[0.02] border-t border-white/5 text-center">
          <p className="text-xs text-slate-500 font-medium">
            {isLogin ? "Neural signature not found?" : "Already verified?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest text-[10px]"
            >
              {isLogin ? 'Create Account' : 'Return to Login'}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
