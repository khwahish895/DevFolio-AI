import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeProject(repoName: string, readme: string) {
  if (!readme) return "No description available.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this GitHub project "${repoName}" into a compelling, 2-sentence description for a portfolio. Focus on what it does and the tech stack. README content: ${readme.slice(0, 3000)}`,
    });
    return response.text || "A unique developer project.";
  } catch (err) {
    console.error("AI summarization failed:", err);
    return "A high-impact developer project.";
  }
}

export async function generateBio(username: string, repos: any[]) {
  const repoNames = repos.map(r => r.name).join(", ");
  const languages = Array.from(new Set(repos.map(r => r.language).filter(Boolean))).join(", ");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional 3-sentence developer bio for ${username}. They build projects like ${repoNames} and specialize in ${languages}. Make it sound modern and high-impact.`,
    });
    return response.text || "Innovative developer building the future of the web.";
  } catch (err) {
    console.error("Bio generation failed:", err);
    return "Passionate software engineer focused on building robust and scalable applications.";
  }
}

export async function getPortfolioSuggestions(bio: string, projectsCount: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 short, actionable tips (max 10 words each) to improve a developer portfolio with ${projectsCount} projects and this bio: "${bio}"`,
    });
    return response.text?.split("\n").filter(line => line.trim()) || [];
  } catch (err) {
    return ["Add more impact metrics", "Highlight core technologies", "Improve visual consistency"];
  }
}
