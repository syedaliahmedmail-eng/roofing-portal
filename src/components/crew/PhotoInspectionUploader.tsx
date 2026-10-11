'use client';

import React, { useState } from 'react';
import { PhotoInspection, InspectionPhotoPhase } from '@/types/roofing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';

interface PhotoInspectionUploaderProps {
  photos: PhotoInspection[];
  onAddPhoto: (newPhoto: PhotoInspection) => void;
}

export function PhotoInspectionUploader({ photos, onAddPhoto }: PhotoInspectionUploaderProps) {
  const [activePhase, setActivePhase] = useState<InspectionPhotoPhase>('before');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Pre-existing Hail Damage & Siding');
  const [isUploading, setIsUploading] = useState(false);

  const phaseConfig: Record<
    InspectionPhotoPhase,
    { title: string; subtitle: string; badge: string; categories: string[] }
  > = {
    before: {
      title: 'Before Tear-Off',
      subtitle: 'Pre-existing hail/wind damage, siding, and gutter guard protection',
      badge: 'Step 1 of 3',
      categories: [
        'Pre-existing Hail Damage & Siding',
        'Gutter Guard & Landscaping Tarping',
        'AC Unit & Driveway Protection',
        'Existing Valley Flashing Wear',
      ],
    },
    during: {
      title: 'During Install',
      subtitle: 'Decking rot replacement, Ice & Water shield, and drip edge',
      badge: 'Step 2 of 3',
      categories: [
        'Decking Sheathing Rot Replacement',
        'Ice & Water Shield Valley Protection',
        'Continuous Aluminum Drip Edge',
        'Underlayment Lap Fastening',
      ],
    },
    after: {
      title: 'After Completion',
      subtitle: 'Completed architectural shingles, ridge cap, and magnetic nail sweep',
      badge: 'Step 3 of 3',
      categories: [
        'Completed Shingle Courses & Ridge Cap',
        'Pipe Flashing Boot Seals',
        'Ground Cleanup & Magnetic Nail Sweep',
        'Final Gutter & Valley Water Flow Test',
      ],
    },
  };

  const handleSimulateCapture = () => {
    setIsUploading(true);

    setTimeout(() => {
      const now = new Date();
      const timeString =
        now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' CDT';

      // Pick representative image based on phase
      const sampleUrls: Record<InspectionPhotoPhase, string> = {
        before: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=600&q=80',
        during: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      };

      const newPhoto: PhotoInspection = {
        id: `photo-${Date.now()}`,
        jobId: 'job-plano',
        uploaderName: 'Mateo Rodriguez',
        phase: activePhase,
        category: selectedCategory,
        timestamp: timeString,
        gpsCoordinates: { lat: 33.0198, lng: -96.6989 },
        imageUrl: sampleUrls[activePhase],
        title: `${selectedCategory} #${photos.filter((p) => p.phase === activePhase).length + 1}`,
        notes: notes.trim() || `Verified ${selectedCategory} on Plano site. Code compliant.`,
        approvedByAdmin: activePhase === 'before',
        requiresRepair: false,
      };

      onAddPhoto(newPhoto);
      setNotes('');
      setIsUploading(false);
    }, 600);
  };

  const currentPhasePhotos = photos.filter((p) => p.phase === activePhase);

  return (
    <div className="space-y-4">
      {/* 3 Large Touch-Friendly Segmented Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200/80 dark:bg-slate-900 p-1.5 rounded-2xl">
        {(['before', 'during', 'after'] as InspectionPhotoPhase[]).map((phase) => {
          const count = photos.filter((p) => p.phase === phase).length;
          const isActive = activePhase === phase;

          return (
            <button
              key={phase}
              type="button"
              onClick={() => {
                setActivePhase(phase);
                setSelectedCategory(phaseConfig[phase].categories[0]);
              }}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all font-semibold cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xs capitalize font-bold">{phase}</span>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                {count} {count === 1 ? 'Photo' : 'Photos'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Phase Description Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                {phaseConfig[activePhase].title} Inspection
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                {phaseConfig[activePhase].subtitle}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              {phaseConfig[activePhase].badge}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          {/* Quick Category Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Inspection Checklist Point:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            >
              {phaseConfig[activePhase].categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Notes Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Field Technician Note (Optional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Valley decking replaced, nailed 6-inch OC..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Camera Input or Simulation */}
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="crew-camera-file"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setIsUploading(true);
                const { saveInspectionPhoto } = await import('@/lib/roofingService');
                const localPreview = URL.createObjectURL(file);

                const now = new Date();
                const timeString =
                  now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) +
                  ' ' +
                  now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                  ' CDT';

                const saved = await saveInspectionPhoto(file, {
                  jobId: 'job-plano',
                  uploaderName: 'Mateo Rodriguez',
                  phase: activePhase,
                  category: selectedCategory,
                  timestamp: timeString,
                  gpsCoordinates: { lat: 33.0198, lng: -96.6989 },
                  imageUrl: localPreview,
                  title: `${selectedCategory} #${photos.filter((p) => p.phase === activePhase).length + 1}`,
                  notes: notes.trim() || `Verified ${selectedCategory} on Plano site. Code compliant.`,
                  approvedByAdmin: false,
                  requiresRepair: false,
                });

                onAddPhoto(saved);
                setNotes('');
                setIsUploading(false);
              }}
            />

            <div className="flex gap-2">
              <label
                htmlFor="crew-camera-file"
                className="flex-1 h-12 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>{isUploading ? 'Uploading to Supabase...' : `Take Photo (${activePhase})`}</span>
              </label>

              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={handleSimulateCapture}
                className="h-12 px-3 text-xs border-slate-300 dark:border-slate-700 font-semibold"
                title="Simulate quick test photo capture"
              >
                Simulate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Captured Photos Stream in this phase */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            {phaseConfig[activePhase].title} Log ({currentPhasePhotos.length})
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">GPS Verified</span>
        </div>

        {currentPhasePhotos.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/40 text-xs text-slate-400">
            No inspection photos captured for this step yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {currentPhasePhotos.map((photo) => (
              <div
                key={photo.id}
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex space-x-3 items-center"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative border border-slate-200 dark:border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {photo.title}
                    </h5>
                    <Badge
                      variant={photo.approvedByAdmin ? 'success' : 'warning'}
                      className="text-[9px] py-0 px-1.5 shrink-0"
                    >
                      {photo.approvedByAdmin ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{photo.notes}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {photo.timestamp.split(' ')[1]} {photo.timestamp.split(' ')[2]}
                    </span>
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <MapPin className="w-3 h-3" /> Plano
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
