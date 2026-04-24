// llm.js
export async function callLLM(prompt,model='gemma3:270m') {
  try {
    const endpoint = model.endpoint || 'http://localhost:11434';
    
    //Open AI
    if (endpoint.includes('/v1')) {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: model.id,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${errText}`);
      }
      const data = await response.json();
      return data.choices[0].message.content;
    }

//ollama default
    const response = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model.id,
        prompt: prompt,
        stream: false
      })
    });
        if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama error: ${errText}`);
    }


    const data = await response.json();
    return data.response;

  } catch (err) {
    console.error(`LLM error (${model.id}):`, err);
    throw new Error(`LLM failed: ${model.id}`);
  }
}

