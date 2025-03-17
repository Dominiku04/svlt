import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const ollama = new Ollama({ host: "http://localhost:11434" });

    try {
        const { chat } = await request.json();
        if (!chat || chat.trim() === "") {
            return json({ reply: "Please provide a message." });
        }

        // User preferences (contextual details)
        const user = {
            name: "Henric Matthew E. Delrosario",
            likes: ["NBA", "WWE", "Netflix"],
            hobbies: ["Basketball", "Running", "Working Out"],
            home: "#25 D Fontaine 18th St. EBB OC",
            age: "21 years old",
            study: "Bachelor of Science in Computer Science",
            school: "Gordon College",
            gender: "Male",
        };

        // Construct a concise prompt
        const prompt = `You are an AI. Answer the following directly without unnecessary explanations:
        - Name: ${user.name}
        - Likes: ${user.likes.join(", ")}
        - Hobbies: ${user.hobbies.join(", ")}
        - Home: ${user.home}
        - Age: ${user.age}
        - Studying: ${user.study}
        - School: ${user.school}
        - Gender: ${user.gender}
        
        User's Message: "${chat}"`;

        const response = await ollama.chat({
            model: "deepseek-r1:latest",
            messages: [{ role: "user", content: prompt }]
        });

        // Remove <think> sections and normalize text
        const reply = response?.message?.content
            .replace(/<think>.*?<\/think>/gs, "") // Remove thinking sections
            .replace(/\s+/g, " ") // Normalize spaces
            .trim() || "No response received.";

        return json({ reply });
    } catch (error) {
        console.error("Chat API Error:", error);
        return json({ reply: "An error occurred while processing your request." });
    }
};