'use client';

import React from 'react';
import { RoofJob } from '@/types/roofing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Layers,
  HardHat,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface JobDetailModalProps {
  job: RoofJob | null;
  onClose: () => void;
  onUpdateStatus?: (jobId: string, newStatus: RoofJob['status']) => void;
}

export function JobDetailModal({ job, onClose, onUpdateStatus }: JobDetailModalProps) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                {job.jobNumber}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {job.claimType}
              </span>
            </div>
            <h3 className="text-xl font-bold">{job.clientName}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {job.address.street}, {job.address.city}, {job.address.state} {job.address.zip}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Contract Value</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                ${job.totalContractValue.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Roof Area</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {job.squareFootage / 100} Sq ({job.pitch})
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Crew Assigned</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white truncate block">
                {job.crewLeaderName ? job.crewLeaderName.split(' ')[0] : 'None'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Completion %</span>
              <span className="text-base font-extrabold text-amber-600">
                {job.progressPercent}%
              </span>
            </div>
          </div>

          {/* Homeowner & Insurance Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <FileText className="w-3.5 h-3.5 text-blue-500" /> Homeowner Contact
              </h4>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${job.clientPhone}`} className="text-blue-600 hover:underline">
                    {job.clientPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.clientEmail}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Shield className="w-3.5 h-3.5 text-amber-500" /> Insurance Scope Info
              </h4>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-medium text-slate-500">Carrier:</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {job.insuranceCarrier || 'Direct Client / Cash'}
                  </span>
                </div>
                {job.insuranceClaimNumber && (
                  <div>
                    <span className="font-medium text-slate-500">Claim #:</span>{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {job.insuranceClaimNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Roofing Materials Specification */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5 text-amber-600" /> Roofing System Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
              <div>
                <span className="text-slate-400 block text-[10px]">System Type:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{job.roofType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Material / Shingle:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {job.shingleBrand || 'Standard Architectural'} {job.shingleColor && `(${job.shingleColor})`}
                </span>
              </div>
            </div>
            {job.scopeNotes && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Estimator Scope Notes:</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">{job.scopeNotes}</p>
              </div>
            )}
          </div>

          {/* Stage Fast Switcher */}
          {onUpdateStatus && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Change Pipeline Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'new_lead', label: 'New Lead' },
                  { id: 'inspection_scheduled', label: 'Inspection Scheduled' },
                  { id: 'estimate_sent', label: 'Estimate Sent' },
                  { id: 'in_progress', label: 'Job In Progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'invoiced_closed', label: 'Invoiced / Closed' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      onUpdateStatus(job.id, st.id as RoofJob['status']);
                    }}
                    className={`px-3 py-2 text-xs rounded-lg font-semibold transition border ${
                      job.status === st.id
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Target Completion: {job.targetCompletionDate}
          </div>
          <Button onClick={onClose} size="sm">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
