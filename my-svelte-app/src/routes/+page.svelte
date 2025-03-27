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

        response = JSON.stringify(res, null, 2); // Format JSON output
        chatHistory = [...chatHistory, { text: response, type: "bot" }];
    } catch (error) {
        console.error("Error:", error);
        response = "An error occurred.";
        chatHistory = [...chatHistory, { text: response, type: "bot" }];
    }
};

</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: Arial, sans-serif;
        background: #0a192f;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
    }

    .chat-container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: #1a1a2e;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border: 2px solid #00f5d4;
    }
    .chat-header {
        padding: 16px;
        background: #16213e;
        color: #ffffff;
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: #0f3460;
        color: white;
    }
    .message {
        max-width: 75%;
        padding: 12px;
        border-radius: 12px;
        font-size: 1rem;
        line-height: 1.4;
        word-wrap: break-word;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    .user {
        background: #00f5d4;
        color: black;
        align-self: flex-end;
    }
    .bot {
        background: #e94560;
        color: white;
        align-self: flex-start;
    }
    .chat-input {
        display: flex;
        padding: 16px;
        border-top: 2px solid #00f5d4;
        background: #16213e;
    }
    .chat-input input {
        flex: 1;
        padding: 14px;
        border-radius: 8px;
        border: 1px solid #00f5d4;
        outline: none;
        background: #0f3460;
        color: white;
        font-size: 1rem;
    }
    .chat-input button {
        margin-left: 8px;
        padding: 14px 20px;
        background: #00f5d4;
        color: black;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        font-size: 1rem;
    }
    .chat-input button:hover {
        background: #00cba9;
        transform: scale(1.05);
    }
</style>

<div class="chat-container">
    <div class="chat-header">AI Chatbot</div>
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
