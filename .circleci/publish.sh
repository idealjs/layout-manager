#!/bin/bash
if  [ "$(git name-rev --name-only --tags HEAD)" = "undefined" ]; then
    echo no tag
else
    echo has tag
    yarn lerna publish from-package --yes
fi
