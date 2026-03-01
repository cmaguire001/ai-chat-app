export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey || apiKey === 'your_key_here') {
    await new Promise(r => setTimeout(r, 800));
    return res.status(200).json({ reply: "Demo mode — add your HUGGINGFACE_API_KEY to get real AI responses!" });
  }

  try {
    const apiMessages = [
      { role: 'system', content: 'You are a helpful, friendly AI assistant. Be concise and conversational.' },
      ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    ];

    const response = await fetch(
      'https://router.huggingface.co/novita/v3/openai/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistralai/Mistral-7B-Instruct-v0.2',
          messages: apiMessages,
          max_tokens: 512,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    console.log('HF response:', JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'HF API error' });
    }

    const reply = data?.choices?.[0]?.message?.content || "No response generated.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
