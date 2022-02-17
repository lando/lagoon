---
description: Learn how to get started with the Lando Lagoon recipe.
---

# Getting Started

## Requirements

Before you get started with this recipe we assume that you have:

1. [Installed Lando](https://docs.lando.dev/basics/installation.md) and gotten familiar with [its basics](https://docs.lando.dev/basics/)
2. [Initialized](https://docs.lando.dev/basics/init.md) a [Landofile](https://docs.lando.dev/config/lando.md) for your codebase for use with this recipe
3. Read about the various [services](https://docs.lando.dev/config/services.md), [tooling](https://docs.lando.dev/config/tooling.md), [events](https://docs.lando.dev/config/events.md) and [routing](https://docs.lando.dev/config/proxy.md) Lando offers.
4. Temporarily stopped (`pygmy stop`) the [Pygmy](https://pygmy.readthedocs.io/en/master/) tool to avoid any port conflicts

## Quick Start

You can also run the following commands to try out this recipe on one of your Lagoon sites.

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

## Custom Installation

This plugin is included with Lando by default. That means if you have Lando version `3.0.8` or higher then this plugin is already installed!

However if you would like to manually install the plugin, update it to the bleeding edge or install a particular version then use the below. Note that this installation method requires Lando `3.5.0+`.

:::: code-group
::: code-group-item DOCKER
```bash:no-line-numbers
# Ensure you have a global plugins directory
mkdir -p ~/.lando/plugins

# Install plugin
# NOTE: Modify the "yarn add @lando/lagoon" line to install a particular version eg
# yarn add @lando/lagoon@0.5.2
docker run --rm -it -v ${HOME}/.lando/plugins:/plugins -w /tmp node:14-alpine sh -c \
  "yarn init -y \
  && yarn add @lando/lagoon --production --flat --no-default-rc --no-lockfile --link-duplicates \
  && yarn install --production --cwd /tmp/node_modules/@lando/lagoon \
  && mkdir -p /plugins/@lando \
  && mv --force /tmp/node_modules/@lando/lagoon /plugins/@lando/lagoon"

# Rebuild the plugin cache
lando --clear
```
:::
::: code-group-item HYPERDRIVE
```bash:no-line-numbers
# @TODO
# @NOTE: This doesn't actaully work yet
hyperdrive install @lando/lagoon
```
::::

You should be able to verify the plugin is installed by running `lando config --path plugins` and checking for `@lando/lagoon`. This command will also show you _where_ the plugin is being loaded from.
