"use client";

import React, { useState } from 'react';
import { Send, Users, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function AdminPage() {
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; sentCount?: number } | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Load subscriber count on component mount (only if authenticated)
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriberCount();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch('/api/waitlist', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubscriberCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch subscriber count:', error);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !htmlContent || isSending) return;

    setIsSending(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'your-admin-token'}`,
        },
        body: JSON.stringify({
          subject,
          html: htmlContent,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setSubject('');
        setHtmlContent('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send email. Please try again.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const sampleEmailTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0B0B45 0%, #1E3ECF 100%); color: white; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #FFE066; font-size: 28px; margin: 0;">Jamm Update!</h1>
    <p style="color: #ccc; font-size: 16px; margin: 10px 0;">Exciting news from the Jamm team</p>
  </div>
  
  <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #FFE066; font-size: 20px; margin-top: 0;">Your update content here</h2>
    <p style="line-height: 1.6;">Add your message content here...</p>
  </div>
  
  <div style="text-align: center; margin-top: 30px;">
    <p style="color: #ccc; font-size: 14px;">Thank you for being part of the Jamm community!</p>
    <p style="color: #FFE066; font-size: 14px; font-weight: bold;">- The Jamm Team</p>
  </div>
</div>`;

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#0B0B45] to-[#1E3ECF] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <Mail className="h-12 w-12 text-[#FFE066] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
              <p className="text-white/70 text-sm">
                Enter the admin password to access the dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#FFE066] focus:border-transparent"
                />
              </div>

              {authError && (
                <div className="text-red-400 text-sm text-center">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFE066] to-[#1E3ECF] text-[#0B0B45] font-bold py-3 px-6 rounded-lg shadow-md hover:from-[#FFF6B0] hover:to-[#3B5BDB] transition"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0B0B45] to-[#1E3ECF] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-[#FFE066]" />
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-[#FFE066]" />
                <div>
                  <p className="text-white/70 text-sm">Total Subscribers</p>
                  <p className="text-2xl font-bold text-white">{subscriberCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-[#FFE066]" />
                <div>
                  <p className="text-white/70 text-sm">Active Subscribers</p>
                  <p className="text-2xl font-bold text-white">{subscriberCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <Send className="h-6 w-6 text-[#FFE066]" />
                <div>
                  <p className="text-white/70 text-sm">Last Sent</p>
                  <p className="text-lg font-semibold text-white">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSendEmail} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                required
                disabled={isSending}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#FFE066] focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="htmlContent" className="block text-sm font-medium text-white mb-2">
                Email Content (HTML)
              </label>
              <textarea
                id="htmlContent"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Enter HTML email content..."
                required
                disabled={isSending}
                rows={12}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#FFE066] focus:border-transparent disabled:opacity-50 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setHtmlContent(sampleEmailTemplate)}
                className="mt-2 text-sm text-[#FFE066] hover:text-[#FFF6B0] transition-colors"
              >
                Use sample template
              </button>
            </div>

            <button
              type="submit"
              disabled={isSending || !subject || !htmlContent}
              className="w-full bg-gradient-to-r from-[#FFE066] to-[#1E3ECF] text-[#0B0B45] font-bold py-3 px-6 rounded-lg shadow-md hover:from-[#FFF6B0] hover:to-[#3B5BDB] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0B0B45] border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send to All Subscribers
                </>
              )}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-500/20 border-green-500/30' 
                : 'bg-red-500/20 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
                <p className={`font-medium ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.message}
                </p>
              </div>
              {result.sentCount !== undefined && (
                <p className="text-white/70 text-sm mt-1">
                  Successfully sent to {result.sentCount} subscribers
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
