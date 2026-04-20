// llm.js
export async function callLLM(prompt) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:270m',
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    return data.response;

  } catch (err) {
    console.error('Ollama error:', err);
    throw new Error('LLM failed');
  }
}

