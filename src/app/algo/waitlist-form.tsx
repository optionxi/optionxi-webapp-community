'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface FormData {
  name: string;
  email: string;
  mobileNumber: string;
}

interface FormStatus {
  type: 'success' | 'error' | '';
  message: string;
}

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
      callback?: (token: string) => void;  // Extend to include callback function
    };
  }
}

const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobileNumber: ''
  });
  
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [status, setStatus] = useState<FormStatus>({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    if (!turnstileToken) {
      setStatus({ 
        type: 'error', 
        message: 'Please complete the verification.'
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/submit-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'You\'ve been successfully added to the waitlist! We\'ll notify you when access becomes available.'
        });
        setFormData({ name: '', email: '', mobileNumber: '' });
        window.turnstile?.reset();
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to set the callback for Turnstile
  useEffect(() => {
    if (window.turnstile) {
      window.turnstile.callback = (token: string)=> {
        console.log(token)
        setTurnstileToken(token);
      } 
    }
  }, []);

  return (
    <Card className="w-full max-w-lg border-0 shadow-lg dark:shadow-slate-700/10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Join the Waitlist
        </CardTitle>
        <CardDescription className="text-base">
          Get early access to our advanced Algo Trading platform
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit} className='z-10'>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-11 transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber" className="text-sm font-medium">
              Mobile Number
            </Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="h-11 transition-colors"
              placeholder="Your mobile number"
            />
          </div>

          <div className="flex justify-center">
            <div
              className="cf-turnstile"
              data-sitekey="0x4AAAAAAA0nN-rAyzgB8tQA"
              data-theme="auto"
            />
          </div>

          {status.message && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>
                {status.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WaitlistForm;