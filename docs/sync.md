---
description: Learn how to sync databases, files, relationships and mounts between your local Lando site and your remote Platform.sh site.
---

# Syncing

Lando also provides wrapper commands called `lando pull` and `lando push`.

With `lando pull` you can import data and download files from your remote Platform.sh site. With `lando push` you can do the opposite, export data or upload files to your remote Platform.sh site.

## Pulling

```bash
lando pull

Pull db and files from Lagoon

Options:
  --help          Shows lando or delegated command help if applicable
  --verbose, -v   Runs with extra verbosity
  --auth          Lagoon key
  --database, -d  The environment from which to pull the database
  --files, -f     The environment from which to pull the files
```

```bash
# Interactively pull databases and files
lando pull

# Import the remote database and files from the main environment
lando pull -d main -f main

# Effectively "do nothing"
lando pull --database none --files none
```

## Pushing

```bash
lando push

Push db and files to Lagoon

Options:
  --help          Shows lando or delegated command help if applicable
  --verbose, -v   Runs with extra verbosity
  --auth          Lagoon key
  --database, -d  The environment to which the database will be pushed
  --files, -f     The environment to which the files will be pushed
```

```bash
# Interactively push databases and files
lando push

# Export the local database and files to the main environment
lando push -d main -f main

# Effectively "do nothing"
lando push --database none --files none
```
