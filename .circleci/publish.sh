#!/bin/bash
if  [ $(git name-rev --name-only --tags HEAD) ]; then
    echo no tag
else
    echo has tag
fi