---
title: Externally accessing services
description: Learn how to externally access your Lagoon services when running in Lando.
guide: true
mailchimp:
  action: https://dev.us12.list-manage.com/subscribe/post?u=59874b4d6910fa65e724a4648&amp;id=613837077f
  title: Want more Lagoon guide content?
  byline: Signup and we will send you a weekly blog digest of similar content to keep you satiated.
  button: Sign me up!
---

If you would like to connect to your database, or some other service, from your host using a GUI client like SequelPro, you can run [`lando info`](https://docs.lando.dev/cli/info.md) and use the `external_connection` information and any relevant `creds` for the service you want to connect to.

You can also check out the environment variable [`LANDO INFO`](https://docs.lando.dev/guides/lando-info.md), which is available in every Lando container, as it contains useful information about how your application can access other Lando services.

Some example connection info for the `mariadb` service is shown below:

```bash
lando info --service mariadb --format default

[ { service: 'mariadb',
    urls: [],
    type: 'lagoon-mariadb',
    healthy: true,
    creds: { user: 'drupal', password: 'drupal', database: 'drupal', rootpass: 'Lag00n' },
    internal_connection: { host: 'mariadb', port: '3306' },
    external_connection: { host: '127.0.0.1', port: '32790' },
    config: {},
    version: 'custom',
    meUser: 'mysql',
    hostnames: [ 'mariadb.drupalexample.internal' ] }]
```