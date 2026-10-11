'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import {
  COMPANY_INFO,
  MOCK_JOBS,
  MOCK_CREW,
  MOCK_INSPECTION_PHOTOS,
  MOCK_MATERIALS,
} from '@/data/mockRoofingData';
import { PhotoInspection } from '@/types/roofing';
import { GpsCheckInCard } from '@/components/crew/GpsCheckInCard';
import { PhotoInspectionUploader } from '@/components/crew/PhotoInspectionUploader';
import { MaterialsChecklist } from '@/components/crew/MaterialsChecklist';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  MapPin,
  Camera,
  Boxes,
  HardHat,
  Phone,
  Navigation,
  FileCheck,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';

export function CrewLayout() {
  const { activeTab, setActiveTab } = useRole();
  const [photos, setPhotos] = useState<PhotoInspection[]>(MOCK_INSPECTION_PHOTOS);

  // Active Job: 742 Evergreen Terrace, Plano, TX (32 Squares, Tear-off & Install)
  const currentJob = MOCK_JOBS[0];
  const leadMember = MOCK_CREW[0];

  const handleAddPhoto = (newPhoto: PhotoInspection) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const navItems = [
    { label: 'My Jobs', icon: Briefcase, badge: undefined },
    { label: 'GPS Check-in', icon: MapPin, badge: 'Live' },
    { label: 'Upload Photos', icon: Camera, badge: `${photos.length}` },
    { label: 'Materials', icon: Boxes, badge: 'Staged' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col pb-36">
      {/* Mobile-first Header Bar (PWA Feel) */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-30 shadow-md border-b border-slate-800">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {COMPANY_INFO.name}
                </span>
                <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.2 rounded">
                  PWA Field
                </span>
              </div>
              <h1 className="text-xs font-bold truncate text-white">
                {leadMember.name} • Plano Crew Lead
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              On-Site
            </span>
          </div>
        </div>
      </header>

      {/* Main Single Column Mobile Container */}
      <main className="p-3.5 sm:p-4 max-w-md mx-auto w-full space-y-4">
        {/* Tab 1: My Jobs */}
        {activeTab === 'My Jobs' && (
          <div className="space-y-4">
            <GpsCheckInCard job={currentJob} />

            <div className="pt-1 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Today&apos;s Dispatch Queue
              </h3>
              <Badge variant="outline" className="text-[10px]">
                {MOCK_JOBS.slice(0, 2).length} Work Orders
              </Badge>
            </div>

            {MOCK_JOBS.slice(0, 2).map((job) => (
              <Card key={job.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-3.5 pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold">{job.clientName}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {job.address.street}, {job.address.city}, TX
                      </CardDescription>
                    </div>
                    <Badge variant={job.status === 'in_progress' ? 'warning' : 'secondary'} className="text-[10px]">
                      {job.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3.5 pt-1 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Area / Pitch</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {job.squareFootage / 100} Sq ({job.pitch})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Target Date</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{job.targetCompletionDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => alert(`Calling homeowner: ${job.clientPhone}`)}
                    >
                      <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Call
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setActiveTab('Upload Photos')}
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" /> Photos ({photos.length})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: GPS Check-in Dedicated View */}
        {activeTab === 'GPS Check-in' && (
          <div className="space-y-4">
            <GpsCheckInCard job={currentJob} />

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Daily Crew Roster & Sign-In
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-2.5 text-xs">
                {MOCK_CREW.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{member.name}</div>
                      <div className="text-[10px] text-slate-400">{member.role}</div>
                    </div>
                    <Badge variant="success" className="text-[9px]">
                      {member.checkInStatus === 'checked_in' ? 'On Site' : 'En Route'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Upload Photos (Before / During / After) */}
        {activeTab === 'Upload Photos' && (
          <PhotoInspectionUploader photos={photos} onAddPhoto={handleAddPhoto} />
        )}

        {/* Tab 4: Materials */}
        {activeTab === 'Materials' && (
          <MaterialsChecklist initialMaterials={MOCK_MATERIALS} />
        )}
      </main>

      {/* Sticky Bottom Navigation Bar (PWA Thumb-friendly) */}
      <nav className="fixed bottom-24 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto rounded-t-2xl shadow-2xl">
        <div className="grid grid-cols-4 px-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 text-[8px] bg-blue-600 text-white font-bold px-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] truncate max-w-full leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
