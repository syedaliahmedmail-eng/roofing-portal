'use client';

import React, { useState } from 'react';
import { MaterialItem } from '@/types/roofing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  PackageCheck,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MaterialsChecklistProps {
  initialMaterials: MaterialItem[];
}

export function MaterialsChecklist({ initialMaterials }: MaterialsChecklistProps) {
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);

  const toggleMaterialDelivered = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, delivered: !m.delivered } : m))
    );
  };

  const deliveredCount = materials.filter((m) => m.delivered).length;
  const isAllDelivered = deliveredCount === materials.length;

  return (
    <div className="space-y-4">
      {/* Materials Delivery Status Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-blue-600" />
                Staged Materials Verification
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                Delivered by ABC Supply & Dallas staging warehouse
              </CardDescription>
            </div>
            <Badge
              variant={isAllDelivered ? 'success' : 'warning'}
              className="text-[10px] font-semibold"
            >
              {deliveredCount}/{materials.length} Verified
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 space-y-2.5">
          {materials.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleMaterialDelivered(item.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                item.delivered
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-bold leading-tight ${
                      item.delivered ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {item.name}
                  </span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5">
                    {item.category}
                  </Badge>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Qty: <span className="font-bold text-slate-700 dark:text-slate-300">{item.unit}</span>
                </div>

                {item.notes && (
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 italic">
                    Note: {item.notes}
                  </p>
                )}
              </div>

              <div className="pt-0.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                    item.delivered
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}

          {/* Quick All Received Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMaterials((prev) => prev.map((m) => ({ ...m, delivered: true })))}
            className="w-full text-xs mt-2"
          >
            <PackageCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Mark All Staged & Received
          </Button>
        </CardContent>
      </Card>

      {/* Safety Compliance Strip */}
      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 flex items-center space-x-3 text-xs">
        <div className="p-2 bg-blue-600 text-white rounded-lg">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-white text-xs">
            OSHA DFW Fall Protection Active
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">
            Harnesses and tie-off anchors inspected for 7/12 slope steepness.
          </div>
        </div>
      </div>
    </div>
  );
}
