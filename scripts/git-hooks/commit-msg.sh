#!/usr/bin/env bash

# Validate commit log
commit_regex='^Merge.+|(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|types)(\(.+\))?: .{1,50}'

if ! grep -iqE "$commit_regex" "$1"; then
    echo
    echo "  Error: proper commit message format is required for automated changelog generation."
    echo
    echo "  - Use \`npm run commit\` to interactively generate a commit message."
    echo "  - See .github/COMMIT_CONVENTION.md for more details."
    echo
    exit 1
fi