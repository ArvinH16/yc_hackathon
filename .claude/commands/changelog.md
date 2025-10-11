---
allowed-tools: Bash(git log:*), Bash(git tag:*), Bash(git describe:*), Bash(git rev-parse:*), Bash(git remote:*)
description: Generate or update CHANGELOG.md from git history
---

Generate or update a comprehensive, well-formatted CHANGELOG.md file based on the git history. Follow these steps:

## 1. Analyze Git Repository

First, gather information about the repository:
- Check if CHANGELOG.md already exists
- Get all git tags to identify versions
- Get the remote repository URL (if exists) for generating commit links
- Analyze commit history to understand the project's development

## 2. Extract and Categorize Commits

Use git commands to extract commits and categorize them by:
- Version tags (if available) or by month/date ranges if no tags exist
- Conventional commit patterns for automatic categorization:
  - `feat:` or `feature:` → 🚀 Features
  - `fix:` or `bugfix:` → 🐛 Bug Fixes
  - `docs:` or `documentation:` → 📝 Documentation
  - `style:` or `styling:` → 💄 Styling
  - `refactor:` → ♻️ Code Refactoring
  - `perf:` or `performance:` → ⚡ Performance Improvements
  - `test:` or `tests:` → ✅ Tests
  - `build:` → 📦 Build System
  - `ci:` → 👷 CI/CD
  - `chore:` → 🔧 Chores
  - `revert:` → ⏪ Reverts
  - Other commits → 🔄 Other Changes

## 3. Generate Changelog Structure

Create a CHANGELOG.md with the following format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
*Changes in the current development version that haven't been released yet*

### 🚀 Features
- **YYYY-MM-DD**: Clear description of feature ([hash](link))

### 🐛 Bug Fixes
- **YYYY-MM-DD**: Clear description of fix ([hash](link))

[Continue with other categories if commits exist]

## [Version] - YYYY-MM-DD
*Previous releases...*
```

## 4. Implementation Guidelines

- **ALWAYS include dates**: Each entry must be prefixed with **YYYY-MM-DD** format
- **User-friendly descriptions**: Rewrite commit messages to be clear and meaningful to end users
- **For existing CHANGELOG.md**: Update only the [Unreleased] section with new commits since the last entry
- **For new CHANGELOG.md**: Generate complete history organized by versions or date ranges
- **Include commit hashes**: Show short hash (7 chars) with links if GitHub/GitLab remote detected
- **Handle breaking changes**: Highlight with ⚠️ BREAKING CHANGE if found in commit body
- **Smart filtering**: Skip merge commits, dependabot commits, and automated commits
- **Date format**: Use ISO format (YYYY-MM-DD) for all dates
- **Version detection**: Use tags if available, otherwise use date-based sections
- **Chronological order**: Most recent changes first within each section

## 5. Special Handling

- **User-facing language**: Transform technical commit messages into clear, benefit-focused descriptions
  - Instead of: "fix: resolve null pointer in auth handler"
  - Write: "Fixed authentication crash when logging in with certain credentials"
- If no tags exist, group commits by month (e.g., "## 2025-01 - January 2025")
- For monorepos, detect scope from commit messages (e.g., "feat(api): ...")
- Detect and link PR numbers when found in commit messages (#123)
- Include author names for significant changes if requested via argument
- **Group related commits**: Combine multiple commits about the same feature into one changelog entry

## 6. Final Steps

After generating:
1. If CHANGELOG.md is new, create it in the repository root
2. If updating, preserve existing content and only modify [Unreleased] section
3. Ensure proper markdown formatting and consistent styling
4. Report what was added/changed to the user

## Arguments Support

If arguments are provided as $ARGUMENTS, handle these options:
- `--full`: Regenerate entire changelog from scratch
- `--authors`: Include commit authors
- `--since=<date>`: Only include commits after specified date
- `--tag=<version>`: Generate changelog for specific version tag

Execute this comprehensive changelog generation now, using git commands to gather all necessary information and create a professional, well-organized CHANGELOG.md file.