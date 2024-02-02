---
description: Learn about the various out-of-the-box tooling you get with the Lando Lagoon recipe.
---

# Tooling

Each Lando Lagoon recipe will also ship with the Lagoon toolchain. This means you can use `drush` and other tools via Lando and avoid mucking up your actual computer trying to manage `php` versions and tooling. Here are the things that ship with the `drupal` flavor by default.

You can also run `lando` from inside your app directory for a complete list of commands.

```bash
lando composer          Runs composer commands
lando db-export [file]  Exports database from a database service to a file
lando db-import <file>  Imports a dump file into a database service
lando drush             Runs drush commands
lando lagoon            Runs lagoon commands
lando mysql             Drops into a MySQL shell on a database service
lando node              Runs node commands
lando npm               Runs npm commands
lando php               Runs php commands
lando yarn              Runs yarn commands
```

Note that you can define your own commands by using out [tooling framework](https://docs.lando.dev/core/v3/tooling.html). Also check out the guides for the powerful [DB Export](https://docs.lando.dev/guides/db-export.html) and [DB Import](https://docs.lando.dev/guides/db-import.html) commands.

Also, check out the [Lagoon CLI Docs](https://uselagoon.github.io/lagoon-cli/commands/lagoon/) for more information on using `lando lagoon`.

## Mailhog

If you're using a Lagoon `php` container we will automatically set up `mailhog` for you so you can capture emails. You will see `urls` to access its web interface after you run `lando start` or if you run `lando info`.

```bash
NAME          drupal-example
LOCATION      /Users/pirog/work/lando/examples/lagoon-drupal/drupal
SERVICES      cli, nginx, php, mariadb, redis, solr, mailhog
MAILHOG URLS  http://localhost:32792
              http://inbox.drupal-example.lndo.site/
```