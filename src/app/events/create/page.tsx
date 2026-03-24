/// <reference types="google.maps" />
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { EventNameAndPosters } from '@/components/events/create/EventNameAndPosters';
import { DateTimeSection } from '@/components/events/create/DateTimeSection';
import { MasterSelects } from '@/components/events/create/MasterSelects';
import { VenueAndDetails } from '@/components/events/create/VenueAndDetails';
import { TeamSettings } from '@/components/events/create/TeamSettings';
import { supabase } from '@/lib/supabase';
import { type EventFormData } from '@/types/schema';

// Helper function to load Google Maps script
function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      resolve();
      return;
    }
    const existing = document.getElementById('google-maps-js');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

// Helper function to safely create object URL from file input
function createFilePreviewUrl(fileList: FileList | null | undefined): string | null {
  if (!fileList || fileList.length === 0) return null;
  const file = fileList[0];
  if (!(file instanceof File)) return null;
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating object URL:', error);
    return null;
  }
}

// Helper function to get preview URL from watched form data
function getPreviewUrl(watchedFiles: FileList | null | undefined): string | null {
  if (!watchedFiles || watchedFiles.length === 0) return null;
  const file = watchedFiles[0];
  if (!file || !(file instanceof File)) return null;
  return createFilePreviewUrl(watchedFiles);
}

