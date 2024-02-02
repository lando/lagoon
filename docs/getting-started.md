---
description: Learn how to get started with the Lando Lagoon recipe.
---

# Getting Started

## Requirements

Before you get started with this recipe we assume that you have:

1. [Installed Lando](https://docs.lando.dev/getting-started/installation.html) and gotten familiar with [its basics](https://docs.lando.dev/getting-started/)
2. [Initialized](https://docs.lando.dev/cli/init.html) a [Landofile](https://docs.lando.dev/core/v3/) for your codebase for use with this recipe
3. Read about the various [services](https://docs.lando.dev/core/v3/lando-service.html), [tooling](https://docs.lando.dev/core/v3/tooling.html), [events](https://docs.lando.dev/core/v3/events.html) and [routing](https://docs.lando.dev/core/v3/proxy.html) Lando offers.
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

