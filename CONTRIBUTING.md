
# Contributing to SeoMarket

Thank you for your interest in contributing to SeoMarket! This document provides guidelines and instructions for contributing to our project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for SeoMarket. Following these guidelines helps maintainers understand your report, reproduce the issue, and fix it.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report).

#### Before Submitting A Bug Report

* **Check the [documentation](https://seomarket.ru/documentation)** for a list of common questions and problems.
* **Perform a [search](https://github.com/KyrlanAlanAlexandre/seomarket/issues)** to see if the problem has already been reported. If it has and the issue is still open, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A Good Bug Report?

Bugs are tracked as [GitHub issues](https://github.com/KyrlanAlanAlexandre/seomarket/issues). Create an issue and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as much detail as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files, or copy/pasteable snippets. If you're providing snippets in the issue, use Markdown code blocks.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for SeoMarket, including completely new features and minor improvements to existing functionality.

#### Before Submitting An Enhancement Suggestion

* **Check the [documentation](https://seomarket.ru/documentation)** to see if the enhancement has already been suggested.
* **Perform a [search](https://github.com/KyrlanAlanAlexandre/seomarket/issues)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/KyrlanAlanAlexandre/seomarket/issues). Create an issue and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files, or copy/pasteable snippets. If you're providing snippets in the issue, use Markdown code blocks.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of SeoMarket which the suggestion is related to.
* **Explain why this enhancement would be useful** to most SeoMarket users.
* **List some other applications where this enhancement exists.**

### Pull Requests

The process described here has several goals:

- Maintain SeoMarket's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible SeoMarket
- Enable a sustainable system for SeoMarket's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies
    * 👕 `:shirt:` when removing linter warnings

### JavaScript/TypeScript Styleguide

* Use TypeScript for all new code
* 2 spaces for indentation
* Use semicolons
* Prefer `const` over `let`
* Use arrow functions over function expressions
* Use template literals instead of string concatenation
* Prefer destructuring objects and arrays
* Use async/await over promise chains
* Avoid console.log in production code
* Add JSDoc comments for all public functions
* Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

### React Styleguide

* Use functional components with hooks
* Use TypeScript interfaces for Props
* Use the React Context API for global state management
* Split large components into smaller, reusable components
* Use named exports instead of default exports
* Use Tailwind CSS for styling
* Keep components focused on a single responsibility
* Follow the [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)

### CSS/Tailwind Styleguide

* Use Tailwind CSS utility classes
* Create custom utility classes when needed
* Follow a mobile-first approach for responsive design
* Use semantic HTML elements
* Organize Tailwind classes in a consistent order (layout, width/height, spacing, colors, etc.)

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues that are bugs
* `documentation` - Issues or PRs related to documentation
* `duplicate` - Issues that are duplicates of other issues
* `enhancement` - Issues that are feature requests
* `good first issue` - Issues that are good for newcomers
* `help wanted` - Issues that need help from the community
* `invalid` - Issues that are invalid or not relevant
* `question` - Issues that are questions
* `wontfix` - Issues that won't be fixed

## Thank You!

Your contributions to open source, large or small, make great projects like SeoMarket possible. Thank you for taking the time to contribute.
