---
thinking-mode: on
allowed-tools: "*"
argument-hint: <plan-file-path>
description: Execute implementation from plan file
---

# Implement Plan

## Plan to Execute: $ARGUMENTS

I will now execute the implementation plan systematically. Let me first locate and review the plan.

## Step 1: Load and Review Plan

First, I'll read the implementation plan from the specified file or find the most recent plan if no file is specified:
- If a path is provided: Read from $ARGUMENTS
- If no path: Find the most recent plan in ./tmp folder

## Step 2: Plan Analysis

Review the plan to understand:
- Implementation phases
- Task checklist
- Technical requirements
- Dependencies
- Success criteria

## Step 3: Pre-Implementation Setup

Before starting implementation:
1. Review current git status and create feature branch if needed
2. Verify all prerequisites are met
3. Check for any blocking dependencies
4. Review referenced documentation
5. Set up the TodoWrite list based on plan checklist

## Step 4: Systematic Implementation

Execute the plan following these principles:

### Phase-by-Phase Execution
- Complete each phase before moving to the next
- Mark checklist items as completed in both TodoWrite and the plan file
- Update plan file checkboxes (- [ ] to - [x]) to track actual progress
- Update TodoWrite progress in real-time
- Verify each phase meets success criteria

### For Each Implementation Task:
1. **Read** relevant existing code
2. **Understand** current patterns and conventions
3. **Implement** following existing patterns
4. **Verify** the implementation works
5. **Mark** task as complete in TodoWrite
6. **Update** plan file checkboxes: If the plan has checkboxes (- [ ]), check them off (- [x]) as tasks are completed

### Code Quality Standards:
- Follow existing code conventions
- Use established patterns from the codebase
- Maintain consistent naming conventions
- Add proper TypeScript types
- Follow the architecture documented in ./docs

### Implementation Order:
1. **Database/Schema changes** (if needed)
2. **Backend API endpoints** (if needed)
3. **Frontend services/hooks** (if needed)
4. **UI Components** (if needed)
5. **Integration and connections**
6. **Clean up and optimization**

## Step 5: Continuous Verification

During implementation:
- Run `npm run lint:fix` after significant changes
- Run `npm run typecheck` to catch type errors early
- Test functionality as it's built
- Commit changes at logical checkpoints

## Step 6: Progress Tracking

Maintain clear progress visibility:
- Update TodoWrite list continuously
- Mark completed items immediately
- Check off checkboxes in the plan file (- [ ] → - [x]) as tasks complete
- Add discovered tasks to the list
- Keep one task in_progress at a time
- Regularly save plan file updates to maintain accurate progress record

## Step 7: Completion Verification

After implementation:
1. Verify all checklist items are complete
2. Run full lint and typecheck
3. Ensure all success criteria are met
4. Review changes for consistency
5. Update any affected documentation

## Notes:
- I will maintain focus on the plan's objectives
- I will not add features beyond the plan's scope
- I will follow existing patterns rather than introducing new ones
- I will ask for clarification if requirements are unclear
- I will track all progress transparently through TodoWrite

Let me begin by loading and reviewing the implementation plan...