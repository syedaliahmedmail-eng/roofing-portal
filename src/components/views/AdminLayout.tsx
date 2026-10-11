'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { COMPANY_INFO, MOCK_JOBS as INITIAL_JOBS, MOCK_CREW, MOCK_INVOICES } from '@/data/mockRoofingData';
import { RoofJob } from '@/types/roofing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobPipelineKanban } from '@/components/admin/JobPipelineKanban';
import { JobDetailModal } from '@/components/admin/JobDetailModal';
import {
  LayoutDashboard,
  KanbanSquare,
  CalendarDays,
  Receipt,
  Settings,
  Bell,
  Search,
  Building2,
  DollarSign,
  Users,
  Hammer,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Flame,
  ShieldCheck,
  Filter,
} from 'lucide-react';

export function AdminLayout() {
  const { activeTab, setActiveTab } = useRole();
  const [jobs, setJobs] = useState<RoofJob[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<RoofJob | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Live Supabase Sync on Mount
  React.useEffect(() => {
    import('@/lib/roofingService').then(({ getJobs }) => {
      getJobs().then((fetchedJobs) => {
        if (fetchedJobs && fetchedJobs.length > 0) {
          setJobs(fetchedJobs);
        }
      });
    });
  }, []);

  const handleMoveJobStatus = (jobId: string, newStatus: RoofJob['status']) => {
    // Optimistic UI update
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // Persist to Supabase
    import('@/lib/roofingService').then(({ updateJobStatus }) => {
      updateJobStatus(jobId, newStatus);
    });
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
    { label: 'Leads Kanban', icon: KanbanSquare, badge: `${jobs.filter(j => j.status === 'new_lead').length} New` },
    { label: 'Dispatch Calendar', icon: CalendarDays, badge: '2 Active' },
    { label: 'Invoices', icon: Receipt, badge: '1 Due' },
    { label: 'Settings', icon: Settings, badge: undefined },
  ];

  const totalContractRevenue = jobs.reduce((acc, job) => acc + job.totalContractValue, 0);
  const activeJobsCount = jobs.filter((j) => j.status === 'in_progress' || j.status === 'inspection_scheduled').length;
  const crewOnDuty = MOCK_CREW.filter((c) => c.checkInStatus === 'checked_in').length;
  const hailWindClaimsCount = jobs.filter((j) => j.claimType === 'Insurance Claim - Hail/Wind').length;

  const filteredJobsBySearch = jobs.filter((j) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      j.clientName.toLowerCase().includes(q) ||
      j.jobNumber.toLowerCase().includes(q) ||
      j.address.city.toLowerCase().includes(q) ||
      j.address.street.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex pb-28 md:pb-24">
      {/* Desktop-first Left Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col shrink-0">
        {/* Branding Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {COMPANY_INFO.location}
            </p>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase px-3 py-2">
            Operations Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Operator Quick Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>TX-RCL #{COMPANY_INFO.license}</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="md:hidden flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white">Apex Dallas</span>
            </div>

            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job #, homeowner, city..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border-0 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="warning" className="hidden sm:inline-flex gap-1 items-center">
              <AlertTriangle className="w-3 h-3 text-amber-600" /> DFW Weather Alert: Hail storm report active
            </Badge>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </Button>
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                OP
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Dallas Dispatcher</div>
                <div className="text-slate-400">Headquarters</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View by Tab */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {activeTab === 'Dashboard' ? 'Dallas Operations Command' : activeTab}
                </h2>
                <Badge variant="secondary">Admin Console</Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Commercial & Residential roofing dispatch across Dallas, Fort Worth, Plano, Coppell & Frisco.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm"
                onClick={() => setActiveTab('Leads Kanban')}
              >
                <Plus className="w-4 h-4 mr-1" /> New Roofing Lead
              </Button>
            </div>
          </div>

          {/* High Level Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active DFW Pipeline</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    ${(totalContractRevenue / 1000).toFixed(1)}k
                  </h3>
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> {jobs.length} tracked projects
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
                  <DollarSign className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Field Operations</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeJobsCount} Jobs</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Lakewood, Coppell & Arlington</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
                  <Hammer className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Hail & Storm Claims</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{hailWindClaimsCount} Claims</h3>
                  <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1 font-medium">
                    <Flame className="w-3 h-3" /> State Farm, USAA, Allstate
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Field Crews On Duty</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {crewOnDuty} Leads & Techs
                  </h3>
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> 100% Safety Compliance
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TAB 1: Leads Kanban Pipeline (Primary Phase 2 Deliverable) */}
          {activeTab === 'Leads Kanban' && (
            <div className="space-y-4">
              <JobPipelineKanban
                jobs={filteredJobsBySearch}
                onJobClick={(job) => setSelectedJob(job)}
                onMoveJobStatus={handleMoveJobStatus}
              />
            </div>
          )}

          {/* TAB 2: Dashboard View */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              {/* Quick Jump to Full Kanban */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-lg">
                    <KanbanSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      6-Stage Lead & Job Kanban Pipeline
                    </h4>
                    <p className="text-xs text-slate-500">
                      Manage all 8 live DFW roofing projects across New Lead, Inspection, Estimate, In Progress, Completed, and Invoiced.
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setActiveTab('Leads Kanban')}>
                  Open Pipeline <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Jobs Queue */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <div>
                        <CardTitle>DFW Roofing Jobs Overview</CardTitle>
                        <CardDescription>Real-time progress, pitch & materials on job sites</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setActiveTab('Leads Kanban')}
                      >
                        View Kanban ({jobs.length}) <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredJobsBySearch.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                          onClick={() => setSelectedJob(job)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                  {job.clientName}
                                </span>
                                <span className="text-xs font-mono text-slate-400">{job.jobNumber}</span>
                                <Badge
                                  variant={
                                    job.status === 'in_progress'
                                      ? 'warning'
                                      : job.status === 'completed'
                                      ? 'success'
                                      : 'secondary'
                                  }
                                >
                                  {job.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{job.address.street}, {job.address.city}, {job.address.state}</span>
                                <span>•</span>
                                <span>{job.roofType} ({job.pitch} pitch)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                ${job.totalContractValue.toLocaleString()}
                              </span>
                              <div className="text-[11px] text-slate-400">
                                Crew: {job.crewLeaderName || 'Unassigned'}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span>Installation Progress</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {job.progressPercent}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${job.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Crew Status & Live Dispatch */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Field Crews Status</CardTitle>
                      <CardDescription>GPS live check-in & safety certs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {MOCK_CREW.map((crew) => (
                        <div
                          key={crew.id}
                          className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-start justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-xs text-slate-900 dark:text-white">{crew.name}</span>
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                {crew.role}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-500" />
                              {crew.currentLocation}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crew.certifications.slice(0, 2).map((cert: string) => (
                                <span
                                  key={cert}
                                  className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {crew.lastCheckInTime}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Dispatch Calendar */}
          {activeTab === 'Dispatch Calendar' && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Dallas Roofing Dispatch Calendar</CardTitle>
                <CardDescription>Crew assignments, dumpster drops, and material load schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {['Mon - Oct 12', 'Tue - Oct 13', 'Wed - Oct 14', 'Thu - Oct 15', 'Fri - Oct 16'].map((day, i) => (
                    <div key={day} className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 min-h-[160px]">
                      <div className="text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                        {day}
                      </div>
                      <div className="mt-2 space-y-2 text-xs">
                        <div className="bg-amber-100/70 dark:bg-amber-950/50 p-2 rounded text-[11px] text-amber-900 dark:text-amber-300">
                          <strong>Tear-Off:</strong> Lakewood Blvd ({jobs[0].squareFootage} sq ft)
                        </div>
                        {i === 2 && (
                          <div className="bg-blue-100/70 dark:bg-blue-950/50 p-2 rounded text-[11px] text-blue-900 dark:text-blue-300">
                            <strong>Crane Delivery:</strong> Coppell Commercial TPO
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 4: Invoices */}
          {activeTab === 'Invoices' && (
            <Card>
              <CardHeader>
                <CardTitle>Accounts Receivable & Job Billing</CardTitle>
                <CardDescription>Texas residential draws & material supplier invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <th className="pb-3 font-semibold">Invoice #</th>
                        <th className="pb-3 font-semibold">Client</th>
                        <th className="pb-3 font-semibold">Issue Date</th>
                        <th className="pb-3 font-semibold">Due Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {MOCK_INVOICES.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-3 font-mono font-medium">{inv.invoiceNumber}</td>
                          <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{inv.clientName}</td>
                          <td className="py-3 text-slate-500">{inv.issueDate}</td>
                          <td className="py-3 text-slate-500">{inv.dueDate}</td>
                          <td className="py-3">
                            <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>
                              {inv.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 text-right font-bold">${inv.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: Settings */}
          {activeTab === 'Settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Apex Roofing Systems - Company Operations Settings</CardTitle>
                <CardDescription>Dallas headquarters license, warranty defaults & notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="font-semibold text-slate-900 dark:text-white">Texas Contractor Registration</div>
                  <div className="text-slate-500 mt-1">{COMPANY_INFO.license} • Bonded & Insured up to $2,000,000 General Liability</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="font-semibold text-slate-900 dark:text-white">Service Area Metros</div>
                  <div className="text-slate-500 mt-1">{COMPANY_INFO.servingAreas.join(', ')}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateStatus={handleMoveJobStatus}
      />
    </div>
  );
}
