export type Role = 'admin' | 'crew' | 'client';

export type JobStatus = 
  | 'new_lead' 
  | 'inspection_scheduled' 
  | 'estimate_sent' 
  | 'in_progress' 
  | 'completed' 
  | 'invoiced_closed';

export type ClaimType = 
  | 'Insurance Claim - Hail/Wind' 
  | 'Retail / Out-of-Pocket' 
  | 'Commercial Flat Replacement' 
  | 'Emergency Tarp / Storm Repair';

export type RoofType = 
  | 'Architectural Shingles' 
  | 'Standing Seam Metal' 
  | 'TPO Flat Commercial' 
  | 'Spanish Clay Tile' 
  | 'Cedar Shake';

export interface RoofJob {
  id: string;
  jobNumber: string; // e.g. "JOB-2026-4401"
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  roofType: RoofType;
  squareFootage: number; // e.g., 3200 sq ft = 32 squares
  pitch: string; // e.g., "7/12", "8/12"
  status: JobStatus;
  claimType: ClaimType;
  progressPercent: number;
  estimatedStartDate: string;
  targetCompletionDate: string;
  assignedCrewId?: string;
  crewLeaderName?: string;
  totalContractValue: number;
  insuranceClaimNumber?: string;
  insuranceCarrier?: string;
  scopeNotes?: string;
  shingleBrand?: string; // e.g., "GAF Timberline HDZ", "CertainTeed Landmark"
  shingleColor?: string; // e.g., "Charcoal", "Weathered Wood"
  priority?: 'high' | 'medium' | 'normal';
}

export interface CrewMember {
  id: string;
  name: string;
  role: 'Crew Lead' | 'Installer' | 'Safety Specialist' | 'Tear-Off Tech';
  phone: string;
  email: string;
  currentLocation?: string;
  checkInStatus: 'checked_in' | 'on_break' | 'checked_out';
  lastCheckInTime?: string;
  assignedJobId?: string;
  avatarUrl?: string;
  certifications: string[];
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'disputed';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
}

export type InspectionPhotoPhase = 'before' | 'during' | 'after';

export interface PhotoInspection {
  id: string;
  jobId: string;
  uploaderName: string;
  phase: InspectionPhotoPhase;
  category: string; // e.g. "Pre-existing Hail Damage", "Decking Rot Replacement", "Completed Shingle Courses & Ridge Cap"
  timestamp: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  title: string;
  notes: string;
  approvedByAdmin: boolean;
  requiresRepair: boolean;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: 'Shingles' | 'Underlayment' | 'Ventilation' | 'Flashing' | 'Fasteners';
  quantityNeeded: number;
  quantityDelivered: number;
  unit: string;
  delivered: boolean;
  notes?: string;
}
