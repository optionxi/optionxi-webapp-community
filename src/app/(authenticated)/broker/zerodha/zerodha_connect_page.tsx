'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { signIn } from 'next-auth/react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  TrendingUp,
  LogOut,
  Shield,
  Key,
  ExternalLink,
  Activity,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Trash2,
  MessageCircle,
  X
} from 'lucide-react';
import Image from 'next/image';
import { getDatabase, onValue, ref, serverTimestamp, update } from '@firebase/database';
import BrokerStepsGuide from '../steps_section';

const STATUS_CONFIG = {
  authenticated: { 
    color: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800', 
    icon: CheckCircle 
  },
  credentials_saved: { 
    color: 'text-blue-600 dark:text-blue-400', 
    bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800', 
    icon: Activity 
  },
  pending: { 
    color: 'text-amber-600 dark:text-amber-400', 
    bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800', 
    icon: RefreshCw 
  },
  connection_failed: { 
    color: 'text-red-600 dark:text-red-400', 
    bg: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800', 
    icon: XCircle 
  },
  disconnected: { 
    color: 'text-slate-600 dark:text-slate-400', 
    bg: 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800', 
    icon: Shield 
  }
};

export default function ZerodhaConnect() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('disconnected');
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const router = useRouter();

  // Firebase Auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Database listener
  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const dbRef = ref(db, `brokers/zerodha/${user.uid}`);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newStatus = data.status || 'disconnected';
        const prevStatus = status;
        
        setApiKey(data.api_key || '');
        setApiSecret(data.api_secret || '');
        setStatus(newStatus);
        
        // Show success dialog when status changes to authenticated
        if (prevStatus !== 'authenticated' && newStatus === 'authenticated') {
          setShowSuccessDialog(true);
        }
        
        const messages: Record<string, string> = {
          authenticated: 'Successfully connected and ready for trading',
          credentials_saved: 'Credentials saved securely. Click authenticate to proceed.',
          pending: 'Authentication in progress...',
          connection_failed: `Connection failed: ${data.error_message || 'Please verify credentials and try again'}`,
          disconnected: 'No active connection'
        };
        setStatusMessage(messages[newStatus] || 'No active connection');
      } else {
        setApiKey('');
        setApiSecret('');
        setStatus('disconnected');
        setStatusMessage('Enter your API credentials to get started');
      }
    });

    return () => unsubscribe();
  }, [user, status]);

  const saveCredentials = async () => {
    if (!apiKey.trim() || !apiSecret.trim() || !user) return;

    setIsSaving(true);
     try {
      const db = getDatabase();
      const dbRef = ref(db, `brokers/zerodha/${user.uid}`);

      await update(dbRef, {
        api_key: apiKey.trim(),
        api_secret: apiSecret.trim(),
        updated_at: serverTimestamp(),
        status: "credentials_saved",
      });
    } catch (error: unknown) {
      console.error("Save failed:", error);

      if (error instanceof Error) {
        alert(`Save failed: ${error.message}`);
      } else {
        alert("Save failed: An unknown error occurred.");
      }
    } finally {
      setIsSaving(false);
    }

  };

  const authenticate = () => {
    if (!apiKey.trim() || !user) return;
    const url = `https://kite.trade/connect/login?v=3&api_key=${apiKey.trim()}&redirect_params=suid%3D${user.uid}`;
    window.open(url, '_blank');
  };

  const disconnect = async () => {
    if (!user || !confirm('Are you sure you want to disconnect and remove all stored credentials?')) return;

    setIsDeleting(true);
    try {
      const db = getDatabase();
      const dbRef = ref(db, `brokers/zerodha/${user.uid}`);

      await update(dbRef, {
        api_key: apiKey.trim(),
        api_secret: apiSecret.trim(),
        updated_at: serverTimestamp(),
        status: "credentials_saved",
      });
    } catch (error) {
      console.error("Save failed:", error);

      if (error instanceof Error) {
        alert(`Save failed: ${error.message}`);
      } else {
        alert("Save failed: An unknown error occurred.");
      }
    } finally {
      setIsSaving(false);
    }

  };

  const startTrading = () => {
    const tradingUrl = `/broker/zerodha/trading`;
    router.push(tradingUrl);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const contactSupport = () => {
    const phoneNumber = '+919496672190';
    const message = 'Hi, I need help with Zerodha API setup on OptionXI platform.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Success Dialog Component
  const SuccessDialog = () => {
    if (!showSuccessDialog) return null;

    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setShowSuccessDialog(false)}
        />
        
        {/* Dialog */}
        <div className="fixed inset-x-0 bottom-10 z-50 md:inset-0 md:flex md:items-center md:justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-md mx-auto md:max-w-lg transform transition-transform relative">
            {/* Close button - only on desktop */}
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="hidden md:block absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8 pb-8">
              {/* Mobile drag indicator */}
              <div className="md:hidden w-12 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-6" />

              {/* Icons Section */}
              <div className="flex items-center justify-center space-x-6 mb-6">
                {/* Broker Logo */}
                <div className="relative">
                  <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-lg flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/assets/brokers/zerodha.png" 
                      alt="Zerodha" 
                      width={48} 
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Success Icon */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {/* Animated ring */}
                  <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-300 dark:border-emerald-600 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Connection Successful!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed px-2">
                  Your Zerodha account is connected and ready for trading.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  startTrading();
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Start Trading Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>

              {/* Secondary Action */}
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="w-full mt-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-3 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Enhanced Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="text-center space-y-8 px-6">
        {/* Logo Container with Enhanced Animation */}
        <div className="relative flex items-center justify-center">
          {/* Outer Glow Ring */}
          <div className="absolute w-24 h-24 border-2 border-blue-500/30 dark:border-blue-400/30 rounded-full animate-ping"></div>
          
          {/* Spinning Ring */}
          <div className="absolute w-20 h-20 border-3 border-transparent border-t-blue-600 dark:border-t-blue-400 border-r-blue-500 dark:border-r-blue-300 rounded-full animate-spin"></div>
          
          {/* Logo Background Circle */}
          <div className="relative w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            {/* Replace this div with your actual Zerodha logo */}
            <img 
              src="/assets/brokers/zerodha.png" 
              alt="Zerodha Logo" 
              className="w-10 h-10 object-contain"
            />
            {/* Fallback logo placeholder */}
            <div className="hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
          </div>
        </div>

        {/* Loading Text Animation */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Main Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Initializing Zerodha
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
              Setting up your trading workspace...
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-64 mx-auto">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-500/40 rounded-full animate-float [animation-delay:1s]"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-float [animation-delay:2s]"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes loading {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.3; }
        }
      `}</style>
    </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="max-w-sm w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to connect your Zerodha trading account
            </p>
          </div>
          <button
            onClick={() => signIn('google')}
            className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <Image src="/assets/svgs/google.svg" alt="Google" width={20} height={20} className="mr-3" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.disconnected;
  const StatusIcon = statusConfig.icon;
  const redirectUrl = 'https://fastapi.optionxi.com/broker/zerodha';

  return (
    <div className="min-h-screen ">
      {/* Success Dialog */}
      <SuccessDialog />
      
      <div className="sticky top-14 z-10 w-full">
      {/* Sleek Banner with curved bottom edges */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 overflow-hidden">
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        {/* Content */}
        <div className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Icon */}
               <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                <div className="w-full h-full bg-white/90 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/assets/brokers/zerodha.png" 
                    alt="Zerodha Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>

                
                {/* Title & Description */}
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    Zerodha Account
                  </h2>
                  <p className="text-sm text-blue-100/80 leading-tight">
                    {status === 'authenticated' ? 'Connected & ready for trading' : 'Connect for portfolio sync'}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'authenticated' 
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                      : 'bg-amber-400 shadow-sm shadow-amber-400/50'
                  }`}></div>
                  <span className="text-sm text-white/90 font-medium">
                    {status === 'authenticated' ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Layout - 2 Rows */}
            <div className="sm:hidden space-y-3">
              {/* Row 1 - Icon and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl p-1.5 shadow-lg">
                  <div className="w-full h-full bg-white/90 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="/assets/brokers/zerodha.png"
                      alt="Zerodha Logo"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-base font-bold text-white leading-tight">
                    Zerodha Account
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'authenticated' 
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                      : 'bg-amber-400 shadow-sm shadow-amber-400/50'
                  }`}></div>
                  <span className="text-xs text-white/90 font-medium">
                    {status === 'authenticated' ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Row 2 - Description */}
              {/* <div className="pl-12">
                <p className="text-sm text-blue-100/80 leading-tight">
                  {status === 'authenticated' ? 'Connected & ready for trading' : 'Connect for portfolio sync'}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="relative -mt-[1px]">
        <div className="max-w-7xl py-8">
          {/* Trading Button - Full Width */}
          {status === 'authenticated' && (
            <div className="mb-8">
              <button
                onClick={startTrading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                Launch Trading Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status Card */}
             <div className={`rounded-2xl border p-4 sm:p-6 ${statusConfig.bg} transition-all duration-200 shadow-sm`}>
              <div className="flex items-start justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                <div className="flex items-center w-full sm:w-auto">
                  <div className="p-2 sm:p-3 rounded-xl bg-white dark:bg-slate-800 shadow-md mr-3 sm:mr-4 flex-shrink-0">
                    <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${statusConfig.color} ${(status === 'pending') ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold ${statusConfig.color} text-base sm:text-lg truncate`}>
                      {status.toUpperCase().replace('_', ' ')}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 line-clamp-2">
                      {statusMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
              {/* Main Form */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">API Credentials</h2>
                </div>
                
                <div className="space-y-6">
                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Zerodha API Key
                    </label>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                      placeholder="Enter your Zerodha API Key"
                    />
                  </div>

                  {/* API Secret */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      API Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showApiSecret ? 'text' : 'password'}
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                        placeholder="Enter your Zerodha Secret Key"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-md"
                      >
                        {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  {status === 'credentials_saved' || status === 'connection_failed' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={authenticate}
                          disabled={isSaving || isDeleting}
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          Authenticate Now
                        </button>
                        <button
                          onClick={saveCredentials}
                          disabled={!apiKey.trim() || !apiSecret.trim() || isSaving || isDeleting}
                          className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Update Credentials'
                          )}
                        </button>
                      </div>
                      
                      <button
                        onClick={disconnect}
                        disabled={isSaving || isDeleting}
                        className="w-full border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold py-3 px-6 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Saved Credentials
                          </>
                        )}
                      </button>
                    </div>
                  ) : status === 'authenticated' ? (
                    <button
                      onClick={disconnect}
                      disabled={isSaving || isDeleting}
                      className="w-full border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold py-3 px-6 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          Disconnect Account
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={saveCredentials}
                      disabled={!apiKey.trim() || !apiSecret.trim() || isSaving || isDeleting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save & Connect'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Redirect URL Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Redirect URL Required</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Add this redirect URL in your Zerodha developer app:
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm text-blue-600 dark:text-blue-400 font-mono break-all">
                      {redirectUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(redirectUrl)}
                      className="flex-shrink-0 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedText === redirectUrl ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Setup Guide */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Quick Setup Steps */}
                <BrokerStepsGuide brokerName={'zerodha'} defaultOpen={true}/>

                {/* Support Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Need Assistance?</h4>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                    Get instant help with API setup and configuration
                  </p>
                  <button 
                    onClick={contactSupport}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Support
                  </button>
                </div>
              </div>
            </div>
          </div>      
        </div>
      </div>
    </div>
  );
}