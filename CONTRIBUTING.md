# Contributing to Memory Bank MCP

Thank you for your interest in contributing to Memory Bank MCP! This document provides guidelines for contributing to the project.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This leads to more readable messages that are easy to follow when looking through the project history and enables automatic generation of the changelog.

### Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**. The header has a special format that includes a **type**, an optional **scope**, and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory, and the **scope** of the header is optional.

### Type

The type must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

### Scope

The scope should be the name of the module affected (as perceived by the person reading the changelog).

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

### Body

The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

Breaking Changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Examples

```
feat(memory-bank): add support for custom templates

Add ability to use custom templates for Memory Bank files.

Closes #123
```

```
fix(core): resolve issue with file path resolution

The file path resolution was not working correctly on Windows.
This commit fixes the issue by using path.resolve() instead of
string concatenation.

Closes #456
```

```
feat!: change API for Memory Bank initialization

BREAKING CHANGE: The Memory Bank initialization API has changed.
The old method `initMemoryBank()` is replaced with `initializeMemoryBank()`.

Migration guide:
- Replace all calls to `initMemoryBank()` with `initializeMemoryBank()`
- The new method requires an additional parameter for configuration
```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. The Pull Request will be merged once you have the sign-off of at least one maintainer.

## Code of Conduct

Please note we have a code of conduct, please follow it in all your interactions with the project.

## License

By contributing to Memory Bank MCP, you agree that your contributions will be licensed under the project's MIT License.
