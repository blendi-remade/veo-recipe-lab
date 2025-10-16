"use client";

import { useState } from "react";
import Image from "next/image";

interface IngredientCardProps {
  slotNumber: number;
  onGenerate: (imageUrl: string) => void;
  isSelected: boolean;
  onToggleSelect: () => void;
  imageUrl: string | null;
}

export default function IngredientCard({
  slotNumber,
  onGenerate,
  isSelected,
  onToggleSelect,
  imageUrl,
}: IngredientCardProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        onGenerate(data.imageUrl);
        setIsRegenerating(false);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhancePrompt = () => {
    // Simple prompt enhancement
    const enhanced = `${prompt}, highly detailed, professional lighting, cinematic composition, 8k quality`;
    setPrompt(enhanced);
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all ${
        isSelected
          ? "border-purple-400 shadow-lg shadow-purple-400/50 scale-105"
          : "border-white/20 hover:border-white/40"
      }`}
    >
      {/* Slot Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Ingredient {slotNumber}
        </h3>
        {imageUrl && (
          <button
            onClick={onToggleSelect}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-purple-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isSelected ? "✓ Selected" : "Select"}
          </button>
        )}
      </div>

      {/* Image Display or Loading */}
      {imageUrl && !isRegenerating ? (
        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-black/30">
          <Image
            src={imageUrl}
            alt={`Ingredient ${slotNumber}`}
            fill
            className="object-cover"
          />
        </div>
      ) : loading ? (
        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-black/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        </div>
      ) : null}

      {/* Prompt Input - Always show when no image or regenerating */}
      {(!imageUrl || isRegenerating) && !loading && (
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your ingredient (e.g., 'a magical wizard')"
            className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            rows={3}
            disabled={loading}
            autoFocus={isRegenerating}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEnhancePrompt}
              disabled={!prompt.trim() || loading}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
            >
              ✨ Enhance
            </button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Generate"}
            </button>
          </div>
          {isRegenerating && (
            <button
              onClick={() => setIsRegenerating(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Regenerate Button */}
      {imageUrl && !isRegenerating && (
        <button
          onClick={() => setIsRegenerating(true)}
          className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors"
        >
          🔄 Regenerate
        </button>
      )}
    </div>
  );
}