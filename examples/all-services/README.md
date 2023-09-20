Lagoon All Services
=======================

This example exists primarily to test the following documentation:

* [Lagoon Recipe - Drupal 9](https://docs.lando.dev/config/lagoon.html)

Start up tests
--------------

Run the following commands to get up and running with this example.

```bash
# Should poweroff
lando poweroff

# Should start up our project successfully
lando start
```

Verification commands
---------------------

Run the following commands to validate things are rolling as they should.

```bash
# Should have all the services we expect
docker ps --filter label=com.docker.compose.project | grep Up | grep allservices_node_1
docker ps --filter label=com.docker.compose.project | grep Up | grep allservices_python_1
docker ps --filter label=com.docker.compose.project | grep Up | grep allservices_ruby_1

# Should have the correct environment set
lando ssh -u root -c "env" | grep LAGOON_ROUTE
lando ssh -u root -c "env" | grep LAGOON_ENVIRONMENT_TYPE | grep development

# Set the port being defined by Lando
LANDO_PORT=$(lando config | grep proxyLastPorts | grep -o "http: '[0-9]*'" | awk -F"'" '{print $2}')

# Should have node
lando node --version

# Should have npm
lando npm --version

# Should have yarn
lando yarn --version

# Should have lagoon cli
lando lagoon --version | grep lagoon

# Should have a running node service
curl -kL http://node.all-services.lndo.site:$LANDO_PORT/ | grep "LAGOON="

# Should have a running python service
curl -kL http://python.all-services.lndo.site:$LANDO_PORT/ | grep "lagoon/"

# Should have a running ruby service
curl -kL http://ruby.all-services.lndo.site:$LANDO_PORT/ | grep "Ruby/"
curl -kL http://ruby.all-services.lndo.site:$LANDO_PORT/ | grep "lagoon/"

# Should have a running basic service
curl -kL http://basic.all-services.lndo.site:$LANDO_PORT/ | grep "basic"
curl -kL http://basic.all-services.lndo.site:$LANDO_PORT/ | grep "lagoon/"

# Should have a "mycore" Solr core
curl 'http://localhost:8983/solr/admin/cores?action=STATUS&core=mycore' | grep "mycore"

```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be able to destroy the project successfully
lando destroy -y
lando poweroff
```