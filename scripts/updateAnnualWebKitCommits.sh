#!/bin/sh
echo "Updating annual WebKit commits"
python ./commitTracker.py --weekly --json-file ../presentations/commit-graph/commits.json
git add ../presentations/commit-graph/commits.json
git commit -m "update annual WebKit commits"
