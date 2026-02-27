# Cline Integration

## Overview

[Cline](https://github.com/cline/cline) is an AI coding assistant for VS Code. Memory Bank MCP HTTP integrates with Cline through the Model Context Protocol (MCP) using HTTP transport.

> **Note**: This repo uses **HTTP/SSE transport** for Docker-based deployments.  
> Looking for the **stdio/npm version** for local Cline integration? → [diaz3618/memory-bank-mcp](https://github.com/diaz3618/memory-bank-mcp)

**Important**: Memory Bank MCP does **NOT** require Cline to function. The `.clinerules` file format was adopted as an optional feature for Cline compatibility, but Memory Bank works standalone with any MCP-compatible AI assistant.

## Prerequisites

Before integrating with Cline, you need:

1. **Running Docker Compose stack**: Follow the [Deployment Guide](../deployment/http-postgres-redis-supabase.md)
2. **API key**: Generate one using the API key management endpoints
3. **Network access**: Cline must be able to reach the MCP server URL

## Setup with Cline

Add Memory Bank MCP HTTP to Cline's MCP configuration in VS Code settings or `~/.cline/mcp_config.json`:

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

Cline can now use all Memory Bank MCP tools via MCP.

## Generate an API Key

Create a new API key via the REST API:

```bash
curl -X POST http://localhost/api/keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "cline-key",
    "scopes": ["read", "write"],
    "rateLimit": 1000,
    "expiresIn": "30d"
  }'
```

Copy the returned `key` value and use it in your Cline configuration above.

See the [Deployment Guide](../deployment/http-postgres-redis-supabase.md#api-key-management) for complete API key documentation.

## `.clinerules` Files for Mode Configuration

The `.clinerules` system enables mode-specific behaviors. This works with OR without Cline.

## Supported Files

The Memory Bank Server supports the following `.clinerules` files:

- `.clinerules-architect`: Rules for the Architect mode, focused on design and architecture
- `.clinerules-ask`: Rules for the Ask mode, focused on answering questions
- `.clinerules-code`: Rules for the Code mode, focused on code implementation
- `.clinerules-debug`: Rules for the Debug mode, focused on debugging
- `.clinerules-test`: Rules for the Test mode, focused on testing

## Structure of .clinerules Files

Each `.clinerules` file must follow a specific structure:

```json
{
  "mode": "mode_name",
  "instructions": {
    "general": ["Instruction 1", "Instruction 2", "..."],
    "umb": {
      "trigger": "^(Update Memory Bank|UMB)$",
      "instructions": ["UMB Instruction 1", "UMB Instruction 2", "..."],
      "override_file_restrictions": true
    },
    "memory_bank": {}
  },
  "mode_triggers": {
    "other_mode": [{ "condition": "trigger_for_other_mode" }]
  }
}
```

## Automatic Creation of .clinerules Files

### Feature Overview

The Memory Bank Server automatically creates missing `.clinerules` files during initialization. Previously, the system would fail if any of the required `.clinerules` files were missing. Now, it will automatically create the missing files using predefined templates.

### Template System

- A file `src/utils/ClineruleTemplates.ts` contains templates for all required `.clinerules` files
- Each template follows the current structure and format of the corresponding `.clinerules` file
- A utility function `getTemplateForMode(mode: string)` retrieves the template for a specific mode

### ExternalRulesLoader Enhancements

- A method `createMissingClinerules(missingFiles: string[])` in the `ExternalRulesLoader` class creates the missing `.clinerules` files using the templates
- It returns information about which files were successfully created and which failed

### MemoryBankManager Updates

- `initializeMemoryBank` has been modified to create missing `.clinerules` files instead of failing
- `initializeModeManager` has been modified to create missing `.clinerules` files before initializing the mode manager
- Both methods now log information about the creation process and only fail if the creation of any file fails

## Supported Features

### 1. Modes

The Memory Bank Server supports switching between different modes based on the available `.clinerules` files. Each mode can have specific behaviors and rules.

### 2. Status Prefix

All server responses include a status prefix that indicates whether the Memory Bank is active:

- `[MEMORY BANK: ACTIVE]`: Indicates that a Memory Bank was found and is being used
- `[MEMORY BANK: INACTIVE]`: Indicates that no Memory Bank was found

### 3. UMB Command (Update Memory Bank)

The UMB command allows temporarily updating Memory Bank files, even in modes that normally have restricted file access.

To use UMB mode with the `switch_mode` tool:

```json
{
  "name": "switch_mode",
  "arguments": {
    "umb": true,
    "umbCommand": "Update Memory Bank"
  }
}
```

After completing the updates, switch back to normal mode:

```json
{
  "name": "switch_mode",
  "arguments": {
    "mode": "code"
  }
}
```

### 4. Mode Triggers

Mode triggers allow automatic detection of situations that may require a mode change. When a trigger is detected, the server suggests switching to the corresponding mode.

## Mode Management

Use the `switch_mode` tool to change operational modes or get current mode info:

### Switch to a Specific Mode

```json
{
  "name": "switch_mode",
  "arguments": {
    "mode": "architect"
  }
}
```

### Get Current Mode Information

```json
{
  "name": "switch_mode",
  "arguments": {}
}
```

The server will return information about the current mode and available modes.

   ```json
   {
     "name": "switch_mode",
     "arguments": {
       "mode": "code"
     }
   }
   ```

## Impact for Users

- Users no longer need to manually create `.clinerules` files before initializing a Memory Bank
- The system will automatically create any missing files with sensible defaults
- This makes the system more user-friendly and reduces the chance of initialization failures

## Impact for Developers

- The template system makes it easy to update the default content of `.clinerules` files
- The creation process is well-documented and tested
- The system still validates that all required files exist, but now has a fallback mechanism to create them if needed

## Security Considerations

- UMB mode allows temporary file modifications, but only for files within the Memory Bank
- File restrictions are applied based on the current mode
- Only modes with corresponding `.clinerules` files are available

## Testing

New tests have been added to verify the automatic creation of `.clinerules` files:

1. `initializeMemoryBank should succeed even if .clinerules files are missing`: Verifies that `initializeMemoryBank` creates missing `.clinerules` files and succeeds.
2. `initializeModeManager should create missing .clinerules files`: Verifies that `initializeModeManager` creates missing `.clinerules` files.

---

_Last updated: March 8, 2024_
