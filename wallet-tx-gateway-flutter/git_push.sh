#!/bin/sh
# ref: https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/
#
# Usage example: /bin/sh ./git_push.sh wing328 "minor fix" "feature1,feature2"

app_name=`basename "$(pwd)"`
commit_msg=$1
tag=$2

if [ -z "$commit_msg" ]; then
  commit_msg="Minor update"
fi

# Tag
if [ -z "$tag" ]; then
  tag="${app_name}-v0.1.0"
fi

# Branch
branch="main"

# Directory
current_dir=$(pwd)
cd "$(dirname "$0")"

# git
git add -A
git commit -m "$commit_msg"
git tag "$tag"
git push origin "$branch"
git push origin "$tag"

cd "$current_dir"
