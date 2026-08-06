// SKETCH — not verified end-to-end. Read the caveats in
// .github/workflows/agentic-doc-sync.selfhosted.yml before relying on this.
//
// Claude Code only speaks the Anthropic Messages API (POST /v1/messages).
// The DH LiteLLM gateway (http://localhost:36253) only speaks the OpenAI
// chat/completions format and cannot be reconfigured (see rider-design's
// migrate-to-litellm command). This is a minimal translation layer so
// ANTHROPIC_BASE_URL can point here instead of api.anthropic.com directly.
//
// Known gap: tool_use / tool_result translation (Bash, Edit, and the Figma
// MCP calls the doc-sync prompt relies on) is the hardest part of this
// mapping to get exactly right, and is NOT fully implemented below — only a
// best-effort shape conversion. Verify tool-calling actually works before
// trusting this in an unattended nightly run; if it doesn't, the agent may
// silently fail to use its tools rather than erroring loudly.

const http = require('http');

const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:36253';
const PORT = process.env.PROXY_PORT || 8787;

function anthropicToOpenAIMessages(body) {
  const messages = [];
  if (body.system) {
    messages.push({ role: 'system', content: body.system });
  }
  for (const m of body.messages || []) {
    // Anthropic content can be a string or an array of blocks (text /
    // tool_use / tool_result). This only handles plain text blocks —
    // tool_use/tool_result blocks are passed through as best-effort JSON,
    // which OpenAI-format backends will NOT interpret as real tool calls.
    const content = Array.isArray(m.content)
      ? m.content.map((b) => (b.type === 'text' ? b.text : JSON.stringify(b))).join('\n')
      : m.content;
    messages.push({ role: m.role, content });
  }
  return messages;
}

function openAIToAnthropicResponse(openaiResp, model) {
  const choice = openaiResp.choices?.[0];
  const text = choice?.message?.content || '';
  return {
    id: openaiResp.id || 'proxy_' + Date.now(),
    type: 'message',
    role: 'assistant',
    model,
    content: [{ type: 'text', text }],
    stop_reason: choice?.finish_reason === 'stop' ? 'end_turn' : choice?.finish_reason || 'end_turn',
    usage: {
      input_tokens: openaiResp.usage?.prompt_tokens || 0,
      output_tokens: openaiResp.usage?.completion_tokens || 0,
    },
  };
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || !req.url.startsWith('/v1/messages')) {
    res.writeHead(404).end();
    return;
  }

  let raw = '';
  req.on('data', (chunk) => (raw += chunk));
  req.on('end', async () => {
    const body = JSON.parse(raw);
    const openaiPayload = {
      model: body.model,
      messages: anthropicToOpenAIMessages(body),
      max_tokens: body.max_tokens,
      stream: false, // TODO: streaming is not translated here; Claude Code
                     // may expect SSE — verify before assuming this works.
    };

    try {
      const upstream = await fetch(`${LITELLM_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(openaiPayload),
      });
      const openaiResp = await upstream.json();
      const anthropicResp = openAIToAnthropicResponse(openaiResp, body.model);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(anthropicResp));
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: String(err) } }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`anthropic-to-litellm-proxy listening on :${PORT}, forwarding to ${LITELLM_URL}`);
});
