#!/bin/bash
set -e # exit on first error

eval "$(ssh-agent -s)" # start ssh-agent cache
# id_rsa is decrypted as the first step of Travis build, see .travis.yml
chmod 600 .travis/id_rsa.getsky.deploy # allow read access to the private key
ssh-add .travis/id_rsa.getsky.deploy # add the private key to SSH

# prevent authenticity confirmations 
ssh-keyscan $IP >> ~/.ssh/known_hosts

# shut down any currently running containers to prevent file locking when pushing new version
ssh $RUN_USER@$IP -p $PORT <<EOF
  cd $DEPLOY_DIR
  docker-compose kill
EOF

# push latest changes to test server's remote repo
git config --global push.default matching
git remote add deploy ssh://$PUSH_USER@$IP:$PORT$DEPLOY_DIR
git push deploy master

# start updated services
ssh $RUN_USER@$IP -p $PORT <<EOF
  export RECAPTCHA_SECRET=$RECAPTCHA_SECRET
  cd $DEPLOY_DIR
  sudo service docker restart # restart docker service to prevent "timeout" errors (https://github.com/docker/compose/issues/3633#issuecomment-254194717)
  make run-docker
  # run migrations
  docker exec backend sh -c "cd /usr/local/go/src/github.com/AlexSugak/getsky-trade/db/ && bash ./migrate.sh"
EOF

