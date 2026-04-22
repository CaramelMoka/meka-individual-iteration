// llm.js
export async function callLLM(prompt,model='gemma3:270m') {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
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

