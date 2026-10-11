'use client';

import React, { useState } from 'react';
import { PhotoInspection, InspectionPhotoPhase } from '@/types/roofing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Camera,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Calendar,
  MapPin,
  CheckCircle2,
  Maximize2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ClientPhotoGalleryProps {
  photos: PhotoInspection[];
}

export function ClientPhotoGallery({ photos }: ClientPhotoGalleryProps) {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | 'before' | 'during' | 'after'>('all');
  const [activeModalPhoto, setActiveModalPhoto] = useState<PhotoInspection | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategoryTab === 'all') return true;
    return p.phase === selectedCategoryTab;
  });

  const getPhaseTabLabel = (phase: 'all' | 'before' | 'during' | 'after') => {
    switch (phase) {
      case 'all':
        return `All Project Photos (${photos.length})`;
      case 'before':
        return 'Before Damage';
      case 'during':
        return 'Installation Progress';
      case 'after':
        return 'Final Result';
    }
  };

  const openLightbox = (photo: PhotoInspection) => {
    setActiveModalPhoto(photo);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setActiveModalPhoto(null);
    setZoomLevel(1);
  };

  const handleShare = (photo: PhotoInspection) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: `Roofing documentation photo: ${photo.notes}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Share link copied for: ${photo.title}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Gallery Header and Category Filter Tabs */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                Live Job Photo Gallery
              </CardTitle>
              <CardDescription className="text-xs">
                Before & after transparency photos uploaded in real-time by your field roofing crew
              </CardDescription>
            </div>

            <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
              {filteredPhotos.length} Verified Images
            </Badge>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
            {(['all', 'before', 'during', 'after'] as const).map((tab) => {
              const isActive = selectedCategoryTab === tab;
              const count = tab === 'all' ? photos.length : photos.filter((p) => p.phase === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{getPhaseTabLabel(tab)}</span>
                  {tab !== 'all' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0">
          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(photo)}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer hover:border-emerald-400"
              >
                {/* Photo Preview Container */}
                <div className="relative aspect-video sm:aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-lg text-xs font-bold flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" /> View Fullscreen
                    </span>
                  </div>

                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider text-white ${
                        photo.phase === 'before'
                          ? 'bg-amber-600'
                          : photo.phase === 'during'
                          ? 'bg-blue-600'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {photo.phase}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className="bg-black/60 text-white backdrop-blur-xs text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Inspected
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                    {photo.notes}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>{photo.timestamp.split(' ')[0]}</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                      <MapPin className="w-3 h-3" /> Plano, TX
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Lightbox / Modal Viewer with Zoom & Download */}
      {activeModalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header Bar */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  {activeModalPhoto.phase.toUpperCase()} STAGE PHOTO
                </span>
                <h3 className="text-sm sm:text-base font-bold truncate">
                  {activeModalPhoto.title}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(activeModalPhoto)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Share Photo"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Stage with Zoom */}
            <div className="relative overflow-hidden flex-1 bg-black flex items-center justify-center p-2 min-h-[280px] sm:min-h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalPhoto.imageUrl}
                alt={activeModalPhoto.title}
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-h-[60vh] w-auto object-contain transition-transform duration-200 select-none"
              />
            </div>

            {/* Lightbox Footer Info */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-slate-300 leading-relaxed font-medium">
                  {activeModalPhoto.notes}
                </p>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <span>GPS: 33.0198° N, -96.6989° W (Plano, TX)</span>
                  <span>•</span>
                  <span>{activeModalPhoto.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={activeModalPhoto.imageUrl}
                  target="_blank"
                  download={`apex-roofing-${activeModalPhoto.id}.jpg`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1.5 transition text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download HD
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
