# Branching Strategy

## Branch Structure

```
main (protected)
  └── dev (default branch for development)
       ├── feature/feature-name
       ├── fix/bug-name
       ├── refactor/refactor-name
       └── chore/task-name
```

## Branches

### `main` - Production Branch
- **Protected**: No direct commits allowed
- **Purpose**: Production-ready code only
- **Updates**: Only through PRs from `dev`
- **Status**: Should always be stable and deployable

### `dev` - Development Branch
- **Default branch**: Where you work day-to-day
- **Purpose**: Integration branch for all features
- **Updates**: Merge feature branches here
- **Status**: Should be stable but can have WIP features

### Feature Branches
- **Naming**: `feature/`, `fix/`, `refactor/`, `chore/`
- **Branch from**: `dev`
- **Merge into**: `dev`
- **Delete after**: Merge is complete

## Workflow

### 1. Daily Development
```powershell
# Always work from dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/new-feature

# Make changes, commit
git add .
git commit -m "feat: add new feature"

# Push feature branch
git push -u origin feature/new-feature

# Create PR to dev (not main!)
# After approval, merge to dev
# Delete feature branch
```

### 2. Release to Production
```powershell
# When dev is stable and tested
git checkout dev
git pull origin dev

# Create PR from dev to main on GitHub
# IMPORTANT: When merging PR, use "Squash and merge" option
# This creates clean commit history instead of "Merge pull request #XX"
# Result: "feat(feature): description (#20)" instead of "Merge pull request #20"

# After PR is merged, sync dev with main
git pull origin main

# Tag the release (optional)
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
git checkout dev
```

### 3. Hotfix (Emergency Production Fix)
```powershell
# Branch from main for urgent fixes
git checkout main
git checkout -b hotfix/critical-bug

# Fix and commit
git add .
git commit -m "fix: critical bug in production"

# Create PR to main
# After merge, also merge back to dev
git checkout dev
git merge main
git push origin dev
```

## Branch Protection Rules

### On GitHub (requires repo settings):

1. **Go to**: Repository → Settings → Branches
2. **Add rule for `main`**:
   - ✅ Require pull request before merging
   - ✅ Require approvals (1 minimum)
   - ✅ Require status checks to pass (Cypress E2E tests)
   - ✅ Require conversation resolution
   - ✅ Do not allow bypassing (even for admins)

3. **Set `dev` as default branch**:
   - Repository → Settings → Branches → Default branch → Change to `dev`

4. **Configure merge options**:
   - Repository → Settings → General → Pull Requests
   - ✅ Enable "Allow squash merging" (RECOMMENDED)
   - ⚠️ Disable "Allow merge commits" (to prevent "Merge pull request" commits)
   - Optional: Enable "Allow rebase merging"
   - ✅ "Automatically delete head branches" after merge

## Git Hook to Prevent Direct Commits to Main

Create `.git/hooks/pre-commit` (local protection):

```bash
#!/bin/sh
branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "main" ]; then
  echo "🚫 You cannot commit directly to main branch!"
  echo "💡 Please create a feature branch or switch to dev:"
  echo "   git checkout dev"
  echo "   git checkout -b feature/your-feature"
  exit 1
fi
```

## Quick Reference

```powershell
# Switch to dev
git checkout dev

# Create feature branch
git checkout -b feature/your-feature

# See current branch
git branch --show-current

# List all branches
git branch -a

# Delete local feature branch after merge
git branch -d feature/your-feature

# Delete remote feature branch
git push origin --delete feature/your-feature
```

## Commit Message Convention

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style/formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

## When to Merge to Main

Only merge `dev → main` when:
- ✅ All features are tested
- ✅ No critical bugs
- ✅ Ready for production/deployment
- ✅ Documentation is updated
- ✅ All tests pass (Cypress E2E tests)
- ✅ CI/CD pipeline passes

Typical frequency: Weekly, biweekly, or per sprint

## Best Practices for Clean History

### Use "Squash and Merge" for PRs
When merging PRs on GitHub:
1. Click dropdown arrow next to "Merge pull request"
2. Select **"Squash and merge"**
3. Edit commit message if needed (follows conventional commits format)
4. Result: One clean commit per PR instead of multiple merge commits

**Example:**
- ❌ Bad: `Merge pull request #20 from odanree/dev`
- ✅ Good: `feat(cart): add shopping cart functionality (#20)`

### Keep Commits Atomic
- One logical change per commit
- Write clear, descriptive commit messages
- Follow conventional commits format
- Reference issue numbers when applicable
