#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   ./git_push_with_pat.sh "Your commit message"
#
# Optional overrides:
#   GIT_PAT_TOKEN=... GITHUB_OWNER=... GITHUB_REPO=... ./git_push_with_pat.sh "msg"

GIT_PAT_TOKEN="${GIT_PAT_TOKEN:-}"
GITHUB_OWNER="${GITHUB_OWNER:-tanishq-m}"
GITHUB_REPO="${GITHUB_REPO:-anniversary}"
BRANCH="${BRANCH:-main}"
COMMIT_MESSAGE="${1:-Update project files}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: run this script from inside a git repository."
  exit 1
fi

if [[ -z "${GIT_PAT_TOKEN}" ]]; then
  echo "Error: GIT_PAT_TOKEN is empty. Export your PAT first."
  echo "Example: export GIT_PAT_TOKEN=your_token_here"
  exit 1
fi

echo "Staging all changes..."
git add .

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  echo "Creating commit: ${COMMIT_MESSAGE}"
  git commit -m "${COMMIT_MESSAGE}"
fi

echo "Syncing with remote ${BRANCH}..."
git fetch "https://${GIT_PAT_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git" "${BRANCH}"
if git show-ref --verify --quiet "refs/remotes/origin/${BRANCH}"; then
  git rebase "origin/${BRANCH}"
fi

echo "Pushing to ${GITHUB_OWNER}/${GITHUB_REPO} (${BRANCH})..."
git push "https://${GIT_PAT_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git" "${BRANCH}"

echo "Commit and push completed successfully."
