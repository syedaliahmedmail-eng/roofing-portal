'use client';

import React, { useState } from 'react';
import { RoofJob } from '@/types/roofing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  DollarSign,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Flame,
  Building,
  User,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';

interface KanbanColumn {
  id: RoofJob['status'];
  title: string;
  badgeColor: string;
  headerBorder: string;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'new_lead',
    title: 'New Lead',
    badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    headerBorder: 'border-slate-400',
  },
  {
    id: 'inspection_scheduled',
    title: 'Inspection Scheduled',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    headerBorder: 'border-blue-500',
  },
  {
    id: 'estimate_sent',
    title: 'Estimate Sent',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    headerBorder: 'border-purple-500',
  },
  {
    id: 'in_progress',
    title: 'Job In Progress',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    headerBorder: 'border-amber-500',
  },
  {
    id: 'completed',
    title: 'Completed',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    headerBorder: 'border-emerald-500',
  },
  {
    id: 'invoiced_closed',
    title: 'Invoiced / Closed',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
    headerBorder: 'border-teal-500',
  },
];

interface JobPipelineKanbanProps {
  jobs: RoofJob[];
  onJobClick?: (job: RoofJob) => void;
  onMoveJobStatus?: (jobId: string, newStatus: RoofJob['status']) => void;
}

