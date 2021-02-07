#!/bin/bash
sed -i "s|^vault_path=.*|vault_path=\"$1\"|g" ./hooks/post-merge
sed -i "s|^default_branch=.*|default_branch=\"$2\"|g" ./hooks/post-merge
cp ./hooks/post-merge ./.git/hooks/post-merge
