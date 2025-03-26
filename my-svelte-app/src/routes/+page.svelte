<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let chat = "";
    let isLoading = writable(false);
    let messages = writable<{ role: string; content: string }[]>([]);

    onMount(() => {
        messages.set([
            { role: "ai", content: "Hello! I'm your AI assistant. How can I help you today?" }
        ]);
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
            messages.update(msgs => [...msgs, { role: "ai", content: "An error occurred. Please try again." }]);
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

<div class="flex flex-col items-center justify-center h-screen bg-gray-950 text-white font-sans p-4">
    <div class="w-full max-w-2xl h-[85vh] bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-700">
        <div class="py-4 px-6 bg-gray-800 text-center font-semibold text-lg uppercase tracking-wide border-b border-gray-700">
            AI Chat Assistant
        </div>

        <div id="chat-container" class="flex-1 overflow-y-auto p-4 space-y-4">
            {#each $messages as message}
                <div class="flex {message.role === 'ai' ? 'justify-start' : 'justify-end'}">
                    <div class="max-w-xs md:max-w-sm lg:max-w-md px-4 py-3 rounded-lg text-sm md:text-base whitespace-pre-wrap shadow-md 
                        {message.role === 'ai' ? 'bg-gray-700 text-white rounded-bl-none' : 'bg-blue-500 text-white rounded-br-none'}">
                        {message.content}
                    </div>
                </div>
            {/each}

            {#if $isLoading}
                <div class="flex justify-start">
                    <div class="max-w-xs px-4 py-2 rounded-lg bg-gray-700 text-white flex gap-2 items-center">
                        <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        <div class="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            {/if}
        </div>

        <div class="p-4 bg-gray-800 border-t border-gray-700">
            <div class="relative">
                <input bind:value={chat}
                    placeholder="Type your message..."
                    class="w-full p-3 pr-12 border border-gray-600 rounded-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    on:keypress={(e) => e.key === 'Enter' && onSubmit()} />

                <button 
                    on:click={onSubmit}
                    class="absolute right-3 top-2 p-2 text-gray-400 hover:text-blue-400 transition duration-200"
                    disabled={!chat.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 transform rotate-90">
                        <path d="M5 10.2L19 4.5L13.3 18.5L11 12L5 10.2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    :global(body) {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #0d0f12;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
    }

    .animate-bounce {
        animation: bounce 1.2s infinite;
    }

    .delay-150 { animation-delay: 0.15s; }
    .delay-300 { animation-delay: 0.3s; }
</style>
