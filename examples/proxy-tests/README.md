Lagoon Proxy Tests
=======================

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
docker ps --filter label=com.docker.compose.project | grep Up | grep proxytests_node_1
docker ps --filter label=com.docker.compose.project | grep Up | grep proxytests_python_1
docker ps --filter label=com.docker.compose.project | grep Up | grep proxytests_ruby_1

# Should have the correct environment set
lando ssh -u root -c "env" | grep LAGOON_ROUTE
lando ssh -u root -c "env" | grep LAGOON_ENVIRONMENT_TYPE | grep development

# Should have node
lando node --version

# Should have npm
lando npm --version

# Should have yarn
lando yarn --version

# Should have lagoon cli
lando lagoon --version | grep lagoon

# Should have a running node service
curl -kL http://node.proxy-tests.lndo.site/ | grep "LAGOON="

# Should have a running python service
curl -kL http://python.proxy-tests.lndo.site/ | grep "lagoon/"

# Should have a running ruby service
curl -kL http://ruby.proxy-tests.lndo.site/ | grep "Ruby/"
curl -kL http://ruby.proxy-tests.lndo.site/ | grep "lagoon/"

# Should have node defined as the primary server
lando config | grep primaryServer | grep node

# Update primary server, should now have python defined as the primary server
export LANDO_LANDO_FILE_CONFIG='{"config": {"primaryServer": "python"}}'
lando rebuild -y
lando config | grep primaryServer | grep python
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be able to destroy the project successfully
lando destroy -y
lando poweroff
```