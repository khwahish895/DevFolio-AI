import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

declare const process: { env: { GEMINI_API_KEY: string } };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { func } = event.path.split('/').slice(-1)[0] as 'summarizeProject' | 'generateBio' | 'getPortfolioSuggestions';
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}") as any;

    let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let prompt = "";
    let responseKey = "";

    switch (func) {
      case "summarizeProject":
        const { repoName, readme } = body;
        prompt = `Summarize this GitHub project "${repoName}" into a compelling, 2-sentence description for a portfolio. Focus on what it does and the tech stack. README content: ${readme.slice(0, 3000)}`;
        responseKey = "summary";
        break;
      case "generateBio":
        const { username, repos } = body;
        const repoNames = repos.map((r: any) => r.name).join(", ");
        const languages = Array.from(new Set(repos.map((r: any) => r.language).filter(Boolean))).join(", ");
        prompt = `Create a professional 3-sentence developer bio for ${username}. They build projects like ${repoNames} and specialize in ${languages}. Make it sound modern and high-impact.`;
        responseKey = "bio";
        break;
      case "getPortfolioSuggestions":
        const { bio, projectsCount } = body;
        prompt = `Provide 3 short, actionable tips (max 10 words each) to improve a developer portfolio with ${projectsCount} projects and this bio: "${bio}"`;
        responseKey = "suggestions";
        break;
      default:
        return { statusCode: 404, body: "Not found" };
    }

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    if (responseKey === "suggestions") {
      const suggestions = text.split("\n").filter((line: string) => line.trim());
      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ suggestions })
      };
    }

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ [responseKey]: text })
    };
  } catch (error) {
    console.error(`Error in ${func}:`, error);
    return { 
      statusCode: 500, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: `${func} failed` }) 
    };
  }
};

