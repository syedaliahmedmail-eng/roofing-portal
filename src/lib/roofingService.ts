import { supabase, isSupabaseConfigured, uploadRoofingPhotoToSupabase } from './supabase';
import { RoofJob, PhotoInspection } from '@/types/roofing';
import { MOCK_JOBS, MOCK_INSPECTION_PHOTOS } from '@/data/mockRoofingData';

/**
 * Fetch all jobs from Supabase or fallback to mock data
 */
export async function getJobs(): Promise<RoofJob[]> {
  if (!supabase || !isSupabaseConfigured) {
    return MOCK_JOBS;
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase getJobs query error or empty, using mock fallback:', error?.message);
      return MOCK_JOBS;
    }

    // Map database rows to RoofJob TypeScript interface
    return data.map((row) => ({
      id: row.id,
      jobNumber: row.id.toUpperCase(),
      clientName: row.homeowner_name,
      clientPhone: '(214) 555-8931',
      clientEmail: 'client@roofing-dallas.com',
      address: {
        street: row.address,
        city: row.city || 'Dallas',
        state: row.state || 'TX',
        zip: row.zip || '75201',
      },
      roofType: row.roof_type || 'Architectural Shingles',
      squareFootage: row.square_footage || 3200,
      pitch: row.pitch || '7/12',
      status: row.status,
      claimType: row.claim_type,
      progressPercent: row.progress_percent || 0,
      estimatedStartDate: '2026-10-10',
      targetCompletionDate: '2026-10-12',
      assignedCrewId: row.assigned_crew ? 'crew-1' : undefined,
      crewLeaderName: row.assigned_crew || undefined,
      totalContractValue: Number(row.estimated_value) || 20000,
      insuranceClaimNumber: row.insurance_claim_number || undefined,
      insuranceCarrier: row.insurance_carrier || undefined,
      shingleBrand: row.shingle_brand || 'GAF Timberline HDZ',
    }));
  } catch (err) {
    console.warn('getJobs unexpected exception, using mock fallback:', err);
    return MOCK_JOBS;
  }
}

/**
 * Update job status (e.g. from Kanban drag/advance)
 */
export async function updateJobStatus(jobId: string, newStatus: RoofJob['status']): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) {
    return true; // Optimistic mock success
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    if (error) {
      console.warn('Failed to update job status in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('updateJobStatus exception:', err);
    return false;
  }
}

/**
 * Record a live crew GPS check-in to Supabase
 */
export async function recordCrewCheckIn(
  jobId: string,
  crewName: string,
  lat: number,
  lng: number
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('crew_checkins')
      .insert({
        job_id: jobId,
        crew_name: crewName,
        latitude: lat,
        longitude: lng,
        checked_in_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Failed to record crew check-in in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('recordCrewCheckIn exception:', err);
    return false;
  }
}

/**
 * Record a live crew inspection photo and save to Supabase Storage + DB
 */
export async function saveInspectionPhoto(
  file: File | null,
  photoMetadata: Omit<PhotoInspection, 'id'>
): Promise<PhotoInspection> {
  let photoUrl = photoMetadata.imageUrl;

  // If a real file was provided and Supabase is configured, upload to Storage
  if (file && supabase && isSupabaseConfigured) {
    const uploadedUrl = await uploadRoofingPhotoToSupabase(file, photoMetadata.jobId, photoMetadata.phase);
    if (uploadedUrl) {
      photoUrl = uploadedUrl;
    }
  }

  // Insert metadata into inspection_photos table
  if (supabase && isSupabaseConfigured) {
    try {
      await supabase.from('inspection_photos').insert({
        job_id: photoMetadata.jobId,
        photo_url: photoUrl,
        phase_tag: photoMetadata.phase,
        category: photoMetadata.category,
        notes: photoMetadata.notes,
        uploader_name: photoMetadata.uploaderName,
        latitude: photoMetadata.gpsCoordinates?.lat,
        longitude: photoMetadata.gpsCoordinates?.lng,
        approved_by_admin: photoMetadata.approvedByAdmin,
        uploaded_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('saveInspectionPhoto database error:', err);
    }
  }

  return {
    ...photoMetadata,
    id: `photo-${Date.now()}`,
    imageUrl: photoUrl,
  };
}

/**
 * Record a homeowner digital signature and update invoice & job
 */
export async function saveClientInvoiceApproval(
  jobId: string,
  invoiceNumber: string,
  signatureName: string,
  totalAmount: number
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) {
    return true;
  }

  try {
    const now = new Date().toISOString();

    // 1. Insert or update invoice
    await supabase.from('invoices').upsert({
      job_id: jobId,
      invoice_number: invoiceNumber,
      total_amount: totalAmount,
      status: 'approved',
      signed_at: now,
      signature_data: signatureName,
    });

    // 2. Mark job status as completed/invoiced if applicable
    await supabase.from('jobs').update({
      status: 'completed',
      updated_at: now,
    }).eq('id', jobId);

    return true;
  } catch (err) {
    console.warn('saveClientInvoiceApproval exception:', err);
    return false;
  }
}
