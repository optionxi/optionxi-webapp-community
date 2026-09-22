'use client';

import { useState } from 'react';
import { ExternalLink, Copy, ChevronDown, ChevronUp, Play, Check, AlertCircle } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  link?: string;
  redirectUrl?: string;
}

type BrokerName = 'fyers' | 'zerodha' | 'upstox';

interface BrokerStepsGuideProps {
  brokerName: BrokerName;
  defaultOpen?: boolean;
  status?: 'authenticated' | 'pending' | 'disconnected';
}

const BROKER_STEPS: Record<BrokerName, Step[]> = {
  fyers: [
    {
      title: "Create Fyers Account",
      description: "Register and complete KYC",
      link: "https://open-account.fyers.in/"
    },
    {
      title: "Access Developer Portal",
      description: "Login to API dashboard",
      link: "https://myapi.fyers.in/dashboard"
    },
    {
      title: "Create New App",
      description: "Add redirect URL provided above",
      redirectUrl: "https://fastapi.optionxi.com/broker/fyers"
    },
    {
      title: "Copy API Keys",
      description: "Get App ID and Secret Key"
    },
    {
      title: "Connect Account",
      description: "Enter credentials and authenticate"
    }
  ],
  zerodha: [
    {
      title: "Create Zerodha Account",
      description: "Register and complete KYC",
      link: "https://zerodha.com/open-account"
    },
    {
      title: "Developer Signup",
      description: "Sign up as a developer",
      link: "https://developers.kite.trade/signup"
    },
    {
      title: "Developer Login",
      description: "SignIn as developer",
      link: "https://developers.kite.trade/apps"
    },
    {
      title: "Create New App",
      description: "Add redirect URL provided above",
      redirectUrl: "https://fastapi.optionxi.com/broker/zerodha"
    },
    {
      title: "Copy API Keys",
      description: "Get API Key and Secret"
    },
    {
      title: "Connect Account",
      description: "Enter credentials and authenticate"
    }
  ],
  upstox: [
    {
      title: "Create Upstox Account",
      description: "Register and complete KYC",
      link: "https://upstox.com/open-demat-account"
    },
    {
      title: "Access Developer Portal",
      description: "Login to developer console",
      link: "https://account.upstox.com/developer/apps"
    },
    {
      title: "Create New App",
      description: "Add redirect URL provided above",
      redirectUrl: "https://fastapi.optionxi.com/broker/upstox"
    },
    {
      title: "Copy API Keys",
      description: "Get API Key and Secret"
    },
    {
      title: "Connect Account",
      description: "Enter credentials and authenticate"
    }
  ]
};

const VIDEO_GUIDES: Record<BrokerName, string> = {
  fyers: "https://www.youtube.com/watch?v=-k-3eZQkxPU",
  zerodha: "https://www.youtube.com/watch?v=z7swHkB3Pa0",
  upstox: "https://www.youtube.com/watch?v=XZH3j2P07mo"
};

const BROKER_ACCOUNT_LINKS: Record<BrokerName, string> = {
  fyers: "https://open-account.fyers.in/",
  zerodha: "https://zerodha.com/open-account?c=ZMPZBA",
  upstox: "http://upstox.com/open-account/?f=0wYl"
};

export default function BrokerStepsGuide({ 
  brokerName, 
  defaultOpen = false, 
  status = 'pending' 
}: BrokerStepsGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const steps = BROKER_STEPS[brokerName];
  const videoUrl = VIDEO_GUIDES[brokerName];
  const accountUrl = BROKER_ACCOUNT_LINKS[brokerName];
  const brokerDisplayName = brokerName.charAt(0).toUpperCase() + brokerName.slice(1);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const getStepStatus = (stepIndex: number): 'success' | 'pending' | 'info' | 'warning' => {
    if (stepIndex === steps.length - 1) {
      return status === 'authenticated' ? 'success' : 'pending';
    }
    // You can add logic here to return 'warning' for specific steps if needed
    // For example, for the "Create New App" step:
    if (stepIndex === 2) {
      return 'warning'; // Highlight the redirect URL step as important
    }
    return 'info';
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-2xl"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {brokerDisplayName} Setup Guide
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-6 pb-6">
          {/* Steps */}
          <div className="space-y-4 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  getStepStatus(index) === 'success' ? 'bg-emerald-600 text-white' :
                  getStepStatus(index) === 'warning' ? 'bg-amber-600 text-white' :
                  getStepStatus(index) === 'pending' ? 'bg-blue-600 text-white' :
                  'bg-slate-600 text-white'
                }`}>
                  {getStepStatus(index) === 'success' ? '✓' : index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {step.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {step.link && (
                        <button
                          onClick={() => window.open(step.link, '_blank')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          title="Open link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                      {step.redirectUrl && (
                        <button
                          onClick={() => handleCopyUrl(step.redirectUrl!)}
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                          title="Copy redirect URL"
                        >
                          {copiedUrl === step.redirectUrl ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {step.description}
                  </p>
                  {step.redirectUrl && (
                    <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                      {step.redirectUrl}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.open(videoUrl, '_blank')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch {brokerDisplayName} Setup Video
            </button>
            
            <button
              onClick={() => window.open(accountUrl, '_blank')}
              className="w-full border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open {brokerDisplayName} Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}