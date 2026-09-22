'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getAuth, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Shield,
  Send,
  RefreshCw,
  Moon,
  Sun,
  Bolt,
  MessageSquare,
  ChevronRight,
  List,
  X,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  TrendingUp,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';


interface ChatSession {
  id: string;
  suid: string;
  message: string;
  result?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  status_message?: string;
  progress?: number;
  tools?: string[];
  stocks?: string[];
  created_at: string;
}

interface PredefinedQuestion {
  question: string;
  tool_id: string[];
}

export default function ChatScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [predefinedQuestions, setPredefinedQuestions] = useState<PredefinedQuestion[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dailyLimit = isPremium ? 300 : 30;
  const auth = getAuth();

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  const initializeChat = async () => {
    await Promise.all([
      checkPremiumStatus(),
      fetchDailyUsage(),
      fetchHistory(),
      fetchPredefinedQuestions(),
    ]);
    subscribeToRealtime();
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const checkPremiumStatus = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select()
        .eq('user_id', user.uid)
        .eq('is_active', true)
        .maybeSingle();
      setIsPremium(!!data);
    } catch (error) {
      console.error('Error checking premium:', error);
    }
  };

  const fetchDailyUsage = async () => {
    if (!user) return;
    try {
      const now = new Date();
      const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString();
      const { count } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('suid', user.uid)
        .gte('created_at', startOfDay);
      setDailyMessageCount(count || 0);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('chat_sessions')
        .select()
        .eq('suid', user.uid)
        .order('created_at', { ascending: false })
        .limit(50);
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredefinedQuestions = async () => {
    try {
      const { data } = await supabase
        .from('chat_questions')
        .select('question, tool_id')
        .order('created_at', { ascending: true })
        .limit(50);
      setPredefinedQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const subscribeToRealtime = () => {
    if (!user) return;
    
    const channel = supabase
      .channel(`chat_sessions_${user.uid}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_sessions',
        filter: `suid=eq.${user.uid}`,
      }, (payload) => {
        setSessions(prev => [payload.new as ChatSession, ...prev]);
        setDailyMessageCount(prev => prev + 1);
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_sessions',
        filter: `suid=eq.${user.uid}`,
      }, (payload) => {
        setSessions(prev => prev.map(s => s.id === payload.new.id ? payload.new as ChatSession : s));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const sendMessage = async (msg?: string, tools?: string[]) => {
    const messageToSend = msg || message.trim();
    if (!messageToSend || isSending || !user) return;
    
    if (dailyMessageCount >= dailyLimit) {
      setShowUpgradeDialog(true);
      return;
    }

    setIsSending(true);
    if (!msg) setMessage('');

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: messageToSend,
          tools: tools || [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Error: ${error}`);
    } finally {
      setIsSending(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const formatStockName = (rawName: string) => {
    let name = rawName.toUpperCase();
    if (name.startsWith('NSE:')) name = name.substring(4);
    if (name.startsWith('BSE:')) name = name.substring(4);
    name = name.replace(/-EQ$/, '').replace(/-BZ$/, '');
    return name.trim();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-sm w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Welcome to OptionXI AI
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to start chatting with AI about market insights
            </p>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <Image src="/assets/svgs/google.svg" alt="Google" width={20} height={20} className="mr-3" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  const percentage = dailyMessageCount / dailyLimit;
  const statusColor = percentage >= 1 
    ? 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
    : percentage > 0.7 
    ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' 
    : 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Quota Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusColor}`}>
            <Bolt className="w-4 h-4" />
            <span className="text-sm font-bold">
              {dailyMessageCount} / {dailyLimit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                setIsLoading(true);
                fetchHistory();
                fetchPredefinedQuestions();
                fetchDailyUsage();
              }}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {!isPremium && (
              <button 
                onClick={() => setShowUpgradeDialog(true)}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Upgrade
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-7xl mx-auto w-full min-h-0">
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6" ref={scrollRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <MessageSquare className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Ask me anything about the market
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                Start a conversation to get AI-powered market insights and stock analysis
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-4">
              {sessions.map((session) => (
                <ChatBubble key={session.id} session={session} formatStockName={formatStockName} />
              ))}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        {predefinedQuestions.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 md:px-6 py-3 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-7xl mx-auto">
              {predefinedQuestions.slice(0, 5).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q.question, q.tool_id)}
                  className="flex-shrink-0 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="line-clamp-1">{q.question}</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </button>
              ))}
              {predefinedQuestions.length > 5 && (
                <button
                  onClick={() => setShowAllQuestions(true)}
                  className="flex-shrink-0 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                >
                  View More
                  <List className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 md:p-6 flex-shrink-0">
          <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask a question about stocks..."
              disabled={isSending}
              className="flex-1 px-4 md:px-5 py-3 bg-slate-100 dark:bg-slate-700 rounded-full border-0 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 transition-all"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isSending || !message.trim()}
              className="p-3 md:p-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-full transition-colors disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* All Questions Drawer */}
      {showAllQuestions && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={() => setShowAllQuestions(false)}
        >
          <div 
            className="bg-white dark:bg-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">All Questions</h2>
              <button 
                onClick={() => setShowAllQuestions(false)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
              {predefinedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowAllQuestions(false);
                    sendMessage(q.question, q.tool_id);
                  }}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-left flex items-center gap-3"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{q.question}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Dialog */}
      {showUpgradeDialog && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowUpgradeDialog(false)}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Upgrade to Premium</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Get 300 messages per day and exclusive market insights with premium access.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeDialog(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUpgradeDialog(false);
                  // Navigate to upgrade page or show contact options
                }}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatBubble({ session, formatStockName }: { session: ChatSession; formatStockName: (name: string) => string }) {
  const [showAllStocks, setShowAllStocks] = useState(false);
  const isCompleted = session.status === 'completed';
  const isError = session.status === 'error';
  const stocks = session.stocks || [];
  const tools = session.tools || [];
  const createdAt = new Date(session.created_at);

  const visibleStocks = showAllStocks ? stocks : stocks.slice(0, 3);
  const hiddenCount = stocks.length - 3;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 shadow-sm">
      {/* User Message */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-4 h-4 text-white" />
        </div>
        <p className="flex-1 text-slate-900 dark:text-white font-semibold text-sm md:text-base">{session.message}</p>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

      {/* AI Response */}
      {isCompleted && session.result ? (
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({...props}) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700" {...props} />
                </div>
              ),
              thead: ({ ...props}) => (
                <thead className="bg-slate-50 dark:bg-slate-700/50" {...props} />
              ),
              th: ({...props}) => (
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider" {...props} />
              ),
              td: ({ ...props}) => (
                <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700" {...props} />
              ),
              tr: ({...props}) => (
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30" {...props} />
              ),
            }}
          >
            {session.result}
          </ReactMarkdown>
        </div>
      ) : (
        <div className={`p-4 rounded-lg border ${isError ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isError ? (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 flex-shrink-0" />
            )}
            <span className={`text-sm font-semibold ${isError ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {session.status_message || 'Processing...'}
            </span>
          </div>
          {!isError && session.progress !== undefined && (
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-3">
              <div
                className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(session.progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Stocks */}
      {stocks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Mentioned Stocks</h3>
          <div className="space-y-2">
            {visibleStocks.map((stock, idx) => {
              const formattedName = formatStockName(stock);
              return (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-lg flex-shrink-0 overflow-hidden">
                    <img 
                      src={`/assets/stockimages/${formattedName}.png`}
                      alt={formattedName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/logo_xi.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{formattedName}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{stock}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </button>
              );
            })}
          </div>
          {stocks.length > 3 && (
            <button
              onClick={() => setShowAllStocks(!showAllStocks)}
              className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mx-auto"
            >
              {showAllStocks ? 'Show Less' : `Show ${hiddenCount} More`}
              {showAllStocks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex gap-2 flex-wrap">
          {tools.map((tool, idx) => (
            <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
              {tool}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-end gap-0.5 text-slate-500 dark:text-slate-400">
          <span>{format(createdAt, 'hh:mm a')}</span>
          <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}