"use client";

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [urlEmail, setUrlEmail] = useState('');

  // Check for email in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setUrlEmail(emailParam);
      setEmail(emailParam);
    }
  }, []);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isUnsubscribing) return;

    setIsUnsubscribing(true);
    setResult(null);

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0B0B45] to-[#1E3ECF] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[#FFE066] hover:text-[#FFF6B0] transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jamm
            </Link>
            <Mail className="h-12 w-12 text-[#FFE066] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Unsubscribe</h1>
            <p className="text-white/70 text-sm">
              We're sorry to see you go! Enter your email to unsubscribe from Jamm updates.
            </p>
          </div>

          {!result ? (
            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isUnsubscribing}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#FFE066] focus:border-transparent disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isUnsubscribing || !email}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUnsubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Unsubscribing...
                  </>
                ) : (
                  'Unsubscribe'
                )}
              </button>
            </form>
          ) : (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-500/20 border-green-500/30' 
                : 'bg-red-500/20 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
                <p className={`font-medium ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.success ? 'Successfully Unsubscribed' : 'Error'}
                </p>
              </div>
              <p className="text-white/70 text-sm">
                {result.message}
              </p>
              {result.success && (
                <Link 
                  href="/" 
                  className="inline-block mt-4 text-[#FFE066] hover:text-[#FFF6B0] transition-colors text-sm"
                >
                  Return to Jamm
                </Link>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs text-center">
              If you change your mind, you can always resubscribe by joining our waitlist again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

