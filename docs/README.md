# Memory Bank MCP — Documentation

## Getting Started

- [Build with Bun](getting-started/build-with-bun.md) — Local development build
- [Custom Folder Name](getting-started/custom-folder-name.md) — Change the default `memory-bank/` directory

## Deployment

- [HTTP + Postgres + Redis + Supabase](deployment/http-postgres-redis-supabase.md) — Full stack deployment guide

## Guides

- [Usage Modes](guides/usage-modes.md) — Architect, code, ask, debug, test
- [Migration](guides/migration-guide.md) — Upgrading from older versions
- [Memory Bank Status](guides/memory-bank-status-prefix.md) — Understanding status indicators
- [Debug MCP Config](guides/debug-mcp-config.md) — Troubleshoot connection issues

## Integrations

- [AI Assistants (general)](integration/ai-assistant-integration.md) — Generic MCP integration patterns
- [VS Code with Copilot](integration/vscode-copilot-integration.md) — GitHub Copilot integration
- [Claude Code](integration/claude-code-integration.md) — Anthropic Claude Code integration
- [Cursor](integration/cursor-integration.md) — Cursor IDE
- [Cline](integration/cline-integration.md) — VS Code extension with `.clinerules` support
- [Roo Code](integration/roo-code-integration.md) — VS Code extension
- [Generic MCP](integration/generic-mcp-integration.md) — MCP-compatible clients

## Reference

- [MCP Protocol Specification](reference/mcp-protocol-specification.md) — HTTP/SSE MCP protocol, tools & resources
- [Rule Formats](reference/rule-formats.md) — `.clinerules-*` and `.mcprules-*` file syntax
- [Rule Examples](reference/rule-examples.md) — Sample rule configurations
- [File Naming Convention](reference/file-naming-convention.md) — Naming conventions
- [Redis Conventions](reference/redis-conventions.md) — Redis key patterns and data structures
- [Requirements](reference/requirements.md) — MCP client requirements

## Development

- [Testing Guide](development/testing-guide.md) — How to run and write tests
- [Cline Rules Testing](development/testing-clinerules.md) — Testing `.clinerules` integration
- [Integration Testing](development/integration-testing-guide.md) — E2E test patterns
- [Test Coverage](development/test-coverage.md) — Coverage reports
- [Memory Bank MCP Startup](development/memory-bank-mcp-startup.md) — CLI options and initialization
- [Logging System](development/logging-system.md) — Log levels and configuration

## Related Projects

- **Memory Bank MCP (stdio)**: [diaz3618/memory-bank-mcp](https://github.com/diaz3618/memory-bank-mcp) — npm package using stdio transport
- **Memory Bank VS Code Extension**: [diaz3618/Memory-Bank-VSCode-Ext](https://github.com/diaz3618/Memory-Bank-VSCode-Ext) — Native VS Code extension

## Internal Documentation

- [Research](internal/research/) — External project research and findings
- [Archived Documentation](archive/) — Obsolete docs preserved for reference
