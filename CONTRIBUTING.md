# Contributing to [Melody](https://github.com/NerdyTechy/Melody)

Contributions are more than welcome! Contributing to Melody means that it is kept in good condition, which means that less people have to worry about paying for bots just to listen to music with their friends.

Even if you can't contribute directly to the codebase, you can open an issue on GitHub to report bugs or request new features.

## Contributing Through Issues

To contribute through issues and feature requests, open a new issue on the GitHub issues page of the main Melody repository ([NerdyTechy/Melody](https://github.com/NerdyTechy/Melody)). Make your issue as descriptive as possible, including things like steps to reproduce for bug reports, and how you would like a feature to be implemented for feature requests.

Once you have submitted your issue, someone will review it and potentially add your features, or fix your bugs. Once that's happened, you've officially contributed to Melody! :D

## Contributing to the Codebase

If you want to contribute directy to the codebase, you can do so through a pull request.

1. Fork this repository
2. Add your code, and test it (We want all code on the main repo to be working)
3. Format all of your code with prettier using `npm run format`
4. Ensure that none of the documentation is incorrect following your changes
5. Create a pull request and wait for your changes to be reviewed!

We do ask that once you fork Melody with the intention of merging back in, that your fork is kept up to date with the main repository. GitHub makes this really easy to do, with a little tracker that shows how many commits ahead and behind your fork is with options to sync the two.

## Developing Locally

Developing Melody locally is actually really simple, just clone the repository, rename `config.yml.example` to `config.yml`, fill in the configuration details, then run `npm run dev` to start the bot in test mode. Once you have finished, you can compile the TypeScript with `npm run build`, and use `npm run start` to test the compiled JavaScript output. Finally, run `npm run format` and `npm run lint` to format the code and ensure that there are no linting errors, then push your code and open a PR!

### Thanks for contributing to Melody <3
