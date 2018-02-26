#!/bin/bash
set -e

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 .travis/id_rsa # Allow read access to the private key
ssh-add .travis/id_rsa # Add the private key to SSH

ssh-keyscan $IP >> ~/.ssh/known_hosts

git config --global push.default matching
git remote add deploy ssh://git@$IP:$PORT$DEPLOY_DIR
git push deploy master

# run the deploy cmd under apps user
ssh apps@$IP -p $PORT <<EOF
  cd $DEPLOY_DIR
  # TODO deploy command, e.g. make trade
EOF

