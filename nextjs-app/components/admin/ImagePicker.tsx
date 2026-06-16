"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Upload, Loader2 } from "lucide-react";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  galleryImages: { id: string; url: string; title: string | null }[];
  label?: string;
  placeholder?: string;
  folder?: string;
  name?: string;
}

export default function ImagePicker({
  value,
  onChange,
  galleryImages,
  label,
  placeholder = "https://...",
  folder = "dola-foundation",
  name,
}: ImagePickerProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed");
      }
      onChange(data.url);
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2 items-center">
        <Input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-medium text-primary bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" /> Upload
            </>
          )}
        </button>
        {value && (
          <img
            src={value}
            alt="Preview"
            className="h-10 w-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

      {galleryImages.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowGallery(!showGallery)}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
          >
            {showGallery ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Hide Gallery
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Pick from Gallery
              </>
            )}
          </button>
          {showGallery && (
            <div className="mt-2 grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 max-h-40 overflow-y-auto">
              {galleryImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    onChange(img.url);
                    setShowGallery(false);
                  }}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    value === img.url
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-primary/50"
                  }`}
                  title={img.title || img.url}
                >
                  <img
                    src={img.url}
                    alt={img.title || ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">
        💡 Click "Upload" to upload an image directly from your device, paste an existing image URL, or pick one from your gallery below.
      </p>
    </div>
  );
}
