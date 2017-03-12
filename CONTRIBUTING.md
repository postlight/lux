# Contributing to Lux

Thank you for your interest in contributing to Lux! This document will help
answer any outstanding questions you may have about the contribution process.

*Please read the [Code of Conduct](./CODE_OF_CONDUCT.md) before you participate
in community.*

## Contents

*   [Reporting a Bug](#reporting-a-bug)
*   [Requesting a Feature](#requesting-a-feature)
*   [Development Workflow](#development-workflow)
*   [Writing Documentation](#writing-documentation)
*   [Submitting a Pull Request](#submitting-a-pull-request)
*   [Helpful Links and Information](#helpful-links-and-information)

## Reporting a Bug

While bugs are unfortunate, they're a reality in software. We can't fix what we
don't know about, so please report liberally. If you're not sure if something is
a bug or not, feel free to file a bug anyway.

If you have the chance, before reporting a bug, please search existing issues,
as it's possible that someone else has already reported your error. This doesn't
always work, and sometimes it's hard to know what to search for, so consider
this extra credit. We won't mind if you accidentally file a duplicate report.

Opening an issue is as easy as following [this link](https://github.com/postlight/lux/issues/new)
and filling out the fields.

### Security

If you find a security bug in Lux, send an email with a descriptive subject line
to [lux+security@postlight.com](mailto:lux+security@postlight.com). If you think
you’ve found a serious vulnerability, please do not file a public issue or share
in the Lux Gitter room.

Your report will go to Lux's core development team. You will receive
acknowledgement of the report in 24-48 hours, and what our next steps will be to
release a fix. If you don’t get a report acknowledgement in 48 hours, contact
[Zachary Golba](mailto:zachary.golba@postlight.com) directly.

A working list of public, known security-related issues can be found in the
[issue tracker](https://github.com/postlight/lux/issues?q=is%3Aopen+is%3Aissue+label%3Asecurity).

## Requesting a Feature

To request a change to the way that Lux works, please open an issue in the RFCs
repository rather than this one. New features and other significant API changes
must go through the RFC process. For more information about the RFC process, head
over to the [lux-rfcs repository](https://github.com/postlight/lux-rfcs).

## Development Workflow

This section of the document outlines how to build, run, and test Lux locally.

### Building

![lux build](https://media.giphy.com/media/l0ExhMFcO0stlw0q4/giphy.gif)

When a project that is built with Lux executes a command like `lux serve` it goes
through a build process. During this build process, Lux core is also being built.
The output of this build process is a bundled JavaScript file that includes only
the parts of Lux core and your application that you actually use. This is known as
tree shaking. Although saving bytes may not be necessary for server side applications,
tree shaking can still help optimize application start time amongst other things.
Technically speaking, Lux is not built until a project that uses Lux is built—so why
build in development at all? Well, some parts of Lux core are required to be built and
executable in the targeted Node.js version(s).

To build the required modules for local development, execute the following commands:

```bash
# Clone this repository from GitHub.
git clone https://github.com/postlight/lux.git

# Navigate into the root of this repository.
cd lux

# Install local dependencies.
npm install

# Clean any build artifacts remaining from prior builds. This step is optional
# and only makes sense if a build has already occurred.
npm run clean

# Run the build tools.
npm run build

# Symlink the lux-framework to the global node_modules directory. This ensures
# that the "lux" command will use the files we just built instead of another
# install.
npm link
```

For general debugging and sanity checking code changes to Lux core, you can use
the [test app](./test/test-app). To run the test app for the first time,
execute the following commands:

```bash
# Navigate to the test/test-app directory from the root of this repository.
cd test/test-app

# Create the database schema.
lux db:create

# Run any pending database migrations.
lux db:migrate

# Seed the database with fixtures.
lux db:seed

# Run the application server.
lux serve
```

### Testing

First make sure you have built lux locally and it is symlinked to your global
`node_modules` directory. Once you have completed the build steps, execute the
following command:

```bash
# Run the test suite from the root of this repository.
NODE_ENV="test" npm test
```

*NOTE:*

Subsequent executions of the test suite can run without going through the build
steps again.

### Code Style

#### Flow

The Lux codebase is statically typed with [Flow](https://flowtype.org). This
helps prevent many common bugs including ones caused by [unexpected type coercions](https://www.destroyallsoftware.com/talks/wat).

If you have never written JavaScript with [Flow](https://flowtype.org) or
[TypeScript](https://www.typescriptlang.org/) before, you may have a bit of a
learning curve. If you get stuck on something, feel free to ask a question in the
[*postlight/lux*](https://gitter.im/postlight/lux) and/or [*facebook/flow*](https://gitter.im/facebook/flow)
Gitter room. We recommend installing an editor plugin with autocompletion and
realtime error checking. Below you will find a few example plugins for many
common editors.

*   [flow-for-emacs (Emacs)](https://github.com/flowtype/flow-for-emacs)
*   [flow-for-vscode (Visual Studio Code)](https://github.com/flowtype/flow-for-vscode)
*   [FlowIDE (Sublime Text)](https://github.com/tptee/FlowIDE)
*   [Nuclide (Atom)](https://nuclide.io/)
*   [vim-flow (Vim)](https://github.com/flowtype/vim-flow)
*   [Webstorm](https://www.jetbrains.com/help/webstorm/using-the-flow-type-checker.html)

You can find more information about Flow and how to use it in the [Flow documentation](https://flowtype.org/docs/getting-started.html).

#### JavaScript

We use a slightly modified version of the Airbnb JavaScript [Style Guide](https://github.com/airbnb/javascript).
To enforce this, all pull requests must pass [ESLint](http://eslint.org/) before
they can merge.

#### Markdown

In addition to enforcing a JavaScript style guide, we also require that markdown
files pass [remarklint](https://github.com/wooorm/remark-lint) with the recommended
preset. This helps keep our markdown tidy, consistent, and compatible with a range of
markdown parsers used for generating documentation.

### Node.js Version Requirements

Lux is built against Node `>= v6`. Since this is the latest LTS release and the
version we run in our CI environments, we recommend you use it when working on
the Lux codebase.

If you use [nvm](https://github.com/creationix/nvm) to manage Node.js versions
and zsh (like [Oh-My-ZSH](https://github.com/robbyrussell/oh-my-zsh)), you can
have nvm switch to the correct Node.js version automatically when you cd into
this repository. To do so, add the following to your `~/.zshrc` file:

```bash
# place this after nvm initialization!
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" != "N/A" ] && [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm install
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## Writing Documentation

Improvements to documentation are a great way to start contributing to Lux. The
sources for the official documentation are generated from source code comments
and markdown files that live in this repository.

The [Guide](https://lux.postlight.com/docs/latest/guide) section of the official
documentation is generated from markdown files found in files within the[`./guide`](./guide)
directory of this repository.

The [API reference](https://lux.postlight.com/docs/latest/api) section of the official
documentation is generated from source code comments found in files within the [`./src`](./src)
directory of this repository.

## Submitting a Pull Request

Want to make a change to Lux? Submit a pull request! We use the "fork and pull"
model [described here](https://help.github.com/articles/creating-a-pull-request-from-a-fork).

**Before submitting a pull request**, please make sure:

*   [X] You have added tests for modifications you made to the codebase.
*   [X] You have updated any documentation in the source code comments for APIs
that you may have changed.
*   [X] You have no linter errors to correct after running `npm run lint`.
*   [X] You have no type errors to correct after running `npm run flow`.
*   [X] You have run the test suite via `npm test` and it passed.

### Commit Style

Commit messages should follow the format outlined below:

`prefix: message in present tense`

 Prefix      | Description
------------:|:-------------------------------------------------------------------------
       chore | does not effect the production version of the app in any way.
        deps | add, update, or remove a dependency.
        docs | add, update, or remove documentation. no code changes.
          dx | improve the development experience of lux core.
        feat | a feature or enhancement. can be incredibly small.
         fix | a bug fix for something that was broken.
        perf | add, update, or fix a test.
    refactor | change code, but not functionality.
       style | change code style, like removing whitespace. no functional code changes.
        test | add, update, or fix a test.

### Code Reviews

Once you have submitted a pull request, a member of the core team must review it
before it is merged. We try to review pull requests within 3 days but sometimes
fall behind. Feel free to reach out to someone in the [*postlight/lux*](https://gitter.im/postlight/lux)
room on Gitter if you have not received a review after 3 days.

## Helpful Links and Information

Some useful places to look for information are:

*   The [*postlight/lux*](https://gitter.im/postlight/lux) room on Gitter
*   The official [guides and documentation](https://lux.postlight.com/docs/latest)
*   Example applications in [this repository](./examples)

*Adapted from [Contributing to Node.js](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md)
, [Contributing to Rust](https://github.com/rust-lang/rust/blob/master/CONTRIBUTING.md), and
[ThinkUp Security and Data Privacy](http://thinkup.readthedocs.io/en/latest/install/security.html#thinkup-security-and-data-privacy).*
