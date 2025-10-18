# 🧪 Visual Recipe Lab

Create incredible videos by mixing visual ingredients! A Next.js demo showcasing the power of [fal.ai](https://fal.ai)'s Veo 3.1 and Seedream v4 models.

![Visual Recipe Lab](https://img.shields.io/badge/Next.js-15.5-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ What is This?

Visual Recipe Lab is an interactive demo that demonstrates how to combine multiple AI models to create something magical:

1. **Generate up to 3 "ingredients"** - Create images using [Seedream v4](https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image)
2. **Mix them together** - Use [Veo 3.1](https://fal.ai/models/fal-ai/veo3.1/reference-to-video) to create a video with all your ingredients in one dynamic scene
3. **AI-enhanced prompts** - Use the [video-prompt-generator](https://fal.ai/models/fal-ai/video-prompt-generator) to create cinematic video descriptions

## 🎬 Features

- **🎨 Image Generation** - Generate high-quality images with Seedream v4
- **🎥 Video Synthesis** - Combine multiple images into coherent video scenes with Veo 3.1
- **✨ AI Prompt Enhancement** - Automatically improve your video prompts with LLM assistance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A [fal.ai](https://fal.ai) API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/blendi-remade/veo-recipe-lab.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
FAL_KEY=your_fal_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 How to Use

1. **Step 1: Generate Ingredients**
   - Enter prompts for up to 3 images (e.g., "a magical wizard", "a steampunk robot", "a fantasy castle")
   - Click "Generate" for each ingredient
   - Select which ingredients you want to use in your video

2. **Step 2: Mix Your Ingredients**
   - Describe how you want your ingredients to interact (e.g., "dancing together in a magical forest")
   - (Optional) Click "Enhance with AI" to improve your prompt
   - Click "Generate Video" and wait for the magic!

3. **Download & Share**
   - Watch your creation
   - Download the video
   - Create another masterpiece! The possibilites are endless!

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Models**: [fal.ai](https://fal.ai)
  - [Seedream v4](https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image) for image generation
  - [Veo 3.1](https://fal.ai/models/fal-ai/veo3.1/reference-to-video) for video synthesis
  - [Video Prompt Generator](https://fal.ai/models/fal-ai/video-prompt-generator) for prompt enhancement

## 📁 Project Structure

```
veo-recipe-lab/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-image/      # Seedream v4 API route
│   │   │   ├── generate-video/      # Veo 3.1 API route
│   │   │   └── enhance-video-prompt/ # Prompt enhancement API route
│   │   ├── globals.css              # Global styles & animations
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Main app page
│   └── components/
│       ├── IngredientCard.tsx       # Image generation component
│       └── MixingChamber.tsx        # Video generation component
├── .env.local                       # Environment variables (create this!)
└── package.json
```

## 📧 Questions?

If you have questions about this demo or want to learn more about building with fal.ai, check out:
- [fal.ai Documentation](https://fal.ai/docs)
- [fal.ai Discord](https://discord.gg/fal-ai)