export function JobPipelineKanban({ jobs, onJobClick, onMoveJobStatus }: JobPipelineKanbanProps) {
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterClaim, setFilterClaim] = useState<string>('all');

  const filteredJobs = jobs.filter((job) => {
    if (filterCity !== 'all' && job.address.city !== filterCity) return false;
    if (filterClaim !== 'all' && job.claimType !== filterClaim) return false;
    return true;
  });

  const getClaimBadge = (claimType: RoofJob['claimType']) => {
    switch (claimType) {
      case 'Insurance Claim - Hail/Wind':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Flame className="w-3 h-3 text-amber-500" /> Hail/Wind Claim
          </span>
        );
      case 'Retail / Out-of-Pocket':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <User className="w-3 h-3 text-emerald-500" /> Retail / Cash
          </span>
        );
      case 'Commercial Flat Replacement':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Building className="w-3 h-3 text-blue-500" /> Commercial Flat
          </span>
        );
      case 'Emergency Tarp / Storm Repair':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <ShieldAlert className="w-3 h-3 text-red-500" /> Emergency Storm
          </span>
        );
      default:
        return null;
    }
  };

  const getNextStatus = (current: RoofJob['status']): RoofJob['status'] | null => {
    const order: RoofJob['status'][] = [
      'new_lead',
      'inspection_scheduled',
      'estimate_sent',
      'in_progress',
      'completed',
      'invoiced_closed',
    ];
    const idx = order.indexOf(current);
    if (idx !== -1 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStatus = (current: RoofJob['status']): RoofJob['status'] | null => {
    const order: RoofJob['status'][] = [
      'new_lead',
      'inspection_scheduled',
      'estimate_sent',
      'in_progress',
      'completed',
      'invoiced_closed',
    ];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Kanban Filters & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter By:
          </span>

          {/* City Filter */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All DFW Metros</option>
            <option value="Dallas">Dallas</option>
            <option value="Fort Worth">Fort Worth</option>
            <option value="Plano">Plano</option>
            <option value="Coppell">Coppell</option>
            <option value="Frisco">Frisco</option>
            <option value="Arlington">Arlington</option>
          </select>

          {/* Claim Type Filter */}
          <select
            value={filterClaim}
            onChange={(e) => setFilterClaim(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Claim Types</option>
            <option value="Insurance Claim - Hail/Wind">Hail / Wind Claims</option>
            <option value="Retail / Out-of-Pocket">Retail / Cash</option>
            <option value="Commercial Flat Replacement">Commercial Flat</option>
            <option value="Emergency Tarp / Storm Repair">Emergency Repairs</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>Showing <strong>{filteredJobs.length}</strong> of {jobs.length} DFW Projects</span>
        </div>
      </div>

      {/* Horizontal Scrolling Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const colJobs = filteredJobs.filter((job) => job.status === col.id);
          const colTotalValue = colJobs.reduce((sum, j) => sum + j.totalContractValue, 0);

          return (
            <div
              key={col.id}
              className="flex flex-col bg-slate-100/80 dark:bg-slate-900/50 rounded-xl border border-slate-200/90 dark:border-slate-800 min-h-[480px] p-2.5"
            >
              {/* Column Header */}
              <div className={`pb-2.5 mb-2.5 border-b-2 ${col.headerBorder} flex items-center justify-between`}>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {col.title}
                  </h4>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 font-medium">
                    ${(colTotalValue / 1000).toFixed(1)}k Pipeline
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                  {colJobs.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-2.5 flex-1">
                {colJobs.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-3 text-center text-xs text-slate-400">
                    <span>No jobs in this phase</span>
                  </div>
                ) : (
                  colJobs.map((job) => {
                    const prevStatus = getPrevStatus(job.status);
                    const nextStatus = getNextStatus(job.status);

                    return (
                      <Card
                        key={job.id}
                        className="p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer hover:border-amber-400 dark:hover:border-amber-500/50 group"
                        onClick={() => onJobClick && onJobClick(job)}
                      >
                        <div className="space-y-2">
                          {/* Top Row: Job Number & Claim Badge */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[10px] text-slate-400 font-bold">
                              {job.jobNumber}
                            </span>
                            {getClaimBadge(job.claimType)}
                          </div>

                          {/* Homeowner & Address */}
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition leading-tight">
                              {job.clientName}
                            </h5>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{job.address.street}, {job.address.city}</span>
                            </div>
                          </div>

                          {/* Roof Specs & Pitch */}
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg text-[10px] text-slate-600 dark:text-slate-300 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-slate-500">Roofing System:</span>
                              <span className="font-bold truncate max-w-[110px]">{job.roofType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-slate-500">Size / Pitch:</span>
                              <span className="font-bold">
                                {job.squareFootage / 100} Sq • {job.pitch}
                              </span>
                            </div>
                            {job.insuranceCarrier && (
                              <div className="flex justify-between items-center text-amber-700 dark:text-amber-400">
                                <span className="font-medium">Carrier:</span>
                                <span className="font-semibold truncate max-w-[110px]">{job.insuranceCarrier}</span>
                              </div>
                            )}
                          </div>

                          {/* Contract Value & Progress */}
                          <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              ${job.totalContractValue.toLocaleString()}
                            </span>
                            {job.status === 'in_progress' ? (
                              <span className="text-[10px] font-bold text-amber-600">
                                {job.progressPercent}% Active
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                {job.crewLeaderName ? `Crew: ${job.crewLeaderName.split(' ')[0]}` : 'Unassigned'}
                              </span>
                            )}
                          </div>

                          {/* Fast Move Pipeline Buttons */}
                          {onMoveJobStatus && (
                            <div
                              className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {prevStatus ? (
                                <button
                                  type="button"
                                  onClick={() => onMoveJobStatus(job.id, prevStatus)}
                                  className="text-[10px] text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="Move to previous stage"
                                >
                                  <ChevronLeft className="w-3 h-3" /> Back
                                </button>
                              ) : <span />}

                              {nextStatus ? (
                                <button
                                  type="button"
                                  onClick={() => onMoveJobStatus(job.id, nextStatus)}
                                  className="text-[10px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center p-1 rounded hover:bg-amber-50 dark:hover:bg-amber-950/60"
                                  title="Advance to next stage"
                                >
                                  Advance <ChevronRight className="w-3 h-3" />
                                </button>
                              ) : (
                                <span className="text-[9px] text-emerald-600 font-bold">Closed</span>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
