#!/bin/bash
set -e # exit on first error

eval "$(ssh-agent -s)" # start ssh-agent cache
# id_rsa is decrypted as the first step of Travis build, see .travis.yml
chmod 600 .travis/id_rsa # allow read access to the private key
ssh-add .travis/id_rsa # add the private key to SSH

# prevent authenticity confirmations 
ssh-keyscan $IP >> ~/.ssh/known_hosts

# shut down any currently running containers to prevent file locking when pushing new version
ssh apps@$IP -p $PORT -t <<EOF
  cd $DEPLOY_DIR
  sudo docker-compose kill
EOF

# push latest changes to test server's remote repo
git config --global push.default matching
git remote add deploy ssh://git@$IP:$PORT$DEPLOY_DIR
git push deploy master

# start updated services
ssh apps@$IP -p $PORT -t <<EOF
  cd $DEPLOY_DIR
  sudo service docker restart # restart docker service to prevent "timeout" errors (https://github.com/docker/compose/issues/3633#issuecomment-254194717)
  sudo make run-docker
EOF

