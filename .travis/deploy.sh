#!/bin/bash
set -e # exit on first error

eval "$(ssh-agent -s)" # start ssh-agent cache
# id_rsa is decrypted as the first step of Travis build, see .travis.yml
chmod 600 .travis/id_rsa # allow read access to the private key
ssh-add .travis/id_rsa # add the private key to SSH

# prevent authenticity confirmations 
ssh-keyscan $IP >> ~/.ssh/known_hosts

# push latest changes to test server's remote repo
git config --global push.default matching
git remote add deploy ssh://git@$IP:$PORT$DEPLOY_DIR
git push deploy master

# run the deploy cmd under apps user
ssh apps@$IP -p $PORT <<EOF
  cd $DEPLOY_DIR
  # TODO deploy command, e.g. make trade
EOF