export default function CreateEventPage() {
  const [eventTypes, setEventTypes] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [languages, setLanguages] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [ageRatings, setAgeRatings] = useState<Array<{ id: string; code: string; name: string; slug: string }>>([]);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [masterError, setMasterError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);

  // Add state for preview URLs as fallback
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [landscapePreview, setLandscapePreview] = useState<string | null>(null);

  // Add state to store actual file data
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [landscapeFile, setLandscapeFile] = useState<File | null>(null);

  // Theme options that cycle through colors
  const themes = [
    { name: 'Modern', color: 'bg-teal-400', from: 'from-teal-900', via: 'via-teal-800', to: 'to-emerald-900' },
    { name: 'Sunset', color: 'bg-orange-400', from: 'from-orange-900', via: 'via-red-800', to: 'to-pink-900' },
    { name: 'Ocean', color: 'bg-blue-400', from: 'from-blue-900', via: 'via-blue-800', to: 'to-cyan-900' },
    { name: 'Purple', color: 'bg-purple-400', from: 'from-purple-900', via: 'via-purple-800', to: 'to-indigo-900' },
    { name: 'Forest', color: 'bg-green-400', from: 'from-green-900', via: 'via-emerald-800', to: 'to-teal-900' },
    { name: 'Rose', color: 'bg-pink-400', from: 'from-pink-900', via: 'via-rose-800', to: 'to-red-900' }
  ];

  const handleThemeChange = () => {
    setSelectedTheme((prev) => (prev + 1) % themes.length);
  };

  const form = useForm<EventFormData>({
    mode: 'onChange',
    defaultValues: {
      isTeamEvent: false,
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (portraitPreview) URL.revokeObjectURL(portraitPreview);
      if (landscapePreview) URL.revokeObjectURL(landscapePreview);
    };
  }, [portraitPreview, landscapePreview]);

  useEffect(() => {
    let isCancelled = false;
    async function loadMaster() {
      setMasterError(null);
      setLoadingMaster(true);
      try {
        const [etRes, catRes, langRes, ageRes] = await Promise.all([
          supabase.from('event_types').select('id,name,slug').eq('is_active', true).order('position', { ascending: true }),
          supabase.from('categories').select('id,name,slug').eq('is_active', true).order('position', { ascending: true }),
          supabase.from('languages').select('id,name,slug').eq('is_active', true).order('position', { ascending: true }),
          supabase.from('age_ratings').select('id,code,name,slug').eq('is_active', true).order('position', { ascending: true }),
        ]);

        if (isCancelled) return;

        if (etRes.error) throw etRes.error;
        if (catRes.error) throw catRes.error;
        if (langRes.error) throw langRes.error;
        if (ageRes.error) throw ageRes.error;

        setEventTypes(etRes.data || []);
        setCategories(catRes.data || []);
        setLanguages(langRes.data || []);
        setAgeRatings(ageRes.data || []);
      } catch (error) {
        if (!isCancelled) setMasterError(
          error instanceof Error ? error.message : 'Failed to load master data'
        );
      } finally {
        if (!isCancelled) setLoadingMaster(false);
      }
    }
    loadMaster();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Google Places Autocomplete for Venue
  useEffect(() => {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey) return; // silently skip if no key configured

    let autocomplete: google.maps.places.Autocomplete | null = null;
    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled) return;

        const input = document.getElementById('venue-input') as HTMLInputElement | null;
        if (!input || !window.google?.maps?.places) return;

        const options: google.maps.places.AutocompleteOptions = {
          types: ['establishment', 'geocode'],
          fields: ['formatted_address', 'geometry', 'name', 'address_components']
        };

        try {
          const autocomp = new window.google.maps.places.Autocomplete(input, options);
          // Cast to the correct type
          autocomplete = autocomp as unknown as google.maps.places.Autocomplete;

          if (autocomplete) {
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
              if (!autocomplete) return;
              const place = autocomplete.getPlace();
              const value = place.formatted_address || place.name || '';
              if (value) {
                setValue('venue', value, { shouldDirty: true, shouldValidate: true });
              }
            });
          }
        } catch (error) {
          console.error('Error initializing Google Maps Autocomplete:', error);
        }
      })
      .catch((error: Error) => {
        console.error('Error loading Google Maps:', error);
        // input remains a normal text field
      });

    return () => {
      cancelled = true;
    };
  }, [setValue]);

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      let landscapeUrl = '/placeholder-landscape.jpg';
      let portraitUrl = '/placeholder-portrait.jpg';

      // Upload landscape poster if provided
      if (landscapeFile) {
        const landscapeFileName = `landscape-${Date.now()}-${landscapeFile.name}`;
        const { data: landscapeUpload, error: landscapeError } = await supabase.storage
          .from('event-images')
          .upload(landscapeFileName, landscapeFile);
        if (landscapeError) {
          console.error('Error uploading landscape image:', landscapeError);
        } else {
          const { data: landscapePublicUrl } = supabase.storage
            .from('event-images')
            .getPublicUrl(landscapeFileName);
          landscapeUrl = landscapePublicUrl.publicUrl;
        }
      }

      // Upload portrait poster if provided
      if (portraitFile) {
        const portraitFileName = `portrait-${Date.now()}-${portraitFile.name}`;
        const { data: portraitUpload, error: portraitError } = await supabase.storage
          .from('event-images')
          .upload(portraitFileName, portraitFile);
        if (portraitError) {
          console.error('Error uploading portrait image:', portraitError);
        } else {
          const { data: portraitPublicUrl } = supabase.storage
            .from('event-images')
            .getPublicUrl(portraitFileName);
          portraitUrl = portraitPublicUrl.publicUrl;
        }
      }

      const payload = {
        ...data,
        date: data.date && data.date.trim() !== '' ? data.date : undefined,
        landscapePoster: landscapeUrl,
        portraitPoster: portraitUrl,
      };

      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        alert('Event created!');
        // Refresh the page or redirect to events list to show the new event from database
        window.location.href = '/events';
      } else {
        alert(result.message || 'Error creating event');
      }
    } catch (error: unknown) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[selectedTheme].from} ${themes[selectedTheme].via} ${themes[selectedTheme].to} transition-all duration-500`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Event</h1>
          <p className="text-teal-100">Fill in the details to create your event</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Image/Preview - Hidden on mobile */}
          <div className="hidden lg:block lg:row-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-lg font-semibold mb-4">Event Preview</h3>

              {/* Portrait Image Preview */}
              <div className="mb-4">
                <label className="block text-white/80 text-sm mb-2">Portrait View</label>
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-xl flex items-center justify-center overflow-hidden">
                  {portraitPreview ? (
                    <img
                      src={portraitPreview}
                      alt="Portrait preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white/60">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Portrait Image</p>
                      <p className="text-xs opacity-75">1080x1920px</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Landscape Image Preview */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Landscape View</label>
                <div className="aspect-video bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-xl flex items-center justify-center overflow-hidden">
                  {landscapePreview ? (
                    <img
                      src={landscapePreview}
                      alt="Landscape preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white/60">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Landscape Image</p>
                      <p className="text-xs opacity-75">1920x1080px</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Info Preview */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="text-white/80 text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Event:</span>
                    <span className="text-white font-medium">
                      {watch('eventName') || 'Event Name'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Theme:</span>
                    <div
                      className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-md transition-all"
                      onClick={handleThemeChange}
                      title="Click to change theme"
                    >
                      <div className={`w-3 h-3 ${themes[selectedTheme].color} rounded-full transition-all duration-300`}></div>
                      <span className="text-xs">{themes[selectedTheme].name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error/Loading Messages */}
              {masterError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">{masterError}</p>
                </div>
              )}
              {loadingMaster && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">Loading options…</p>
                </div>
              )}

              {/* Form Sections */}
              <div className="bg-white/10 z-10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <EventNameAndPosters
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  onFileChange={(field, files) => {
                    if (field === 'portraitPoster') {
                      // Clean up previous URL
                      if (portraitPreview) {
                        URL.revokeObjectURL(portraitPreview);
                      }
                      if (files && files.length > 0) {
                        const file = files[0];
                        const url = createFilePreviewUrl(files);
                        setPortraitPreview(url);
                        setPortraitFile(file); // Store the actual file
                        setValue('portraitPoster', files); // Ensure React Hook Form gets the files
                      } else {
                        setPortraitPreview(null);
                        setPortraitFile(null);
                        setValue('portraitPoster', null);
                      }
                    }
                    if (field === 'landscapePoster') {
                      // Clean up previous URL
                      if (landscapePreview) {
                        URL.revokeObjectURL(landscapePreview);
                      }
                      if (files && files.length > 0) {
                        const file = files[0];
                        const url = createFilePreviewUrl(files);
                        setLandscapePreview(url);
                        setLandscapeFile(file); // Store the actual file
                        setValue('landscapePoster', files); // Ensure React Hook Form gets the files
                      } else {
                        setLandscapePreview(null);
                        setLandscapeFile(null);
                        setValue('landscapePoster', null);
                      }
                    }
                  }}
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <DateTimeSection register={register} errors={errors} />
              </div>

              <div className="bg-white/10  rounded-xl p-6 border border-white/20">
                <MasterSelects
                  register={register}
                  errors={errors}
                  eventTypes={eventTypes}
                  ageRatings={ageRatings}
                  languages={languages}
                  categories={categories}
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <VenueAndDetails register={register} errors={errors} setValue={setValue} />
              </div>

              <TeamSettings register={register} watch={watch} setValue={setValue} errors={errors} />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-teal-900 hover:bg-gray-100 font-semibold py-4 rounded-xl text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
