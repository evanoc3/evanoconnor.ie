# Agents

A static personal site, built using [Astro](https://astro.build/).


* All features need either a unit test, an E2E test, or both. Consider the 'Test Pyramid' when deciding which to add though, and if something can be covered by both, then prefer unit tests.

* Most features, where possible, are expected to work with 'progressive enhancement', meaning that they should work even if JS is disabled in the browser, and only use it sparingly to make the experience better when it is enabled.

* This project uses [mise](https://mise.jdx.dev/) to version tools & languages for development. In order to execute commands with the right versions of tools in sandboxed environments you may need to run the commands with the `mise exec -- ...` prefix.

* Comments are considered a bit of a code smell. Prefer clean, readable code over comments where possible.

* Always prefer type-safe, verifiably-correct code where there's a choice, and when working with the type-system, use it properly instead of trying to get around it. Never use the `any` type or similar workarounds to bypass type-safety.
