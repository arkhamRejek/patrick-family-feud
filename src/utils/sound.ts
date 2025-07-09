"use client";

/**
 * Play a sound effect
 * @param sound The sound file name (without path)
 */
export const playSound = (sound: "ding" | "buzzer"): void => {
  try {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const basePath =
        process.env.NODE_ENV === "production" ? "/patrick-family-feud" : "";
      const audio = new Audio(`${basePath}/sounds/${sound}.mp3`);
      audio.play().catch((error) => {
        // Handle errors silently (often due to user interaction required by browsers)
        console.log(`Sound play error (${sound}):`, error);
      });
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};
