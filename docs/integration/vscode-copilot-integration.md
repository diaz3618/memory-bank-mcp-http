# VS Code Copilot Integration

## Setup

### Option 1: Via `.vscode/mcp.json` (Recommended)

Create `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "memory-bank-mcp": {
      "type": "http",
      "url": "http://localhost/mcp",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

**Note**: If not using Traefik reverse proxy, connect directly to port 3100:
```json
{
  "servers": {
    "memory-bank-mcp": {
      "type": "http",
      "url": "http://localhost:3100/mcp",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

VS Code will detect this file and connect to your running HTTP MCP server.

### Option 2: stdio transport via npm

Looking for the stdio version? See [diaz3618/memory-bank-mcp](https://github.com/diaz3618/memory-bank-mcp) for the npm package.

## Prerequisites

1. Deploy the HTTP MCP server using Docker:
   ```bash
   docker compose --profile local-db up -d
   ```

2. Generate an API key:
   ```bash
   curl -X POST http://localhost/api/keys \
     -H "Content-Type: application/json" \
     -d '{"name": "vscode-copilot", "expiresIn": "30d"}'
   ```

3. Copy the returned API key to your `.vscode/mcp.json`

## Copilot Chat

Once the MCP server is running, Copilot Chat can use Memory Bank tools in Agent mode. Start with:

```
@workspace Initialize the memory bank and read the current context
```

## Copilot Instructions

Create `.github/copilot-instructions.md` to tell Copilot to use Memory Bank automatically:

```markdown
# Project Instructions

This project uses Memory Bank MCP for persistent context.

## At session start
1. Call `get_context_digest` to load current state
2. Read `active-context.md` for ongoing tasks

## During work
- Call `track_progress` after completing milestones
- Call `log_decision` for architectural choices

## At session end
- Call `update_active_context` with current state
```

## Tips

- Copilot Agent mode is required for MCP tool calls
- The `.vscode/mcp.json` approach works without any extension
- Use `get_context_digest` for a fast context load instead of reading individual files
