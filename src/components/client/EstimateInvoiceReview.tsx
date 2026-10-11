'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  CheckCircle2,
  Download,
  CreditCard,
  ShieldCheck,
  PenTool,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface EstimateInvoiceReviewProps {
  clientName?: string;
  totalContractValue?: number;
}

export function EstimateInvoiceReview({
  clientName = 'David & Amanda Miller',
  totalContractValue = 22400,
}: EstimateInvoiceReviewProps) {
  const [isSigned, setIsSigned] = useState(false);
  const [signedTimestamp, setSignedTimestamp] = useState<string | null>(null);
  const [signatureName, setSignatureName] = useState('David Miller');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Insurance scope breakdown
  const insuranceDeductible = 1000;
  const insuranceCoveredAmount = totalContractValue - insuranceDeductible; // $21,400
  const initialDepositPaid = 11200; // 50%
  const remainingHomeownerBalance = 1000; // Deductible amount due on completion

  const scopeItems = [
    {
      title: 'Tear-off existing 3-tab shingles',
      detail: 'Complete removal of 32 Squares down to bare plywood decking. Debris cleanup & haul-away included.',
      cost: '$4,800.00',
    },
    {
      title: 'Architectural Shingles (Class 4 Impact Resistant)',
      detail: 'GAF Timberline HDZ in Weathered Wood with 130 MPH high-wind nail pattern and manufacturer Golden Pledge warranty.',
      cost: '$12,400.00',
    },
    {
      title: 'Ice & Water Shield & Synthetic Felt Underlayment',
      detail: 'GAF WeatherWatch self-adhering membrane in all valleys & roof penetrations; Tiger Paw synthetic underlayment over entire roof field.',
      cost: '$3,200.00',
    },
    {
      title: 'Ventilation & Flashing System',
      detail: 'Continuous white aluminum drip edge perimeter, Cobra ridge vents, and new pipe flashing rubber boots.',
      cost: '$2,000.00',
    },
  ];

  const handleApproveAndSign = async () => {
    setIsSigned(true);
    const now = new Date();
    setSignedTimestamp(
      now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' at ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' CDT'
    );

    // Live Supabase Sync
    const { saveClientInvoiceApproval } = await import('@/lib/roofingService');
    saveClientInvoiceApproval('job-plano', 'INV-2026-4410', signatureName, totalContractValue);
  };

  const handleMockPayment = () => {
    setShowPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentSuccess(false);
      alert('Mock Payment Processed: $1,000.00 Texas Deductible paid via Visa •••• 4242.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Scope Breakdown Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base sm:text-lg">
                  Itemized Scope of Work & Insurance Estimate
                </CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">
                Estimate #EST-2026-4410 • Approved for State Farm Texas Claim #STF-992140
              </CardDescription>
            </div>

            <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
              32 Roofing Squares
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-5">
          {/* Itemized Line Items */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {scopeItems.map((item) => (
              <div key={item.title} className="py-3.5 first:pt-0 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <span className="font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 shrink-0">
                  {item.cost}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals Box */}
          <div className="bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span>Total Contract Scope:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                ${totalContractValue.toLocaleString()}.00
              </span>
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> State Farm Insurance Allowance:
              </span>
              <span className="font-mono font-semibold">
                -${insuranceCoveredAmount.toLocaleString()}.00
              </span>
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span>Homeowner Policy Deductible:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                ${insuranceDeductible.toLocaleString()}.00
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 block">
                  Remaining Homeowner Out-of-Pocket Balance
                </span>
                <span className="text-[11px] text-slate-400">
                  (Includes standard deductible due on completion)
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                ${remainingHomeownerBalance.toLocaleString()}.00
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Sign-off Module */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <PenTool className="w-5 h-5 text-emerald-600" />
            Homeowner Approval & Digital Sign-Off
          </CardTitle>
          <CardDescription className="text-xs">
            Review and digitally approve scope specifications and Class 4 impact warranty transfer
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
          {!isSigned ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Type Homeowner Full Name to Sign:
                </label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  By clicking approve below, you confirm agreement to the scope, shingle color choice (Weathered Wood), and deductible terms.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleApproveAndSign}
                  className="h-11 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve Scope & Sign Digitally
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Approved Confirmation Banner */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 flex items-start space-x-3.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                      Approved by Homeowner
                    </span>
                    <Badge variant="success" className="text-[10px]">Verified Signature</Badge>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    Digitally signed by <strong className="text-slate-900 dark:text-white">{signatureName}</strong> on {signedTimestamp}.
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                    Apex Roofing Operations has been notified. GAF 50-year warranty transfer locked.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Mock PDF Download & Pay Now */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => alert('Downloading official PDF estimate: EST-2026-4410-Signed.pdf')}
                  className="h-11 flex-1 text-xs sm:text-sm font-semibold"
                >
                  <Download className="w-4 h-4 mr-2 text-slate-500" />
                  Download Signed Scope (PDF)
                </Button>

                <Button
                  onClick={handleMockPayment}
                  className="h-11 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {showPaymentSuccess ? 'Processing Card...' : 'Pay Remaining Deductible ($1,000)'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
