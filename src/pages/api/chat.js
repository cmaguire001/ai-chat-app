// pages/api/chat.js
// Connects to Hugging Face Inference API (free tier)
// Set HUGGINGFACE_API_KEY in your .env.local or Replit Secrets

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  // ── Demo mode (no API key) ──────────────────────────────────
  if (!apiKey || apiKey === 'your_key_here') {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const demoReplies = [
      "That's a great question! I'm running in demo mode right now — add your Hugging Face API key to unlock real AI responses.",
      "Interesting! In demo mode I can only give pre-written replies. Set HUGGINGFACE_API_KEY in your environment to get real AI answers.",
      "I'd love to answer that properly! For real AI responses, grab a free key at huggingface.co and add it as HUGGINGFACE_API_KEY.",
      "Demo mode here! Everything else is fully working — themes, chat bubbles, the UI. Just add your HF API key for live AI.",
    ];
    const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
    // Simulate a small delay
    await new Promise(r => setTimeout(r, 800));
    return res.status(200).json({ reply });
  }

  // ── Real Hugging Face API call ──────────────────────────────
  try {
    // Build the conversation prompt in ChatML style (works with Mistral-Instruct)
    const systemPrompt = `You are a helpful, friendly AI assistant. Be concise and conversational.`;

    const formattedPrompt = messages.reduce((acc, msg, i) => {
      if (msg.role === 'user') {
        return acc + `[INST] ${msg.content} [/INST]`;
      } else {
        return acc + ` ${msg.content} `;
      }
    }, `<s>[INST] <<SYS>>\n${systemPrompt}\n<</SYS>>\n\n`);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: formattedPrompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('HF API error:', err);

      // Handle model loading
      if (response.status === 503) {
        return res.status(200).json({
          reply: "The AI model is warming up (this can take 20–30 seconds on the free tier). Please try again in a moment!",
        });
      }

      return res.status(500).json({ error: err.error || 'Hugging Face API error' });
    }

    const data = await response.json();
    let reply = data?.[0]?.generated_text || "I couldn't generate a response. Please try again.";

    // Clean up any prompt leakage
    reply = reply.replace(/\[INST\].*?\[\/INST\]/gs, '').trim();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
