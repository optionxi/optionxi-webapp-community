import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  UserSquare, 
  Settings, 
  Mail, 
  Phone, 
  CreditCard, 
  Lock, 
  Pin, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle, 
  LucideIcon,
  Activity,
  Eye,
  EyeOff,
  LogOut,
  Smartphone,
  Globe,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FyersRepository } from '../utils/fyers_api_endpoints';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface FyersProfileModel {
  name: string;
  image?: string;
  displayName: string;
  emailId: string;
  pan: string;
  fyId: string;
  pinChangeDate: string;
  mobileNumber: string;
  totp: boolean;
  pwdChangeDate: string;
  pwdToExpire: number;
  ddpiEnabled: boolean;
  mtfEnabled: boolean;
}

interface InfoItem {
  label: string;
  value: string;
  icon: LucideIcon;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  description?: string;
  sensitive?: boolean;
}

interface StatCard {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}

const repository = new FyersRepository();

// Enhanced Loading Components
const PulseLoader = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-slate-500/60 to-transparent" />
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
    <div className="flex items-center gap-3">
      <PulseLoader className="w-10 h-10 rounded-lg" />
      <PulseLoader className="h-6 w-32" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <div className="flex items-center gap-3">
            <PulseLoader className="w-8 h-8 rounded-lg" />
            <div className="space-y-2">
              <PulseLoader className="h-3 w-16" />
              <PulseLoader className="h-4 w-24" />
            </div>
          </div>
          <PulseLoader className="h-4 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status, children }: { status: InfoItem['status']; children: React.ReactNode }) => {
  const statusStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status || 'neutral']}`}>
      {children}
    </span>
  );
};

// Trading Stats Component
const TradingStats = ({ isLoading }: { isLoading: boolean }) => {
  const stats: StatCard[] = [
    {
      title: 'Account Status',
      value: 'Active',
      icon: Activity,
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Security Level',
      value: 'High',
      icon: Shield,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Features',
      value: '2 Active',
      icon: Zap,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Last Login',
      value: 'Today',
      icon: Globe,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <PulseLoader className="h-4 w-16 mb-2" />
            <PulseLoader className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <stat.icon size={20} className={stat.color} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {stat.title}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Professional Info Card Component
const InfoCard = ({ 
  title, 
  icon: Icon, 
  items, 
  isLoading,
  className = ""
}: { 
  title: string;
  icon: LucideIcon;
  items: InfoItem[];
  isLoading: boolean;
  className?: string;
}) => {
  const [showSensitive, setShowSensitive] = useState(false);

  const maskSensitiveData = (value: string, sensitive?: boolean) => {
    if (!sensitive || showSensitive) return value;
    if (value.includes('@')) {
      const [local, domain] = value.split('@');
      return `${local.slice(0, 2)}${'*'.repeat(local.length - 2)}@${domain}`;
    }
    if (value.includes('+91')) {
      return `${value.slice(0, 7)}${'*'.repeat(5)}`;
    }
    return `${value.slice(0, 2)}${'*'.repeat(value.length - 2)}`;
  };

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <div className={`rounded-2xl  shadow-sm hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
              <Icon size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          {items.some(item => item.sensitive) && (
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={showSensitive ? "Hide sensitive data" : "Show sensitive data"}
            >
              {showSensitive ? (
                <EyeOff size={16} className="text-slate-500" />
              ) : (
                <Eye size={16} className="text-slate-500" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <item.icon size={16} className="text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white break-words">
                  {maskSensitiveData(item.value, item.sensitive)}
                </p>
                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            {item.status && (
              <StatusBadge status={item.status}>
                {item.status === 'success' && '✓'}
                {item.status === 'warning' && '⚠'}
                {item.status === 'error' && '✗'}
                {item.status === 'neutral' && '—'}
              </StatusBadge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Profile Header
const ProfileHeader = ({ profile, isLoading }: { profile: FyersProfileModel | null; isLoading: boolean }) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-2xl p-8 text-white relative overflow-hidden">
    {/* Background Pattern */}
    {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg" width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" /> */}
    
    <div className="relative">
      {isLoading ? (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <PulseLoader className="w-24 h-24 rounded-full" />
          <div className="text-center md:text-left space-y-3">
            <PulseLoader className="h-8 w-48 mx-auto md:mx-0" />
            <PulseLoader className="h-5 w-32 mx-auto md:mx-0" />
            <PulseLoader className="h-10 w-24 mx-auto md:mx-0" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Avatar */}
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <UserSquare size={40} className="text-white" />
          </div>
          
          {/* Profile Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {profile?.name}
            </h1>
            <p className="text-blue-100 mb-4 text-lg">
              Trader ID: {profile?.fyId}
            </p>
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
                <CheckCircle size={14} />
                <span className="text-sm font-medium">Verified</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full">
                <Shield size={14} />
                <span className="text-sm font-medium">Secured</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          {/* <div className="flex gap-2">
            <button className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-colors">
              <Download size={18} />
            </button>
            <button className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-colors">
              <Bell size={18} />
            </button>
          </div> */}
        </div>
      )}
    </div>
  </div>
);

// Enhanced Error State
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
      <AlertCircle size={40} className="text-red-600 dark:text-red-400" />
    </div>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
      Connection Error
    </h2>
    <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md leading-relaxed">
      {error.replace('Error: ', '')}
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
      >
        <RefreshCw size={18} />
        Retry Connection
      </button>
      <Link
        href="/broker/fyers"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
      >
        <LogOut size={18} />
        Reauthenticate
      </Link>
    </div>
  </div>
);

// Main Component
const FyersProfilePage = () => {
  const [profile, setProfile] = useState<FyersProfileModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      if (!user) return; 
      setIsLoading(true);
      setError(null);
      
      const profileData = await repository.getProfile();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile(); // ✅ Only load orders once authenticated
    }
  }, [user]);

  const getPasswordExpiryStatus = (days: number): InfoItem['status'] => {
    if (days <= 7) return 'error';
    if (days <= 30) return 'warning';
    return 'success';
  };

  // Build info sections data
  const accountInfo: InfoItem[] = profile ? [
    {
      label: 'Full Name',
      value: profile.name,
      icon: UserSquare,
      status: 'success'
    },
    {
      label: 'Email Address',
      value: profile.emailId,
      icon: Mail,
      sensitive: true,
      description: 'Primary Email'
    },
    {
      label: 'Mobile Number',
      value: profile.mobileNumber,
      icon: Phone,
      sensitive: true,
      description: 'For SMS alerts and OTP'
    },
    {
      label: 'PAN Number',
      value: profile.pan,
      icon: CreditCard,
      sensitive: true,
      status: 'success'
    }
  ] : [];

  const securityInfo: InfoItem[] = profile ? [
    {
      label: 'Two-Factor Authentication',
      value: profile.totp ? 'Enabled' : 'Disabled',
      icon: Smartphone,
      status: profile.totp ? 'success' : 'error',
      description: profile.totp ? 'Your account is secured with TOTP' : 'Enable for better security'
    },
    {
      label: 'Password Last Changed',
      value: profile.pwdChangeDate,
      icon: Lock,
      status: 'neutral',
      description: 'Keep your password updated regularly'
    },
    {
      label: 'PIN Last Changed',
      value: profile.pinChangeDate,
      icon: Pin,
      status: 'neutral',
      description: 'Trading PIN for secure transactions'
    },
    {
      label: 'Password Expiry',
      value: `${profile.pwdToExpire} days remaining`,
      icon: Clock,
      status: getPasswordExpiryStatus(profile.pwdToExpire),
      description: profile.pwdToExpire <= 30 ? 'Consider updating soon' : 'Password is current'
    }
  ] : [];

  const featuresInfo: InfoItem[] = profile ? [
    {
      label: 'DDPI (Digital DIS)',
      value: profile.ddpiEnabled ? 'Active' : 'Inactive',
      icon: CheckCircle,
      status: profile.ddpiEnabled ? 'success' : 'neutral',
      description: 'Digital Demat Instruction Slip for holdings'
    },
    {
      label: 'MTF (Margin Trading)',
      value: profile.mtfEnabled ? 'Active' : 'Inactive',
      icon: TrendingUp,
      status: profile.mtfEnabled ? 'success' : 'neutral',
      description: 'Margin Trading Facility for leveraged positions'
    }
  ] : [];

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
                Sign in to connect your Fyers trading account
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


  // Main render
  if (error && !profile) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-6xl mx-auto">
          <ErrorState error={error} onRetry={loadProfile} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl space-y-8">
        {/* Profile Header */}
        <ProfileHeader profile={profile} isLoading={isLoading} />
        
        {/* Trading Stats */}
        <TradingStats isLoading={isLoading} />
        
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          <InfoCard
            title="Account Information"
            icon={UserSquare}
            items={accountInfo}
            isLoading={isLoading}
            className="lg:col-span-2 xl:col-span-1"
          />
          
          <InfoCard
            title="Security & Authentication"
            icon={Shield}
            items={securityInfo}
            isLoading={isLoading}
          />
          
          <InfoCard
            title="Trading Features"
            icon={Settings}
            items={featuresInfo}
            isLoading={isLoading}
          />
        </div>

        {/* Error Alert for runtime errors */}
        {error && profile && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Warning:</strong> {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FyersProfilePage;