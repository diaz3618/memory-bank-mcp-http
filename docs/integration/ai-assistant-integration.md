# AI Assistant Integration Guide

This guide explains how to integrate Memory Bank MCP HTTP server with AI assistants through the Model Context Protocol (MCP).

> **Note**: This repo uses **HTTP/SSE transport** for Docker-based production deployments.  
> Looking for the **stdio/npm version** for local Claude Desktop or Cline? → [diaz3618/memory-bank-mcp](https://github.com/diaz3618/memory-bank-mcp)

## Overview

Memory Bank MCP HTTP server provides AI assistants with:

- **Persistent memory** and context across sessions
- **Progress tracking** and decision logging 
- **Project-specific** knowledge management
- **Multiple operational modes**: architect, code, ask, debug, test
- **Knowledge graph** for project relationships and semantic search
- **PostgreSQL/Supabase storage** with pgvector for embeddings
- **Redis caching** for session and API key management

## Supported AI Assistants

Memory Bank MCP HTTP works with any AI assistant that supports the Model Context Protocol via **HTTP transport**:

- **VS Code Copilot** - See [VS Code Copilot Integration Guide](./vscode-copilot-integration.md)
- **Claude Code** - See [Claude Code Integration Guide](./claude-code-integration.md)
- **Cursor** - See [Cursor Integration Guide](./cursor-integration.md)
- **Cline** - See [Cline Integration Guide](./cline-integration.md)
- **Roo Code** - See [Roo Code Integration Guide](./roo-code-integration.md)
- **Any MCP-compatible client** - See [Generic MCP Integration Guide](./generic-mcp-integration.md)

## Architecture

Memory Bank MCP HTTP uses a Docker Compose stack with HTTP/SSE transport:

```
┌──────────────────────┐   HTTP/SSE (JSON-RPC)   ┌────────────────────────┐
│   AI Assistant       │◄───────────────────────►│  Traefik (proxy)       │
│                      │  Bearer/X-API-Key auth  │  TLS termination       │
│  (VS Code, Claude,   │                         └───────────┬────────────┘
│   Cursor, Cline...)  │                                     │
└──────────────────────┘                           ┌─────────▼────────────┐
                                                   │  Memory Bank MCP     │
                                                   │  HTTP Server         │
                                                   │  (Node.js/Express)   │
                                                   │  • Tools             │
                                                   │  • API key auth      │
                                                   │  • Rate limiting     │
                                                   └─────┬────────┬───────┘
                                                         │        │
                                        ┌────────────────┘        └────────────────┐
                                        ▼                                          ▼
                                ┌──────────────────┐                      ┌────────────────┐
                                │  PostgreSQL 17   │                      │  Redis 7       │
                                │  • Documents     │                      │  • Sessions    │
                                │  • Graph store   │                      │  • Key cache   │
                                │  • API keys      │                      │  • Rate limits │
                                │  • RLS policies  │                      └────────────────┘
                                └──────────────────┘
```

## Prerequisites

Before integrating with your AI assistant, you need:

1. **Running Docker Compose stack**: Follow the [Deployment Guide](../deployment/http-postgres-redis-supabase.md)
2. **API key**: Generate one using the API key management endpoints
3. **Network access**: Your AI assistant must be able to reach the MCP server URL

## MCP Configuration

### Basic HTTP Configuration

Add Memory Bank MCP HTTP to your AI assistant's MCP configuration:

```json
{
  "mcpServers": {
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

**Alternative using X-API-Key header:**

```json
{
  "mcpServers": {
    "memory-bank-mcp": {
      "type": "http",
      "url": "http://localhost/mcp",
      "headers": {
        "X-API-Key": "<your-api-key>"
      }
    }
  }
}
```

### Production Configuration (HTTPS)

For production with TLS:

```json
{
  "mcpServers": {
    "memory-bank-mcp": {
      "type": "http",
      "url": "https://your-domain.com/mcp",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

### Direct Port Access (Without Traefik)

If not using the Traefik proxy, connect directly to port 3100:

```json
{
  "mcpServers": {
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

## API Key Management

### Generate an API Key

Create a new API key via the REST API:

```bash
curl -X POST http://localhost/api/keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-ide-key",
    "scopes": ["read", "write"],
    "rateLimit": 1000,
    "expiresIn": "30d"
  }'
```

**Response:**
```json
{
  "id": "key_abc123",
  "key": "mbmcp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "name": "my-ide-key",
  "scopes": ["read", "write"],
  "rateLimit": 1000,
  "expiresAt": "2026-03-29T..."
}
```

> **⚠️ Important**: Copy the `key` value immediately — it cannot be retrieved later!

### List API Keys

```bash
curl http://localhost/api/keys \
  -H "Authorization: Bearer <admin-key>"
```

### Revoke an API Key

```bash
curl -X DELETE http://localhost/api/keys/<key-id> \
  -H "Authorization: Bearer <admin-key>"
```

See the [Deployment Guide](../deployment/http-postgres-redis-supabase.md#api-key-management) for complete API key documentation.

## Available Tools

Once configured, the AI assistant has access to these MCP tools:

### 1. Instructions & Context Loading

| Tool | Description |
|------|-------------|
| `get_instructions` | ⚠️ **Call first!** Get comprehensive instructions and tool reference |
| `get_context_digest` | Get compact summary: tasks, issues, progress, decisions, graph |
| `get_context_bundle` | Get full content of ALL core files in one response |
| `get_memory_bank_status` | Get Memory Bank status and configuration |
| `list_memory_bank_files` | List all files in the Memory Bank directory |
| `search_memory_bank` | Full-text search across all Memory Bank files |

### 2. File Operations

| Tool | Description |
|------|-------------|
| `read_memory_bank_file` | Read a single file (returns content + ETag) |
| `write_memory_bank_file` | Write a single file (supports optimistic concurrency via ETag) |
| `batch_read_files` | Read multiple files in one request |
| `batch_write_files` | Write multiple files in one request |

### 3. Progress Tracking

| Tool | Description |
|------|-------------|
| `track_progress` | Record a progress milestone (action + description) |
| `add_progress_entry` | Structured entry: type, summary, details, files, tags |
| `update_active_context` | Update tasks, issues, next steps in active-context.md |
| `update_tasks` | Add, remove, or replace the tasks list |
| `add_session_note` | Add timestamped note (observation, blocker, question, todo) |
| `log_decision` | Log architectural/design decision with context and alternatives |

### 4. Knowledge Graph

| Tool | Description |
|------|-------------|
| `get_targeted_context` | **Preferred.** Get budgeted context pack via KG + excerpts |
| `graph_search` | Search entities by query string |
| `graph_open_nodes` | Expand specific nodes and their neighborhood |
| `graph_upsert_entity` | Create or update an entity |
| `graph_add_observation` | Add an observation to an entity |
| `graph_add_doc_pointer` | Link an entity to a Memory Bank file + optional heading |
| `graph_link_entities` | Create or remove typed relationship (action: "link"/"unlink") |
| `graph_delete_entity` | Delete entity or observation (observationId param for observation) |
| `graph_maintain` | Maintain graph: rebuild snapshot, compact log, or get stats |

### 5. Mode Management

| Tool | Description |
|------|-------------|
| `switch_mode` | Switch operational mode (architect/code/ask/debug/test) or get current mode |

### 6. Setup & Administration

| Tool | Description |
|------|-------------|
| `initialize_memory_bank` | Create new Memory Bank in a directory |
| `set_memory_bank_path` | Point to an existing Memory Bank directory |
| `migrate_file_naming` | Migrate files from camelCase to kebab-case |
| `debug_mcp_config` | Debug the current MCP configuration |

### 7. Backup & Restore

| Tool | Description |
|------|-------------|
| `create_backup` | Create timestamped backup or list backups (listOnly:true) |
| `restore_backup` | Restore from backup (auto-creates pre-restore backup) |

### 8. Multi-Store Management

| Tool | Description |
|------|-------------|
| `list_stores` | List all registered Memory Bank stores |
| `select_store` | Switch active store or register/unregister (action param) |

### 9. Sequential Thinking

| Tool | Description |
|------|-------------|
| `sequential_thinking` | Record numbered thinking steps or reset session |
| `finalize_thinking_session` | Persist thinking outcomes to Memory Bank |

## Integration Patterns

### Pattern 1: Start-of-Session Context Loading

**Best Practice**: Load context at the beginning of each session.

```typescript
// AI assistant calls at session start:
const instructions = await mcp.callTool('get_instructions', {});
const context = await mcp.callTool('get_context_digest', {
  maxProgressEntries: 10,
  maxDecisions: 5,
  includeSystemPatterns: false
});

// Use context.content for system prompt
```

### Pattern 2: Progress Tracking

**Best Practice**: Track milestones after significant work.

```typescript
// After completing a feature:
await mcp.callTool('track_progress', {
  action: 'Feature Implementation',
  description: 'Completed user authentication module with JWT tokens'
});
```

### Pattern 3: Decision Logging

**Best Practice**: Log architectural decisions when made.

```typescript
// After making a design decision:
await mcp.callTool('log_decision', {
  title: 'Database Selection',
  context: 'Needed to choose database for new feature',
  decision: 'Selected PostgreSQL for reliability and features',
  alternatives: ['MySQL', 'MongoDB'],
  consequences: ['Need to set up PostgreSQL server', 'Strong ACID guarantees']
});
```

### Pattern 4: Mode-Specific Behavior

**Best Practice**: Switch modes based on task type.

```typescript
// When starting architectural work:
await mcp.callTool('switch_mode', {
  mode: 'architect'
});

// When implementing code:
await mcp.callTool('switch_mode', {
  mode: 'code'
});

// When debugging:
await mcp.callTool('switch_mode', {
  mode: 'debug'
});
```

### Pattern 5: Knowledge Graph Usage

**Best Practice**: Use the knowledge graph for project understanding.

```typescript
// Search for related concepts:
const results = await mcp.callTool('graph_search', {
  query: 'authentication',
  limit: 10
});

// Add new relationships:
await mcp.callTool('graph_link_entities', {
  from: 'UserService',
  relationType: 'depends_on',
  to: 'AuthModule',
  action: 'link'
});
```

## Mode-Specific Integration

Memory Bank MCP supports five operational modes, each optimized for different tasks:

### Architect Mode

**Use When**: Designing system architecture, planning components, making high-level decisions.

**Tools to Emphasize**:
- `log_decision` - Document architectural choices
- `update_active_context` - Update system design status
- `graph_upsert_entity` - Model system components
- `graph_link_entities` - Model component relationships

**Example System Prompt**:
```
You are in Architect mode. Focus on high-level system design, component relationships,
and architectural decisions. Use the knowledge graph to model system structure.
```

### Code Mode

**Use When**: Writing implementation code, refactoring, adding features.

**Tools to Emphasize**:
- `track_progress` - Log completed implementations
- `add_session_note` - Note code observations
- `read_memory_bank_file` - Reference system patterns
- `update_active_context` - Update implementation tasks

**Example System Prompt**:
```
You are in Code mode. Focus on clean implementation, following established patterns,
and tracking progress on coding tasks.
```

### Ask Mode

**Use When**: Answering questions, explaining concepts, providing information.

**Tools to Emphasize**:
- `get_context_digest` - Get full project context
- `search_memory_bank` - Find relevant information
- `graph_search` - Find related concepts
- `read_memory_bank_file` - Read documentation

**Example System Prompt**:
```
You are in Ask mode. Provide informative answers based on project context and
existing documentation. Use Memory Bank to find accurate information.
```

### Debug Mode

**Use When**: Investigating bugs, analyzing errors, troubleshooting issues.

**Tools to Emphasize**:
- `add_session_note` - Log debugging observations
- `track_progress` - Log bug fixes
- `graph_search` - Find related components
- `update_active_context` - Update known issues

**Example System Prompt**:
```
You are in Debug mode. Focus on systematic problem identification, root cause
analysis, and thorough testing of fixes.
```

### Test Mode

**Use When**: Writing tests, improving test coverage, ensuring quality.

**Tools to Emphasize**:
- `track_progress` - Log test additions
- `add_session_note` - Note testing observations
- `update_active_context` - Update testing tasks

**Example System Prompt**:
```
You are in Test mode. Focus on comprehensive test coverage, edge cases,
and maintaining test quality.
```

## Troubleshooting

### Memory Bank Not Found

**Symptom**: "Memory Bank not found" errors

**Solution**:
```typescript
// Use set_memory_bank_path to configure location:
await mcp.callTool('set_memory_bank_path', {
  path: '/absolute/path/to/memory-bank'
});

// Or initialize a new one:
await mcp.callTool('initialize_memory_bank', {
  path: './memory-bank'
});
```

### MCP Server Not Responding

**Symptom**: Tool calls timeout or fail

** Solutions**:
1. Verify Docker Compose stack is running: `docker compose ps`
2. Check server health: `curl http://localhost/health`
3. Check server logs: `docker compose logs -f mbmcp-server`
4. Verify API key is valid: `curl http://localhost/api/keys -H "Authorization: Bearer <key>"`
5. Check network connectivity from your AI assistant to the MCP server
6. Verify Traefik routing: `docker compose logs -f mbmcp-traefik`

### Authentication Errors

**Symptom**: 401 Unauthorized or 403 Forbidden errors

**Solutions**:
1. Verify your API key is correct
2. Check key scopes include the operation you're attempting
3. Verify key hasn't expired: `curl http://localhost/api/keys`
4. Try generating a new key with appropriate scopes
5. Check rate limits haven't been exceeded

### Connection Refused

**Symptom**: Connection refused or cannot connect errors

**Solutions**:
1. Verify the URL in your MCP configuration matches your deployment
2. If using Traefik: `http://localhost/mcp`
3. If direct connection: `http://localhost:3100/mcp`
4. Check firewall rules allow connections to the MCP port
5. Verify Traefik is routing correctly: check dashboard at `http://localhost:8080`

## Best Practices

### 1. Initialize Early

Create Memory Bank at project start:
```typescript
await mcp.callTool('initialize_memory_bank', {
  path: './memory-bank'
});
```

### 2. Track Regularly

Record progress and decisions as they happen, not after the fact.

### 3. Use Appropriate Modes

Switch modes based on current task for optimized tool selection and behavior.

### 4. Maintain Context

Regularly update active context with current tasks, known issues, and next steps.

### 5. Leverage Knowledge Graph

Use the graph to model project relationships for better context understanding.

### 6. Backup Regularly

Create backups before major changes:
```typescript
await mcp.callTool('create_backup', {
  backupDir: './backups'
});
```

### 7. Start with get_instructions

Always call `get_instructions` at the start of a session to load the complete tool reference.

## Example: VS Code / Claude Code Integration

For VS Code with Copilot or Claude Code, add to `.vscode/mcp.json` or `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "memory-bank": {
      "type": "http",
      "url": "http://localhost/mcp",
      "headers": {
        "Authorization": "Bearer mbmcp_live_xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

Then restart your editor. Memory Bank tools will appear in the tool palette.

## Example: Custom AI Assistant Integration

For custom AI assistants using the MCP SDK with HTTP transport:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { HttpClientTransport } from '@modelcontextprotocol/sdk/client/http.js';

// Create HTTP transport
const transport = new HttpClientTransport({
  url: 'http://localhost/mcp',
  headers: {
    'Authorization': 'Bearer mbmcp_live_xxxxxxxxxxxxxxxx'
  }
});

// Create MCP client
const client = new Client({
  name: 'my-ai-assistant',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Connect
await client.connect(transport);

// List available tools
const { tools } = await client.listTools();
console.log('Available tools:', tools.map(t => t.name));

// Call a tool
const result = await client.callTool({
  name: 'get_context_digest',
  arguments: { maxProgressEntries: 10 }
});
console.log('Context:', result.content);
```

## Deployment Requirements

### Minimum Requirements

- Docker Engine 24+ with Compose v2
- 512 MB RAM for MCP server
- 1 GB RAM for PostgreSQL
- 256 MB RAM for Redis
- Ports: 80/443 (Traefik), 3100 (MCP server), 5432 (Postgres), 6379 (Redis)

### Production Requirements

- 2 GB+ RAM recommended
- PostgreSQL with pgvector extension
- Redis for caching and rate limiting
- TLS certificates (Let's Encrypt via Traefik or manual)
- Backup strategy for Postgres data
- API key rotation policy
- Monitoring and logging

## See Also

- [Deployment Guide](../deployment/http-postgres-redis-supabase.md) - Complete deployment instructions
- [Generic MCP Integration Guide](./generic-mcp-integration.md) - HTTP configuration reference
- [Cursor Integration Guide](./cursor-integration.md) - Cursor-specific setup
- [Cline Integration Guide](./cline-integration.md) - Cline integration
- [Memory Bank Documentation](../../README.md) - Complete project documentation
- [Model Context Protocol Specification](https://github.com/ModelContext/protocol) - MCP standard

## Related Projects

- **Memory Bank MCP (stdio)**: [diaz3618/memory-bank-mcp](https://github.com/diaz3618/memory-bank-mcp) — npm package using stdio transport for local Claude Desktop/Cline integration
- **Memory Bank VS Code Extension**: [diaz3618/Memory-Bank-VSCode-Ext](https://github.com/diaz3618/Memory-Bank-VSCode-Ext) — Native VS Code extension with webview UI for browsing memory banks

---

*Memory Bank MCP HTTP — Persistent memory and context for AI assistants via Docker*
