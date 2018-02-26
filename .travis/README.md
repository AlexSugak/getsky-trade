# CI/CD configuration

[Travis](https://travis-ci.org/) is used for both CI and CD. <br />
Every push to `master` triggers a new build that runs linters and tests (see [.travis.yml](https://github.com/AlexSugak/getsky-trade/blob/master/.travis.yml) for more details). <br />
In case of successfull build, a new version of the site is deployed to test server, see [deploy.sh](https://github.com/AlexSugak/getsky-trade/blob/master/.travis/deploy.sh)

## test server config
- on stock Ubuntu 16.04, install following dependencies (via apt-get): `git`, `ruby-dev`, `gcc`, `libffi-dev`, `make`
- create users: `git` (used to push new code), `apps` (used to run deployment). Add both to `deploy` group
- generate new private/public keys pair used by Travis to access server, add public key to both `git` and `apps` user's `~/.ssh/authorized_keys`
- clone repository and add `apps` user as owner
```sh
$ chown apps:deploy -R getsky-trade; chmod g+rw -R getsky-trade
```
- encrypt private key using [Travis CLI](https://github.com/travis-ci/travis.rb#installation). Use `-add` flag to automatically update `.travis.yml` 
```sh
$ travis encrypt-file id_rsa --add
```
- copy both private (encrypted!) and public keys to `.travis` folder of repository. **DO NOT** copy private key to repository!
- add/update Travis environment variables `IP`, `PORT` and `DEPLOY_DIR` to corresponding values