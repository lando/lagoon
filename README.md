# Lagoon Lando Plugin

This is the _official_ [Lando](https://lando.dev) plugin for [Lagoon](https://lagoon.sh). When installed it...

* Closely mimics Lagoon's [stack, versions](https://docs.lagoon.sh/) locally
* Allows you to easily `pull` your Lagoon site down locally
* Allows you to easily `push` your changes back to Lagoon

Of course, once a user is running their Lagoon project with Lando they can take advantage of [all the other awesome development features](https://docs.lando.dev) Lando provides.


## Basic Usage

Clone a project down from Lagoon.

```bash
# Clone a site from a lagoon instance
lando init --source lagoon

# Start it up
lando start

# Pull down files and database
lando pull --database main --files main

# List information about this apps services.
lando info
```

Once your project is running you can access [relevant tooling commands](https://github.com/lando/lagoon/blob/main/docs/usage.md#application-tooling).

For more info you should check out the [docs](https://docs.lando.dev/lagoon):

* [Getting Started](https://docs.lando.dev/lagoon/getting-started.html)
* [Configuration](https://docs.lando.dev/lagoon/config.html)
* [Tooling](https://docs.lando.dev/lagoon/tooling.html)
* [Syncing](https://docs.lando.dev/lagoon/syncing.html)
* [Examples](https://github.com/lando/lagoon/tree/main/examples)
* [Development](https://docs.lando.dev/lagoon/development.html)

## Issues, Questions and Support

If you have a question or would like some community support we recommend you [join us on Slack](https://launchpass.com/devwithlando).

If you'd like to report a bug or submit a feature request then please [use the issue queue](https://github.com/lando/lagoon/issues/new/choose) in this repo.

## Changelog

We try to log all changes big and small in both [THE CHANGELOG](https://github.com/lando/lagoon/blob/main/CHANGELOG.md) and the [release notes](https://github.com/lando/lagoon/releases).

## Development

If you're interested in working on this plugin then we recommend you check out the [development guide](https://github.com/lando/lagoon/blob/main/docs/development.md).

## Contributors

<a href="https://github.com/lando/lagoon/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lando/lagoon" />
</a>

Made with [contributors-img](https://contrib.rocks).

## Other Selected Resources

* [LICENSE](https://github.com/lando/lagoon/blob/main/LICENSE.md)
* [The best professional advice ever](https://www.youtube.com/watch?v=tkBVDh7my9Q)
