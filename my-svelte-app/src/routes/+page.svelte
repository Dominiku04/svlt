<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
  
    let chat = "";
    let isLoading = writable(false);
    let messages = writable<{ role: string; content: string }[]>([]);
  
    onMount(() => {
        messages.set([{ role: "ai", content: "Hey there! How can I assist you today?" }]);
    });
  
    const onSubmit = async () => {
        if (!chat.trim()) return;
  
        const userContent = chat.trim();
        chat = "";
  
        messages.update(msgs => [...msgs, { role: "user", content: userContent }]);
  
        isLoading.set(true);
        scrollToBottom();
  
        try {
            const req = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat: userContent })
            });
  
            const res = await req.json();
            messages.update(msgs => [...msgs, { role: "ai", content: res.reply }]);
  
        } catch (error) {
            messages.update(msgs => [...msgs, { role: "ai", content: "Oops! Something went wrong. 😕 Try again." }]);
        } finally {
            isLoading.set(false);
            scrollToBottom();
        }
    };
  
    const scrollToBottom = () => {
        setTimeout(() => {
            const chatContainer = document.getElementById("chat-container");
            if (chatContainer) {
                chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
            }
        }, 100);
    };
</script>

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 500px;
        margin: auto;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
    }
    .chat-header {
        background: #007bff;
        color: white;
        font-size: 18px;
        font-weight: bold;
        padding: 12px;
        text-align: center;
    }
    .chat-messages {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 15px;
        height: 320px;
        overflow-y: auto;
    }
    .message {
        padding: 10px 15px;
        border-radius: 10px;
        max-width: 70%;
    }
    .user {
        background: #007bff;
        color: white;
        align-self: flex-end;
    }
    .ai {
        background: #f1f1f1;
        color: #333;
        align-self: flex-start;
    }
    .chat-input {
        display: flex;
        gap: 10px;
        padding: 15px;
        border-top: 1px solid #ddd;
    }
    input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }
    button {
        background: #007bff;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    button:hover {
        background: #0056b3;
    }
</style>

<div class="chat-container">
    <div class="chat-header">AI Chatbot</div>
    <div id="chat-container" class="chat-messages">
        {#each $messages as message}
            <div class="message {message.role}">{message.content}</div>
        {/each}
        {#if $isLoading}
            <div class="message ai">...</div>
        {/if}
    </div>
    <div class="chat-input">
        <input bind:value={chat} placeholder="Type a message..." on:keypress={(e) => e.key === 'Enter' && onSubmit()} />
        <button on:click={onSubmit}>Send</button>
    </div>
</div>
