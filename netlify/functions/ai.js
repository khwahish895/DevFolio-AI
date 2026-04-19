const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { func, ...body } = JSON.parse(event.body || "{}");

  try {
    let prompt = "";
    let responseKey = "";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    switch (func) {
      case "summarizeProject":
        const { repoName, readme } = body;
        prompt = `Summarize this GitHub project "${repoName}" into a compelling, 2-sentence description for a portfolio. Focus on what it does and the tech stack. README content: ${readme.slice(0, 3000)}`;
        responseKey = "summary";
        break;
      case "generateBio":
        const { username, repos } = body;
        const repoNames = repos.map(r => r.name).join(", ");
        const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].join(", ");
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
      const suggestions = text.split("\n").filter(line => line.trim());
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
    console.error(error);
    return { 
      statusCode: 500, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "AI request failed" }) 
    };
  }
};

