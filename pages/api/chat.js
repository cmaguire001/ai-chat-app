export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey || apiKey === 'your_key_here') {
    await new Promise(r => setTimeout(r, 800));
    return res.status(200).json({ reply: "Demo mode — add HUGGINGFACE_API_KEY to get real AI responses!" });
  }

  try {
    const apiMessages = [
      { role: 'system', content: 'You are a helpful, friendly AI assistant. Be concise.' },
      ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    ];

    const response = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.1-8B-Instruct:cerebras',
          messages: apiMessages,
          max_tokens: 512,
          temperature: 0.7,
        }),
      }
    );

    const text = await response.text();
    console.log('HF raw:', text);

    if (!response.ok) {
      return res.status(500).json({ error: 'HF API error: ' + text });
    }

    const data = JSON.parse(text);
    const reply = data?.choices?.[0]?.message?.content || "No response generated.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}