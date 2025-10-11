---
thinking-mode: on
allowed-tools: Bash, Read, Grep, Glob, Write
argument-hint: <pr-number-or-url> (optional, defaults to latest PR)
description: Generate comprehensive PR documentation with BEFORE/AFTER analysis
---

# PR Recap - Comprehensive Pull Request Documentation

I'll analyze the specified PR (or the latest PR if none specified) and create a detailed
comment documenting all changes with BEFORE/AFTER comparisons and in-depth explanations.

## Parse PR Target

First, let me determine which PR to analyze:

Arguments provided: $ARGUMENTS

### PR Resolution Strategy
1. If a GitHub PR URL is provided → Extract PR number from URL
2. If a PR number is provided → Use that PR number
3. If no argument → Find the latest PR for current branch or repository

Let me identify the target PR...

## Gather PR Information

Using the GitHub CLI to fetch comprehensive PR data:

```bash
# Get PR details including title, description, author, and base/head branches
gh pr view [PR] --json title,body,author,baseRefName,headRefName,number,url,state,files,additions,deletions

# Fetch the complete diff
gh pr diff [PR]

# Get list of changed files
gh pr view [PR] --json files -q '.files[].path'

# Get PR commits for understanding change progression
gh pr view [PR] --json commits
```

## Deep Analysis Phase

### 1. File Change Analysis

For each changed file, I'll:
- Read the current version (if it exists)
- Analyze the diff to understand what changed
- Identify the type of change (feature, refactor, bugfix, etc.)
- Document the impact on functionality

### 2. Pattern and Architecture Analysis

I'll examine:
- Architectural patterns modified or introduced
- Dependencies added or removed
- API changes (endpoints, interfaces, types)
- Database schema modifications
- Configuration changes
- Testing coverage changes

### 3. Behavior Change Documentation

For each significant change, I'll document:
- **Previous Behavior**: How the feature/component worked before
- **New Behavior**: How it works after the PR
- **Reason for Change**: Why this modification was necessary
- **User Impact**: How this affects end users or developers

## Generate Comprehensive Documentation

Let me create the detailed PR recap comment:

```markdown
# 📊 PR Recap: [PR Title]

**PR:** #[number] | **Author:** @[author] | **Base:** `[base]` ← **Head:** `[head]`

## 🎯 Executive Summary

[High-level description of what this PR accomplishes, why it was needed, and its overall impact]

## 📝 Detailed Changes Analysis

### Change Categories
- 🆕 **New Features**: [count]
- 🔧 **Improvements**: [count]
- 🐛 **Bug Fixes**: [count]
- ♻️ **Refactoring**: [count]
- 📚 **Documentation**: [count]
- 🧪 **Tests**: [count]

---

## 🔄 BEFORE vs AFTER Comparison

[For each major change area:]

### [Component/Feature Name]

#### BEFORE 🔴
```
[Previous implementation details]
- How it worked
- Limitations or issues
- Code structure/patterns used
```

#### AFTER ✅
```
[New implementation details]
- How it works now
- Improvements made
- New patterns/structure
```

#### WHY THIS CHANGE? 💡
[Explanation of the rationale behind this change]

#### IMPACT ANALYSIS 📈
- **User Impact**: [How users are affected]
- **Developer Impact**: [How developers are affected]
- **Performance Impact**: [Any performance implications]
- **Breaking Changes**: [Yes/No - details if yes]

#### TECHNICAL DETAILS 🔧
```[language]
// Key code changes illustrated
[Relevant code snippets showing the transformation]
```

---

[Repeat for each significant change area]

## 📁 File-by-File Summary

### Modified Files ([total count])

[Group by directory/component for better organization]

#### [Directory/Component Name]

| File | Changes | Description |
|------|---------|-------------|
| `[path/to/file]` | +[additions] -[deletions] | [What changed and why] |
| `[path/to/file]` | +[additions] -[deletions] | [What changed and why] |

### New Files ([count])

| File | Purpose |
|------|---------|
| `[path/to/new/file]` | [What this file does and why it was added] |

### Deleted Files ([count])

| File | Reason for Deletion |
|------|---------------------|
| `[path/to/deleted/file]` | [Why this was removed] |

## ⚡ Key Improvements

1. **[Improvement Title]**
   - What was improved
   - How it benefits the project
   - Metrics if applicable

2. **[Additional improvements...]**

## 🏗️ Architecture & Design Changes

### Patterns Introduced/Modified
- [Pattern name]: [How it's used and why]

### Dependencies
- **Added**: [New dependencies and their purpose]
- **Removed**: [Removed dependencies and why]
- **Updated**: [Version changes and implications]

### API Changes
[Document any API endpoint changes, including request/response format changes]

### Database Changes
[Document schema changes, migrations, or data structure modifications]

## ⚠️ Important Considerations

### Breaking Changes
[List any breaking changes with migration instructions]

### Migration Requirements
[Steps needed to migrate from previous version]

### Deployment Notes
[Special considerations for deployment]

### Configuration Changes
[New environment variables or config changes needed]

## 🧪 Testing Coverage

### Tests Added/Modified
- [Test file]: [What it tests]
- [Coverage areas]: [What's now covered]

### Testing Recommendations
- [Additional testing that should be performed]
- [Edge cases to consider]

## 📊 Code Metrics

- **Files Changed**: [count]
- **Lines Added**: +[additions]
- **Lines Removed**: -[deletions]
- **Net Change**: [net]
- **Test Coverage Impact**: [coverage change if available]

## 🔍 Review Checklist

- [ ] All changes align with PR objectives
- [ ] No unintended changes included
- [ ] Tests cover new functionality
- [ ] Documentation updated where needed
- [ ] Breaking changes clearly documented
- [ ] Performance implications considered
- [ ] Security implications reviewed
- [ ] Code follows project conventions

## 📚 Related Documentation

- [Links to updated documentation]
- [Related issues or PRs]
- [External references]

## 💭 Additional Context

[Any additional context, future considerations, or follow-up work needed]

---

*Generated by PR Recap Command - Ensuring comprehensive PR documentation for better code review and future reference*
```

## Post Comment to PR

Now I'll post this comprehensive recap as a comment on the PR:

```bash
# Save the comment to a file first (as backup)
cat > /tmp/pr-recap-comment.md << 'EOF'
[Generated comment content]
EOF

# Post the comment to the PR
gh pr comment [PR] --body-file /tmp/pr-recap-comment.md
```

## Completion Message

I've successfully created and posted a comprehensive PR recap comment that includes:

✅ Detailed BEFORE/AFTER comparisons for all changes
✅ In-depth technical explanations
✅ Impact analysis for users and developers
✅ File-by-file change documentation
✅ Architecture and pattern analysis
✅ Breaking changes and migration notes
✅ Testing coverage information
✅ Review checklist for thoroughness

The comment has been posted to PR #[number] and saved to `/tmp/pr-recap-comment.md` for reference.

## Error Handling

If I encounter any issues:
- **No PR found**: I'll provide instructions on creating a PR first
- **Authentication issues**: I'll guide you through `gh auth login`
- **Large PR**: I'll break down the analysis into multiple comments if needed
- **Posting fails**: I'll save the recap to a file and provide the content for manual posting