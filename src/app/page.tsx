"use client";

import { useState } from "react";
import IngredientCard from "@/components/IngredientCard";
import MixingChamber from "@/components/MixingChamber";
import Particles from "@/components/Particles";

interface Ingredient {
  imageUrl: string | null;
  prompt: string | null;
  selected: boolean;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { imageUrl: null, prompt: null, selected: false },
    { imageUrl: null, prompt: null, selected: false },
    { imageUrl: null, prompt: null, selected: false },
  ]);

  const handleIngredientGenerated = (slotIndex: number, imageUrl: string, prompt: string) => {
    setIngredients((prev) =>
      prev.map((ingredient, index) =>
        index === slotIndex
          ? { ...ingredient, imageUrl, prompt, selected: true }
          : ingredient
      )
    );
  };

  const handleToggleSelect = (slotIndex: number) => {
    setIngredients((prev) =>
      prev.map((ingredient, index) =>
        index === slotIndex
          ? { ...ingredient, selected: !ingredient.selected }
          : ingredient
      )
    );
  };

  const selectedImages = ingredients
    .map((ingredient, index) => ({
      url: ingredient.imageUrl!,
      prompt: ingredient.prompt!,
      slot: index + 1,
    }))
    .filter((img) => img.url && ingredients[img.slot - 1].selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 p-4 md:p-8 relative overflow-hidden">
      {/* Add Particles Background */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <Particles
          particleCount={300}
          particleColors={['#a855f7', '#ec4899', '#c084fc', '#f0abfc']}
          particleSpread={12}
          speed={0.15}
          moveParticlesOnHover={true}
          particleHoverFactor={6}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={1.5}
        />
      </div>

      {/* Ambient background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6 animate-float">
            <span className="text-5xl md:text-6xl animate-glow-pulse">🧪</span>
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Visual Recipe Lab
            </h1>
            <span className="text-5xl md:text-6xl animate-glow-pulse" style={{ animationDelay: '1s' }}>🧪</span>
          </div>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Create incredible videos by mixing visual ingredients! Generate up
            to 3 images, then combine them into one dynamic scene with AI.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="glass-card px-4 py-2 rounded-full">
              <span className="flex items-center gap-2 text-purple-100">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                Seedream v4
              </span>
            </div>
            <div className="glass-card px-4 py-2 rounded-full">
              <span className="flex items-center gap-2 text-purple-100">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50"></span>
                Veo 3.1
              </span>
            </div>
          </div>
        </div>

        {/* Ingredient Cards */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            Step 1: Generate Your Ingredients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ingredients.map((ingredient, index) => (
              <IngredientCard
                key={index}
                slotNumber={index + 1}
                imageUrl={ingredient.imageUrl}
                isSelected={ingredient.selected}
                onGenerate={(imageUrl, prompt) =>
                  handleIngredientGenerated(index, imageUrl, prompt)
                }
                onToggleSelect={() => handleToggleSelect(index)}
              />
            ))}
          </div>
        </div>

        {/* Connection Visual */}
        {selectedImages.length > 0 && (
          <div className="flex justify-center my-8">
            <svg
              className="w-12 h-24"
              viewBox="0 0 48 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gradient definition */}
              <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f472b6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Arrow line */}
              <line
                x1="24"
                y1="0"
                x2="24"
                y2="70"
                stroke="url(#arrowGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glow)"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 100; 100 0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
              
              {/* Arrow head */}
              <path
                d="M24 96 L12 80 L24 84 L36 80 Z"
                fill="url(#arrowGradient)"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </svg>
          </div>
        )}

        {/* Mixing Chamber */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            Step 2: Mix Your Ingredients
          </h2>
          <MixingChamber selectedImages={selectedImages} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <div className="inline-block bg-white/5 backdrop-blur-lg rounded-full px-6 py-3 border border-white/10">
            <p className="text-purple-200 text-sm">
              Built with{" "}
              <a
                href="https://fal.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold underline"
              >
                fal.ai
              </a>{" "}
              • Next.js Demo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}