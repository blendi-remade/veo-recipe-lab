"use client";

import { useState } from "react";
import Image from "next/image";

interface IngredientCardProps {
  slotNumber: number;
  onGenerate: (imageUrl: string, prompt: string) => void;
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

  const getPlaceholder = () => {
    const placeholders = [
      'Try: "a futuristic robot chef", "a steampunk inventor", or "a cyberpunk hacker"',
      'Try: "a magical crystal cave", "a floating sky castle", or "an ancient temple"',
      'Try: "a mystical phoenix", "a friendly dragon", or "a glowing jellyfish"',
    ];
    return placeholders[slotNumber - 1] || placeholders[0];
  };

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
        onGenerate(data.imageUrl, prompt);
        setIsRegenerating(false);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className={`relative glass-card rounded-2xl p-6 transition-all duration-300 ${
        isSelected
          ? "border-2 border-purple-400 shadow-2xl shadow-purple-500/50 scale-[1.02]"
          : "border-2 border-white/20 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/20"
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
            placeholder={getPlaceholder()}
            className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            rows={3}
            disabled={loading}
            autoFocus={isRegenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/50"
          >
            {loading ? "..." : "✨ Generate"}
          </button>
          {isRegenerating && (
            <button
              onClick={() => setIsRegenerating(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-2 px-3 rounded-lg transition-colors mt-2"
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
          className="w-full glass-card hover:bg-white/10 text-white text-sm py-2.5 px-4 rounded-xl transition-all transform hover:scale-105 border border-white/30"
        >
          🔄 Regenerate
        </button>
      )}
    </div>
  );
}