#!/bin/sh

#  CommitTracker.sh
#  
#
#  Created by Larry McLister on 2/22/12.

# Assemble date+time
mydate=$(date +%Y.%m.%d)
mydate=${mydate%% }
mydate=${mydate## }
#echo "mydate: $mydate"

mytime=$(date +%k.%M)
mytime=${mytime%% }
mytime=${mytime## }
#echo "mytime: $mytime"
now=$mydate.$mytime
#echo "now: $now"

# Assemble log file names
gitLogByAuthor=$now.commits_commit.txt
# echo "gitlogByAuthor: $gitlogByAuthor"
gitLogByPatch=$now.commits_patch.txt
# echo "gitlogByPatch: $gitlogByPatch"
gitLogByReview=$now.commits_review.txt
# echo "gitlogByPatch: $gitLogByReview"

#Dirk log names
gitLogByAuthorDirk=$now.commits_commitDirk.txt
gitLogByPatchDirk=$now.commits_patchDirk.txt
gitLogByReviewDirk=$now.commits_reviewDirk.txt

# Switch to Webkit dir
# Set these to the appropriate paths for your setup.
homedir="/Users/lmcliste"
webkithome="$homedir/WebKit"
echo changing to WebKit home directory...
cd $webkithome
echo "Executing in $PWD. Logs will be written to $homedir."

# Get latest src
echo starting git fetch…
git fetch

# Search for commits where we are the Author/Committer
echo "looking for 'Author:'..."
git log | grep "^[\\t ]*Author: " | sed "s/ <.*//; s/ *//; s/^[\\t ]*Author: //" | sort | uniq -c | sort -nr  | egrep 'mihnea@adobe.com|achicu@adobe.com' > $homedir/$gitLogByAuthor

# Search for commits where we created reviewed the patch
echo "looking for 'Reviewed by'..."
git log | grep "^[\\t ]*Reviewed by " | sed 's/ <.*//; s/\\t*//; s/ *//; s/^[\\t ]*Reviewed by //' | sort | uniq -c | sort -nr  | egrep 'Bear Travis|Mihnea|Chiculita|Raul Hudea|Max Vujovic|Hans Muller|Ethan Malasky|Arno Gourdol|Alan Stearns|Larry McLister|Jacob Goldstein' > $homedir/$gitLogByReview

# Search for commits where we created the patch
echo "looking for 'Patch by'..."
git log | grep "^[\\t ]*Patch by " | sed 's/ <.*//; s/\\t*//; s/ *//; s/^[\\t ]*Patch by //' | sort | uniq -c | sort -nr  | egrep 'Bear Travis|Mihnea|Chiculita|Raul Hudea|Max Vujovic|Hans Muller|Ethan Malasky|Arno Gourdol|Alan Stearns|Larry McLister|Jacob Goldstein' > $homedir/$gitLogByPatch

# Super special Dirk section.  Counting his data since 11/01/2011
echo "Dirk section..."
# Search for commits where Dirk are the Author/Committer
echo "looking for 'Author:'..."
git log --since="11/01/2011" | grep "^[\\t ]*Author: " | sed "s/ <.*//; s/ *//; s/^[\\t ]*Author: //" | sort | uniq -c | sort -nr  | egrep 'krit@webkit.org' > $homedir/$gitLogByAuthorDirk

# Search for commits where Dirk created reviewed the patch
echo "looking for 'Reviewed by'..."
git log --since="11/01/2011" | grep "^[\\t ]*Reviewed by " | sed 's/ <.*//; s/\\t*//; s/ *//; s/^[\\t ]*Reviewed by //' | sort | uniq -c | sort -nr  | egrep 'Dirk Schulze' > $homedir/$gitLogByReviewDirk

# Search for commits where Dirk created the patch
echo "looking for 'Patch by'..."
git log --since="11/01/2011" | grep "^[\\t ]*Patch by " | sed 's/ <.*//; s/\\t*//; s/ *//; s/^[\\t ]*Patch by //' | sort | uniq -c | sort -nr  | egrep 'Dirk Schulze' > $homedir/$gitLogByPatchDirk



 