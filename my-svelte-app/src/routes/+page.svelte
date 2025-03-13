<script lang="ts">
    import { onMount } from "svelte";
    let response = "";
    let chat = "";

    const onSubmit = async () => {
        if (!chat.trim()) return;

        try {
            const req = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat })
            });
            const res = await req.json();

            // Remove <think> tags using regex
            response = res.reply.replace(/<\/?think>/g, "").trim();
        } catch (error) {
            console.error("Error:", error);
            response = "An error occurred.";
        }
    };
</script>

<div class="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
    <input bind:value={chat} placeholder="Type your message..."
        class="w-full p-2 border rounded focus:ring focus:ring-blue-400" />
    <button on:click={onSubmit} class="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Send</button>
    {#if response}
        <div class="mt-4 p-3 bg-gray-100 rounded">{response}</div>
    {/if}
</div>
