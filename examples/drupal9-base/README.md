# Lagoon Drupal Example Simple

This example exists primarily to test the following documentation:

* [Lagoon Recipe - Drupal 9](https://docs.lando.dev/config/lagoon.html)

## Start up tests

Run the following commands to get up and running with this example.

```bash
# Should poweroff
lando poweroff

# Should get the the drupal example simple repo
rm -rf drupal
git clone https://github.com/lagoon-examples/drupal-base.git drupal
cp ../.lando.upstream.yml drupal/.lando.upstream.yml
cd drupal

# Should start up our lagoon drupal example simple site successfully
cd drupal
lando start
```

## Verification commands

Run the following commands to validate things are rolling as they should.

```bash
# Should be able to connect to a running site
cd drupal
lando drush si -y
lando drush cr -y
lando drush status | grep "Drupal bootstrap" | grep "Successful"

# Should have all the services we expect
docker ps --filter label=com.docker.compose.project | grep Up | grep drupalbase_nginx_1
docker ps --filter label=com.docker.compose.project | grep Up | grep drupalbase_mariadb_1
docker ps --filter label=com.docker.compose.project | grep Up | grep drupalbase_mailhog_1
docker ps --filter label=com.docker.compose.project | grep Up | grep drupalbase_php_1
docker ps --filter label=com.docker.compose.project | grep Up | grep drupalbase_cli_1

# Should ssh against the cli container by default
cd drupal
lando ssh -c "env | grep LAGOON=" | grep cli-drupal

# Should have the correct environment set
cd drupal
lando ssh -c "env" | grep LAGOON_ROUTE | grep https://drupal-base.lndo.site
lando ssh -c "env" | grep LAGOON_ENVIRONMENT_TYPE | grep development

# Should have composer
cd drupal
lando composer --version

# Should have php cli
cd drupal
lando php --version

# Should have drush
cd drupal
lando drush --version

# Should have npm
cd drupal
lando npm --version

# Should have node
cd drupal
lando node --version

# Should have yarn
cd drupal
lando yarn --version

# Should have lagoon cli
cd drupal
lando lagoon --version | grep lagoon

# Should have a running drupal 9 site served by nginx on port 8080
cd drupal
lando ssh -s cli -c "curl -kL http://nginx:8080" | grep "Drush Site-Install"

# Should be able to db-export and db-import the database
cd drupal
lando db-export test.sql
lando db-import test.sql.gz

# Should be able to show the drupal tables
cd drupal
lando mysql drupal -e "show tables;" | grep users

# Shoud be able to rebuild and persist the database
cd drupal
lando rebuild -y
lando mysql drupal -e "show tables;" | grep users
```

## Destroy tests

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be able to destroy our drupal9 site with success
cd drupal
lando destroy -y
lando poweroff
```
