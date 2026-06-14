"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  galleryImages: { id: string; url: string; title: string | null }[];
  label?: string;
  placeholder?: string;
}

export default function ImagePicker({
  value,
  onChange,
  galleryImages,
  label,
  placeholder = "https://...",
}: ImagePickerProps) {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2 items-center">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
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
        💡 Tip: Use free image hosts like ImgBB.com or Imgur.com to upload from your device. Recommended: WebP format, max 500KB, 1200px wide.
      </p>
    </div>
  );
}
