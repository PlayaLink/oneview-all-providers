#!/bin/bash
# Script to set git branch as environment variable for Vite build

# Get the current git branch
GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Export it for Vite to use
export VITE_GIT_BRANCH="$GIT_BRANCH"

echo "Set VITE_GIT_BRANCH=$GIT_BRANCH"

# Run the original command
exec "$@"
