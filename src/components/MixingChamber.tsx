"use client";

import { useState } from "react";
import Image from "next/image";

interface MixingChamberProps {
  selectedImages: { url: string; prompt: string; slot: number }[];
}

export default function MixingChamber({ selectedImages }: MixingChamberProps) {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState("");

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setEnhancing(true);
    setError("");

    try {
      // Build context with all ingredient descriptions (no image bias)
      const ingredientDescriptions = selectedImages
        .map((img, idx) => `${img.prompt}`)
        .join(", ");
      
      const enhancedInput = selectedImages.length > 0
        ? `${prompt}. Scene elements: ${ingredientDescriptions}`
        : prompt;

      const response = await fetch("/api/enhance-video-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: enhancedInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance prompt");
      }

      setPrompt(data.enhancedPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enhance prompt");
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim() || selectedImages.length === 0) return;

    setLoading(true);
    setError("");
    setVideoUrl("");

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls: selectedImages.map((img) => img.url),
          prompt: prompt,
          resolution: "720p",
          generateAudio: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }

      setVideoUrl(data.videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = () => {
    if (selectedImages.length === 0) return [];
    
    const count = selectedImages.length;
    if (count === 1) {
      return [
        "The character walks forward with confidence, camera follows smoothly",
        "Gentle rotation around the subject, revealing details from all angles",
        "The scene comes to life with subtle animations and movements",
      ];
    } else if (count === 2) {
      return [
        "Both subjects interact naturally, moving closer together",
        "They face each other and begin to communicate with gestures",
        "Camera pans between them as they move in the scene",
      ];
    } else {
      return [
        "All three subjects gather together in a dynamic scene",
        "They interact naturally while the camera orbits around them",
        "A lively scene unfolds as all elements come together harmoniously",
      ];
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className="relative glass-card rounded-3xl p-8 md:p-10 border-2 border-purple-400/50 shadow-2xl shadow-purple-500/30 overflow-hidden">
      {/* Magical glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl animate-glow-pulse">🧪</span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Mixing Chamber
            </h2>
            <span className="text-4xl animate-glow-pulse" style={{ animationDelay: '1s' }}>🧪</span>
          </div>
          <p className="text-purple-100 text-sm font-medium">
            {selectedImages.length === 0
              ? "Select 1-3 ingredients to begin mixing"
              : `${selectedImages.length} ingredient${selectedImages.length > 1 ? "s" : ""} selected`}
          </p>
        </div>

      {/* Selected Ingredients Display */}
      {selectedImages.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-center gap-4 mb-6">
            {selectedImages.map((img, index) => (
              <div
                key={img.slot}
                className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-purple-400 shadow-lg animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Image
                  src={img.url}
                  alt={`Ingredient ${img.slot}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-purple-900/80 text-white text-xs py-1 text-center">
                  #{img.slot}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Describe how your ingredients come together:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene... e.g., 'dancing together in a magical forest' or 'standing together as camera orbits around them'"
                className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !prompt && (
              <div>
                <p className="text-white/70 text-xs mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="text-xs bg-purple-500/30 hover:bg-purple-500/50 text-white px-3 py-1.5 rounded-full border border-purple-400/50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhance & Generate Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleEnhancePrompt}
                disabled={enhancing || loading || !prompt.trim()}
                className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:cursor-not-allowed border border-white/20"
              >
                {enhancing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enhancing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    ✨ Enhance with AI
                  </span>
                )}
              </button>
              
              <button
                onClick={handleGenerateVideo}
                disabled={loading || enhancing || !prompt.trim() || selectedImages.length === 0}
                className="flex-[2] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Mixing... (~1-2 minutes)
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🎬 Generate Video
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Video Result */}
      {videoUrl && (
        <div className="mt-8 animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border-2 border-purple-400/30">
            <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              ✨ Your Creation ✨
            </h3>
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-purple-500/50 border-2 border-purple-400/30">
              <video
                src={videoUrl}
                controls
                className="w-full"
                autoPlay
                loop
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href={videoUrl}
                download
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg"
              >
                💾 Download
              </a>
              <button
                onClick={() => {
                  setVideoUrl("");
                  setPrompt("");
                }}
                className="flex-1 glass-card hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 border border-white/30"
              >
                🔄 Create Another
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Empty State */}
        {selectedImages.length === 0 && !loading && (
          <div className="text-center py-12 text-white/40">
            <div className="text-6xl mb-4 animate-float">🧪</div>
            <p className="text-lg">Select ingredients above to start mixing!</p>
          </div>
        )}
      </div>
    </div>
  );
}