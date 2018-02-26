# CI/CD configuration

## server config
- on stock Ubuntu 16.04, install following dependencies (via apt-get): `git`, `ruby-dev`, `gcc`, `libffi-dev`, `make`
- add `git` (used to push new code) and `apps` (used to run deployment) users
- generate new private/public keys pair used by Travis to access server, add public key to both `git` and `apps` user's `~/.ssh/authorized_keys`
- clone repository and add `apps` user as owner
```sh
$ chown apps:deploy -R getsky-trade; chmod g+rw -R getsky-trade
```
- encrypt private key using [Travis CLI](https://github.com/travis-ci/travis.rb#installation). Use `-add` flag to automatically update `.travis.yml` 
```sh
$ travis encrypt-file id_rsa --add
```
- copy both private (encrypted!) and public keys to `.travis` folder. DO NOT copy private key to repo!
- add/update Travis environment variables `IP`, `PORT` and `DEPLOY_DIR` to corresponding values