"use client";

import { useState } from "react";
import IngredientCard from "@/components/IngredientCard";
import MixingChamber from "@/components/MixingChamber";

interface Ingredient {
  imageUrl: string | null;
  selected: boolean;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { imageUrl: null, selected: false },
    { imageUrl: null, selected: false },
    { imageUrl: null, selected: false },
  ]);

  const handleIngredientGenerated = (slotIndex: number, imageUrl: string) => {
    setIngredients((prev) =>
      prev.map((ingredient, index) =>
        index === slotIndex
          ? { ...ingredient, imageUrl, selected: true }
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
      slot: index + 1,
    }))
    .filter((img) => img.url && ingredients[img.slot - 1].selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl md:text-6xl">🧪</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Visual Recipe Lab
            </h1>
            <span className="text-5xl md:text-6xl">🧪</span>
          </div>
          <p className="text-lg md:text-xl text-purple-200 max-w-3xl mx-auto">
            Create incredible videos by mixing visual ingredients! Generate up
            to 3 images, then combine them into one dynamic scene with AI.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-purple-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Powered by Seedream v4
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
              Veo 3.1
            </span>
          </div>
        </div>

        {/* Ingredient Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Step 1: Generate Your Ingredients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ingredients.map((ingredient, index) => (
              <IngredientCard
                key={index}
                slotNumber={index + 1}
                imageUrl={ingredient.imageUrl}
                isSelected={ingredient.selected}
                onGenerate={(imageUrl) =>
                  handleIngredientGenerated(index, imageUrl)
                }
                onToggleSelect={() => handleToggleSelect(index)}
              />
            ))}
          </div>
        </div>

        {/* Connection Visual */}
        {selectedImages.length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl animate-bounce text-purple-300">↓</div>
              <div className="text-sm text-purple-300 font-medium">
                Mix them together
              </div>
              <div className="text-4xl animate-bounce text-purple-300">↓</div>
            </div>
          </div>
        )}

        {/* Mixing Chamber */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
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