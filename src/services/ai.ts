export async function summarizeProject(repoName: string, readme: string) {
  if (!readme) return "No description available.";
  
  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ func: "summarizeProject", repoName, readme })
    });
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.summary || "A high-impact developer project.";
  } catch (err) {
    console.error("AI summarization failed:", err);
    return "A high-impact developer project.";
  }
}

export async function generateBio(username: string, repos: any[]) {
  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ func: "generateBio", username, repos })
    });
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.bio || "Innovative developer building the future of the web.";
  } catch (err) {
    console.error("Bio generation failed:", err);
    return "Passionate software engineer focused on building robust and scalable applications.";
  }
}

export async function getPortfolioSuggestions(bio: string, projectsCount: number) {
  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ func: "getPortfolioSuggestions", bio, projectsCount })
    });
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.suggestions || ["Add more impact metrics", "Highlight core technologies", "Improve visual consistency"];
  } catch (err) {
    console.error("Suggestions failed:", err);
    return ["Add more impact metrics", "Highlight core technologies", "Improve visual consistency"];
  }
}

