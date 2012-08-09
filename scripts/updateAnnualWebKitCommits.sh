#!/bin/sh

python ./commitTracker.py --no-fetch --weekly --json-file ../presentations/commit-graph/commits.json
git add ../presentations/commit-graph/commits.json
git commit -m "update annual WebKit commits"
