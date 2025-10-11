---
thinking-mode: on
allowed-tools: Bash, Read, Grep, Glob, Edit, MultiEdit
argument-hint: [additional-pr-context]
description: Prepare and finalize pull request for review
---

# Wrap Up Pull Request

We are about to wrap up working on this branch and submit a pull request for review. I'll prepare this pull request by completing the following steps:

## Step 1: Code Quality Checks

### Linting
- Run `npm run lint:fix` to automatically fix linting issues
- Resolve any remaining linting errors (warnings can be ignored)

### Type Checking
- Run `npm run typecheck` to identify TypeScript errors
- Fix all type errors in both API and webapp

## Step 2: Analyze Changes

### Gather Context
- Review git log to understand all commits on this branch
- Check git diff to see the complete set of changes
- Examine modified files to understand the scope of work

### Documentation Review
- Check if any documentation needs updating based on changes
- Verify CLAUDE.md is up to date if new commands were added

## Step 3: Create/Update Pull Request

### PR Description Format
I'll create or update the pull request with:

1. **Title**: Clear, concise summary of the main change
2. **Summary**: Brief description of what was accomplished
3. **Changes**: Detailed bullet points of all modifications including:
   - New features and functionality
   - Bug fixes and improvements
   - Refactoring and code organization
   - Documentation updates
   - Configuration changes

### GitHub CLI Operations
- Check if PR already exists for this branch
- Create new PR or update existing one
- Use comprehensive commit history and diff analysis for description
- Include any additional context from: $ARGUMENTS

## Step 4: Final Verification

### Pre-PR Checklist
- All tests passing (if applicable)
- No linting errors
- No TypeScript errors
- Documentation updated
- Commits are logical and well-messaged

Let me begin by running the code quality checks...
