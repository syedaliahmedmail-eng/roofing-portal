'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Phone,
  Mail,
  Send,
  MessageSquare,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export function ProjectManagerContactCard() {
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pm = {
    name: 'Brett Larson',
    title: 'Senior Project Manager & Field Estimator',
    directPhone: '(214) 555-4920',
    emergencyPhone: '(214) 555-ROOF',
    email: 'b.larson@apexroofing-dallas.com',
    hours: 'Mon - Sat: 6:30 AM – 7:00 PM CDT',
    avatarInitials: 'BL',
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setToastMessage(`Message sent directly to ${pm.name}! We'll text you back within 15 minutes.`);
    setMessage('');

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg">
              Dedicated Project Manager & Emergency Support
            </CardTitle>
          </div>
          <Badge variant="success" className="text-[10px]">Direct Contact</Badge>
        </div>
        <CardDescription className="text-xs">
          Your single point of contact throughout the entire Plano roofing project
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-5">
        {/* PM Profile Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
              {pm.avatarInitials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {pm.name}
                </h4>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                  Available Now
                </span>
              </div>
              <p className="text-xs text-slate-500">{pm.title}</p>
              <div className="text-[10px] text-slate-400 mt-0.5">{pm.hours}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${pm.directPhone}`}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" /> Call {pm.directPhone}
            </a>
            <a
              href={`mailto:${pm.email}`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              title="Send email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Message Project Manager Box */}
        <form onSubmit={handleSendMessage} className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wide">
            Message {pm.name} Directly:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Can you confirm the driveway will be clear by 5 PM?..."
              className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 rounded-xl"
            >
              <Send className="w-3.5 h-3.5 mr-1" /> Send
            </Button>
          </div>
        </form>

        {/* Confirmation Toast */}
        {toastMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 24/7 Storm & Leak Emergency Line */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-amber-900 dark:text-amber-200 font-medium">
              DFW Storm Leak Emergency? 24/7 On-Call Crew:
            </span>
          </div>
          <a
            href={`tel:${pm.emergencyPhone}`}
            className="font-bold text-amber-700 dark:text-amber-300 hover:underline shrink-0"
          >
            {pm.emergencyPhone}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
