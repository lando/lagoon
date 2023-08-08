---
title: Configuration
description: Learn how to configure the Lando Platform.sh recipe.
---

# Configuration

While Lando [recipes](https://docs.lando.dev/config/recipes.html) set sane defaults so they work out of the box, they are also [configurable](https://docs.lando.dev/config/recipes.html#config).

Here are the configuration options, set to the default values, for this recipe's [Landofile](https://docs.lando.dev/config). If you are unsure about where this goes or what this means we *highly recommend* scanning the [recipes documentation](https://docs.lando.dev/config/recipes.html) to get a good handle on how the magicks work.

```yaml
recipe: lagoon
config:
  build:
    - composer install
```

If you do not already have a [Landofile](https://docs.lando.dev/config) for your Lagoon site, we highly recommend you use [`lando init`](https://docs.lando.dev/cli/init.html) to get one as that will automatically populate the above defaults for you. Manually creating a Landofile with these things set correctly can be difficult and is *highly discouraged.*

Note that if the above config options are not enough, all Lando recipes can be further [extended and overriden](https://docs.lando.dev/config/recipes.html#extending-and-overriding-recipes).

## Setting Lagoon labels

Under the hood the `lagoon` recipe uses special Docker labels to connect Lagoon services to Lando ones. If your project uses one of the Amazee.io starting templates like [this one for Drupal 9](https://github.com/amazeeio/drupal-example-simple) then you should be good to go, no further setup is required.

However, if you are using a legacy template or a bespoke Lagoon setup then you will need to manually add these labels into your Lagoon's `docker-compose.yml`. Here is an example of a `docker-compose.yml` with non-essential config removed for readability.

```yaml
services:
  cli: # cli container, will be used for executing composer and any local commands (drush, drupal, etc.)
    labels:
      # Lagoon Labels
      lagoon.type: cli-persistent
      # Lando type label
      lando.type: php-cli-drupal

  nginx:
    labels:
      lagoon.type: nginx-php-persistent
      lando.type: nginx-drupal

  php:
    labels:
      lagoon.type: nginx-php-persistent
      lando.type: php-fpm

  mariadb:
    image: uselagoon/mariadb-drupal:latest
    labels:
      lagoon.type: mariadb
      lando.type: mariadb-drupal
    ports:
      - "3306" # exposes the port 3306 with a random local port, find it with `docker-compose port mariadb 3306`
    << : *default-user # uses the defined user from top
    environment:
      << : *default-environment
```

For the most up to date list of supported labels, check out [this](https://github.com/lando/lagoon/blob/main/lib/services.js#L15). To see labels in action check out the official [Amazee.io Drupal 9 Lagoon example](https://github.com/amazeeio/drupal-example-simple/blob/9.x/docker-compose.yml#L40).

Also note that Lando additionally supports `lagoon.type === none` as documented over [here](https://docs.lagoon.sh/using-lagoon-the-basics/docker-compose-yml/#skipignore-containers).

## Build steps

If you have steps you need to run to get your site into a workable place you can put them in the `build` key of your recipes `config`. By default, we will run `composer install` but you may wish to augment that with any front end compilation tasks you may have as in the example below:

```yaml
recipe: lagoon
config:
  build:
    - composer install
    - yarn run compile:sass
    - drush sql-sync my-database
```

These will run against the [Lagoon PHP CLI Drupal container](https://docs.lagoon.sh/lagoon/docker-images/php-cli/php-cli-drupal) so you will have access to all the tools there as well as the ones it inherits from the base [PHP CLI container](https://docs.lagoon.sh/lagoon/docker-images/php-cli).

Note that these will run the _first time_ you run `lando start`. You will need to run `lando rebuild` to trigger them again if you make changes.

## Customizing the stack

:::warning Customizations not fully tested
We _think_ most of the customizations below _should_ work but they have been very minimally tested. If you try one and it doesn't work, please [report an issue](https://github.com/lando/lagoon/issues/new/choose).
:::

Lando will read and interpret your normal `.lagoon.yml` and its associated Docker Compose files. This means that you should be able to do the customizations Lagoon has documented, run a `lando rebuild` and see the changes.  Lando reads the `lando.type` labels from the docker-compose file to ensure that the correct image is used for a service.

The services we currently support with links to their associated Lagoon docs is shown below:

* [Elasticsearch](https://docs.lagoon.sh/lagoon/docker-images/elasticsearch)
* [MariaDB](https://docs.lagoon.sh/lagoon/docker-images/mariadb)
* [Node](https://docs.lagoon.sh/docker-images/nodejs/)
* [Nginx](https://docs.lagoon.sh/lagoon/docker-images/nginx)
* [PHP CLI](https://docs.lagoon.sh/lagoon/docker-images/php-cli)
* [PHP-FPM](https://docs.lagoon.sh/lagoon/docker-images/php-fpm)
* [Python](https://docs.lagoon.sh/docker-images/python/)
* [PostgreSQL](https://docs.lagoon.sh/lagoon/docker-images/postgres)
* [Redis](https://docs.lagoon.sh/lagoon/docker-images/redis)
* [Ruby](https://docs.lagoon.sh/docker-images/ruby/)
* [Solr](https://docs.lagoon.sh/lagoon/docker-images/solr)
* [Varnish](https://docs.lagoon.sh/lagoon/docker-images/varnish)

Note that we are testing against the "Drupal" variants of the above but it's _possible_ the base services work as well.

## Customizing your domain or using a non `lndo.site` domain

As per the general Lando [Proxy](https://docs.lando.dev/config/proxy.html) instructions, it is possible to configure custom domains (i.e. `myapp.lndo.site` or `foo.bar.xyz`) for your site.  However, as the default Lagoon base images are built slightly differently to the default Lando ones, you need to specify the port  to route the request to (usually 8080 for nginx):

Add the following lines to your .lando.yml file

```yaml
proxy:
  nginx:
    - myapp.lndo.site:8080
    - foo.bar.xyz:8080
```
Your app can then be accessed via the `myapp.lndo.site` or `foo.bar.xyz` URL.  Note that this will override any autogenerated URLs.