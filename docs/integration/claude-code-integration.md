# Claude Code Integration

## Setup

Add Memory Bank MCP HTTP server to your Claude Code configuration in `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "memory-bank-mcp": {
      "url": "http://localhost/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

**Without Traefik** (direct connection to port 3100):

```json
{
  "mcpServers": {
    "memory-bank-mcp": {
      "url": "http://localhost:3100/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

> **Note**: For the stdio/npm version, see [diaz3618/memory-bank-mcp](https://github.com/diaz3618/memory-bank-mcp)

### Prerequisites

1. Deploy the HTTP MCP server:
   ```bash
   docker compose --profile local-db up -d
   ```

2. Generate an API key:
   ```bash
   curl -X POST http://localhost/api/keys \
     -H "Content-Type: application/json" \
     -d '{"name": "claude-code", "expiresIn": "30d"}'
   ```

3. Add the API key to your Claude Code config above

## Usage

Once configured, Claude Code will have access to all Memory Bank tools. Start a session with:

```
Initialize the memory bank for this project, then read the active context.
```

Claude Code will call `initialize_memory_bank` and `read_memory_bank_file` automatically.

## Session Workflow

1. **Start** — Ask Claude to read `active-context.md` and `progress.md`
2. **During work** — Claude uses `track_progress` and `log_decision` as needed
3. **End** — Ask Claude to update the memory bank with current state

## Knowledge Graph

Claude Code can use the knowledge graph tools to build a persistent understanding of your project:

```
Search the knowledge graph for entities related to "authentication"
```

## Tips

- Claude Code supports MCP natively — no extension needed
- Add a `/CLAUDE.md` or project instructions file that references Memory Bank tools
- Use `get_context_digest` at session start for a compressed overview
