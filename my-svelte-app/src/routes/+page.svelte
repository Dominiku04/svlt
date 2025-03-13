<script lang="ts">
    import { onMount } from "svelte";
    let response = "";
    let chat = "";
    let chatHistory: { text: string; type: "user" | "bot" }[] = [];

    const onSubmit = async () => {
        if (!chat.trim()) return;

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

            response = res.reply.replace(/<\/?think>/g, "").trim();
            chatHistory = [...chatHistory, { text: response, type: "bot" }];
        } catch (error) {
            console.error("Error:", error);
            response = "An error occurred.";
            chatHistory = [...chatHistory, { text: response, type: "bot" }];
        }
    };
</script>

<style>
    .chat-container {
        max-width: 450px;
        margin: auto;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .chat-header {
        padding: 16px;
        background: #2563eb;
        color: white;
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
    }
    .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .message {
        max-width: 75%;
        padding: 10px;
        border-radius: 18px;
        font-size: 0.9rem;
        line-height: 1.4;
        word-wrap: break-word;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .user {
        background: #2563eb;
        color: white;
        align-self: flex-end;
    }
    .bot {
        background: #e5e7eb;
        color: black;
        align-self: flex-start;
    }
    .chat-input {
        display: flex;
        padding: 12px;
        border-top: 1px solid #ddd;
        background: #f9fafb;
    }
    .chat-input input {
        flex: 1;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        outline: none;
    }
    .chat-input button {
        margin-left: 8px;
        padding: 10px 16px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .chat-input button:hover {
        background: #1e40af;
    }
</style>

<div class="chat-container">
    <div class="chat-header">Chatbot</div>
    <div class="chat-messages">
        {#each chatHistory as msg (msg.text)}
            <div class="message {msg.type}">{msg.text}</div>
        {/each}
    </div>
    <div class="chat-input">
        <input bind:value={chat} placeholder="Type a message..." on:keypress={(e) => e.key === 'Enter' && onSubmit()} />
        <button on:click={onSubmit}>Send</button>
    </div>
</div>
