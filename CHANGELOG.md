## {{ UNRELEASED_VERSION }} - [{{ UNRELEASED_DATE }}]({{ UNRELEASED_LINK }})

* Updated to [@lando/vitepress-theme-default-plus@v1.1.0-beta.18](https://github.com/lando/vitepress-theme-default-plus/releases/tag/v1.1.0-beta.18).

## v1.2.0 - [April 4, 2024](https://github.com/lando/lagoon/releases/tag/v1.2.0)

* Fixed issue with Postgres builder having the wrong path. [#76](https://github.com/lando/lagoon/pull/76)

## v1.1.0 - [March 8, 2024](https://github.com/lando/lagoon/releases/tag/v1.1.0)

* Updated to latest database services.

## v1.0.1 - [January 2, 2024](https://github.com/lando/lagoon/releases/tag/v1.0.1)

  * Placed `wait-for-user` script first in init build.

## v1.0.0 - [January 1, 2024](https://github.com/lando/lagoon/releases/tag/v1.0.0)

  * Dialed fully for `lando update`
  * Switched from the `compose` (deprecated) service type to the `lando` service type for the `lagoon-cli` service.
  * Created a `lagoon-mailhog` service that is a passthrough to `@lando/mailhog`.

## v0.11.0 - [October 5, 2023](https://github.com/lando/lagoon/releases/tag/v0.11.0)
* Added a "wait for user" script to ensure user is loaded before cloning repo. [lando/core#71](https://github.com/lando/core/pull/71)

## v0.10.0 - [September 21, 2023](https://github.com/lando/lagoon/releases/tag/v0.10.0)
* Added support for defining Solr commands via .lando.yml [#48](https://github.com/lando/lagoon/pull/48)
* Added the Basic Lagoon/Lando Service [#47](https://github.com/lando/lagoon/pull/47)
* Added support for proxy service to handle primary servers other than Nginx [#45](https://github.com/lando/lagoon/pull/45)

## v0.9.0 - [August 1, 2023](https://github.com/lando/lagoon/releases/tag/v0.9.0)
  * Added support for new Node, Ruby, and Python services. [PR #44](https://github.com/lando/lagoon/pull/44)

## v0.8.0 - [July 3, 2023](https://github.com/lando/lagoon/releases/tag/v0.8.0)
  * Removed bundle-dependencies and version-bump-prompt from plugin.
  * Updated package to use prepare-release-action.
  * Updated documentation to reflect new release process.

## v0.7.0 - [December 12, 2022](https://github.com/lando/lagoon/releases/tag/v0.7.0)
  * Added bundle-dependencies to release process.
  * Fixed bug in plugin dogfooding test.

## v0.6.0 - [September 8, 2022](https://github.com/lando/lagoon/releases/tag/v0.6.0)

* HYPERDRIVED

## v0.5.3 - [April 21, 2022](https://github.com/lando/lagoon/releases/tag/v0.5.3)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* Clean up unused dependencies

## v0.5.2 - [November 10, 2021](https://github.com/lando/lagoon/releases/tag/v0.5.2)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* update text in push.js
* add custom domain docs [PR #13](https://github.com/lando/lagoon/pull/13)

## v0.5.1 - [November 10, 2021](https://github.com/lando/lagoon/releases/tag/v0.5.1)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* Adjust README and other small labeling tweaks

## v0.5.0 - [November 9, 2021](https://github.com/lando/lagoon/releases/tag/v0.5.0)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* First release of `lagoon` as an external plugin!
* Added testing for basic drupal 9 example
