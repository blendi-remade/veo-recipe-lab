import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

// Configure fal with API key
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrls, prompt, resolution = "720p", generateAudio = true } = await request.json();

    // Validate inputs
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image URL is required" },
        { status: 400 }
      );
    }

    if (imageUrls.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 images allowed" },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Generating video with:", {
      imageCount: imageUrls.length,
      imageUrls,
      prompt,
      resolution,
    });

    // Call Veo 3.1 reference-to-video
    const result = await fal.subscribe("fal-ai/veo3.1/reference-to-video", {
      input: {
        image_urls: imageUrls,
        prompt: prompt,
        duration: "8s",
        resolution: resolution,
        generate_audio: generateAudio,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Video generation in progress...");
        }
      },
    });

    return NextResponse.json({
      videoUrl: result.data.video.url,
      success: true,
    });
  } catch (error: any) {
    console.error("Error generating video:", error);
    console.error("Error body:", error.body);
    console.error("Error status:", error.status);
    
    return NextResponse.json(
      { 
        error: "Failed to generate video", 
        details: error.message || "Unknown error",
        validationErrors: error.body || null
      },
      { status: 500 }
    );
  }
}