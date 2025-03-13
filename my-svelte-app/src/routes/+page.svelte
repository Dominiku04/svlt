<script lang="ts">
    import { onMount } from "svelte";
    let response = "";
    let chat = "";
    let chatHistory: { text: string; type: "user" | "bot" }[] = [];

    const onSubmit = async () => {
        if (!chat.trim()) return;

        // Add user message to chat history
        chatHistory = [...chatHistory, { text: chat, type: "user" }];
        const userInput = chat;
        chat = "";

        try {
            const req = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat: userInput })
            });
            const res = await req.json();

            // Remove <think> tags using regex and add bot response
            response = res.reply.replace(/<\/?think>/g, "").trim();
            chatHistory = [...chatHistory, { text: response, type: "bot" }];
        } catch (error) {
            console.error("Error:", error);
            response = "An error occurred.";
            chatHistory = [...chatHistory, { text: response, type: "bot" }];
        }
    };
</script>

<div class="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
    <h2 class="text-xl font-semibold text-gray-700">Chatbot</h2>
    <div class="h-96 overflow-y-auto space-y-3 p-3 border rounded-lg bg-gray-50 shadow-inner">
        {#each chatHistory as msg (msg.text)}
            <div class="flex {msg.type === 'user' ? 'justify-end' : 'justify-start'}">
                <div class="p-3 max-w-xs rounded-2xl text-white text-sm"
                    class:bg-blue-500={msg.type === 'user'} class:bg-gray-300={msg.type === 'bot'}>
                    {msg.text}
                </div>
            </div>
        {/each}
    </div>
    <div class="flex gap-2 items-center border-t pt-3">
        <input bind:value={chat} placeholder="Type your message..."
            class="flex-1 p-2 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none" />
        <button on:click={onSubmit} class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Send</button>
    </div>
</div>
