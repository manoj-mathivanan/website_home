#!/bin/sh
# Run on the existing VPS after cloning/updating this independent repository.
# No application runtime or dependencies are needed for this static site.
set -eu

source_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
commit=$(git -C "$source_dir" rev-parse HEAD)
release="/srv/home/releases/$commit"

if [ ! -d "$release" ]; then
    staging=$(mktemp -d /srv/home/releases/.staging.XXXXXX)
    trap 'rm -rf "$staging"' EXIT HUP INT TERM
    git -C "$source_dir" archive HEAD index.html src public | tar -x -C "$staging"
    # Public assets live at the origin root; repository documents stay private.
    cp -a "$staging/public/." "$staging/"
    rm -r "$staging/public"
    chmod -R a+rX "$staging"
    chmod 755 "$staging"
    mv "$staging" "$release"
    trap - EXIT HUP INT TERM
fi

test -f "$release/index.html"
test -f "$release/src/main.js"
test -f "$release/favicon.svg"
ln -s "releases/$commit" "/srv/home/.current-$commit"
mv -Tf "/srv/home/.current-$commit" /srv/home/current
printf 'Published homepage commit %s\n' "$commit"
