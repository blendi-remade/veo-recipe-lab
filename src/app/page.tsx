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
  const [surprising, setSurprising] = useState(false);
  const [surpriseMessage, setSurpriseMessage] = useState("");

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

  const getRandomPrompt = () => {
    const subjects = [
      "a futuristic robot chef", "a magical wizard", "a steampunk inventor",
      "a cyberpunk hacker", "a mystical phoenix", "a friendly dragon",
      "a glowing jellyfish", "a celestial goddess", "a time traveler",
      "a neon samurai", "a crystal golem", "a space explorer",
      "a mythical mermaid", "a clockwork automaton", "a storm spirit",
      "a quantum scientist", "a forest guardian", "a cosmic entity",
      "a holographic dancer", "a biomechanical warrior", "a arcane alchemist"
    ];
    
    const settings = [
      "in a magical crystal cave", "on a floating sky castle", "in an ancient temple",
      "in a neon-lit city", "in a mystical forest", "in a volcanic landscape",
      "in an underwater palace", "in a starfield", "in a desert oasis",
      "in a frozen tundra", "in a futuristic lab", "in an enchanted garden",
      "in a cyberpunk alley", "in a cosmic nebula", "in a steampunk workshop",
      "in a bioluminescent jungle", "in a crystalline dimension", "in a quantum realm"
    ];
    
    const styles = [
      "cinematic lighting", "vibrant colors", "dramatic atmosphere",
      "ethereal glow", "highly detailed", "fantasy art style",
      "photorealistic", "anime style", "concept art",
      "digital painting", "3D render", "atmospheric lighting",
      "epic composition", "mystical ambiance", "neon accents"
    ];
    
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomSetting = settings[Math.floor(Math.random() * settings.length)];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    
    return `${randomSubject} ${randomSetting}, ${randomStyle}`;
  };

  const handleSurpriseMe = async () => {
    setSurprising(true);
    
    const messages = [
      "🎨 Mixing random elements...",
      "✨ Consulting the AI muses...",
      "🎭 Rolling the creative dice...",
      "🌟 Channeling chaos energy...",
      "🎪 Summoning surprise ingredients..."
    ];
    setSurpriseMessage(messages[Math.floor(Math.random() * messages.length)]);

    // Generate 3 random prompts
    const randomPrompts = [
      getRandomPrompt(),
      getRandomPrompt(),
      getRandomPrompt()
    ];
    
    // Generate all 3 images in parallel for maximum speed! 🚀
    try {
      const promises = randomPrompts.map(async (prompt, index) => {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        
        const data = await response.json();
        if (response.ok) {
          return { index, imageUrl: data.imageUrl, prompt, success: true };
        } else {
          console.error(`Failed to generate image ${index + 1}:`, data.error);
          return { index, imageUrl: null, prompt, success: false, error: data.error };
        }
      });
      
      const results = await Promise.all(promises);
      
      // Update all ingredients at once
      setIngredients(prev =>
        prev.map((ingredient, index) => {
          const result = results.find(r => r.index === index);
          return result && result.success
            ? { imageUrl: result.imageUrl, prompt: result.prompt, selected: true }
            : ingredient;
        })
      );
      
      // Show success/error message
      const successCount = results.filter(r => r.success).length;
      if (successCount === 3) {
        setSurpriseMessage("🎉 All ingredients ready!");
        setTimeout(() => setSurpriseMessage(""), 2000);
      } else if (successCount > 0) {
        alert(`✨ Generated ${successCount} out of 3 ingredients!\n\nSome failed - you can regenerate them individually.`);
      } else {
        alert("😔 Failed to generate ingredients. Please check your API key and credits.");
      }
    } catch (error) {
      console.error("Surprise Me failed:", error);
      alert("Oops! Something went wrong. Try again!");
    } finally {
      setSurprising(false);
    }
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
          
          {/* Surprise Me Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleSurpriseMe}
              disabled={surprising}
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-2xl hover:shadow-pink-500/50 disabled:cursor-not-allowed"
            >
              {surprising ? (
                <span className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Creating Magic...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <span className="text-2xl animate-bounce">🎲</span>
                  Surprise Me!
                  <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                </span>
              )}
              
              {/* Sparkle effect on hover */}
              {!surprising && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full animate-ping"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
              )}
            </button>
          </div>
          
          {/* Info text */}
          {surprising && (
            <p className="text-center text-purple-200 text-sm mb-4 animate-pulse">
              {surpriseMessage}
            </p>
          )}
          
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