import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const ollama = new Ollama({ host: "http://localhost:11434" });

    try {
        const { chat } = await request.json();
        if (!chat || chat.trim() === "") {
            return json({ reply: "Please provide a valid message." });
        }

        // User profile details
        const user = {
            name: "John Dominic Calma Caiga",
            likes: ["Sleeping", "Music", "Eating"],
            hobbies: ["Gaming", "Swimming", "Working Out"],
            home: "#61 Murphy St., Brgy. Pag-asa",
            age: "20 years old",
            course: "BS Computer Science",
            school: "Gordon College",
            gender: "Male",
            subject: "Intelligent Systems",
            religion: "Iglesia Ni Cristo",
            family: ["We are a family of 4", "We are only 2 brothers in the family"]
        };

        // Constructing a structured prompt
        const prompt = `
        You are an AI. Answer the following directly without unnecessary explanations:
        - Name: ${user.name}
        - Age: ${user.age}
        - Gender: ${user.gender}
        - Studying: ${user.course} at ${user.school}
        - Likes: ${user.likes.join(", ")} 
        - Hobbies: ${user.hobbies.join(", ")}
        - Home: ${user.home}
        - Subject: ${user.subject}
        - Religion: ${user.religion}
        - Family: ${user.family.join(", ")}
        
        **User Message:** "${chat}"
        **AI Response:**`;

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
