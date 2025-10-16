import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

// Configure fal with API key
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Enhancing video prompt:", prompt);

    // Call fal.ai video prompt generator
    // Using text-only approach to avoid bias towards any single ingredient
    const result = await fal.subscribe("fal-ai/video-prompt-generator", {
      input: {
        input_concept: prompt,
      },
      logs: true,
    });

    return NextResponse.json({
      enhancedPrompt: result.data.prompt,
      success: true,
    });
  } catch (error) {
    console.error("Error enhancing video prompt:", error);
    return NextResponse.json(
      { 
        error: "Failed to enhance prompt", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

