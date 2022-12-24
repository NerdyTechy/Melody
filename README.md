<p align="center">
  <img src="https://i.imgur.com/phFnOFf.png" />
</p>
<h1 align="center">Melody</h1>
<p align="center">Discord music bot with many useful commands and effects.</p>

<p align="center">
  <a href="https://github.com/NerdyTechy/Melody/actions">
    <img alt="Tests Passing" src="https://github.com/NerdyTechy/Melody/workflows/CodeQL/badge.svg" />
  </a>
  <a href="https://github.com/NerdyTechy/Melody/graphs/contributors">
    <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/NerdyTechy/Melody" />
  </a>
  <a href="https://github.com/NerdyTechy/Melody/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/NerdyTechy/Melody" />
  </a>
  <a href="https://github.com/NerdyTechy/Melody/blob/master/LICENSE">
    <img alt="Issues" src="https://img.shields.io/github/license/NerdyTechy/Melody" />
  </a>
  <a href="https://github.com/NerdyTechy/Melody/pulls">
    <img alt="Issues" src="https://img.shields.io/github/issues-pr-closed/NerdyTechy/Melody" />
  </a>
  <a href="https://github.com/NerdyTechy/Melody/commits">
    <img alt="Issues" src="https://img.shields.io/github/last-commit/NerdyTechy/Melody" />
  </a>
  <a href="https://github.com/NerdyTechy/Melody"><img alt="Statistics Graphs" src="https://repobeats.axiom.co/api/embed/966fb1f700b2ca070b73426ccafcc5dd2b7576fb.svg"></a>
</p>

<h2>About Melody</h2>
Melody was primarily developed because the best music bots shut down, and most alternatives had core features locked behind a paywall. Melody started as a bot that was just used in a server with some friends, and then became a project that I released publicly for anyone to use and maintain.

<h2>Features</h2>
Melody is a feature-rich Discord music bot. It offers a clean look, easy to use commands, and active development. Check out the list below for a full list of features:
<br>
<br>
<ul>
<li>Easy installation</li>
<li>Multi-server support</li>
<li>Song lyrics integration</li>
<li>Volume controller</li>
<li>Full player control with pausing, seeking, and volume control</li>
<li>Queue support with skipping, returning to the previous song, viewing queued songs, queue shuffling, queue clearing, adding songs to the end of the queue, or the next position in the queue</li>
<li>Listening statistics that allow you to see how many songs you've listened to, how many songs you've skipped, and how many times you've shuffled the queue</li>
<li>An easy to reference help menu</li>
<li>Saving songs right to your direct messages for you to refer back to later</li>
<li>10+ effects to spice up your music</li>
</ul>

<h2>Installation</h2>
Installing Melody is very simple and easy to do. If you have any issues, please feel free to create an issue, or contact me elsewhere for help.
<br>
<br>
<ol>
  <li>Download the source code from this repository.</li>
  <li>Upload to your hosting and extract the files. (Or just extract locally)</li>
  <li>Rename <strong>config.yml.example</strong> to <strong>config.yml</strong>.</li>
  <li>Enter Discord bot token, Discord bot client ID, and <a href="#Genius">Genius API key</a> into <strong>config.yml</strong>.</li>
  <li><strong>Optional:</strong> Upload the <a href="#Emojis">custom emojis</a> found in the <strong>/emojis/</strong> directory to your server, and set the IDs of the emojis in the configuration file. (Replace the default emoji with the ID of the custom emoji)</li>
  <li>Install dependencies listed in package.json.</li>
  <li>Launch bot with <strong>node src/bot.js</strong> or <strong>npm run test</strong>. (If your hosting is managed and you can't change the startup command, you should be able to set the file that is run at launch. This must be set to <strong>src/bot.js</strong>).</li>
</ol>

## Analytics

By default, Melody sends a HTTP request to a custom analytics service when it boots up with a non-identifiable token (A SHA-256 hash of your client ID). This is purely done so that I can see the usage of my projects. The service does not track anything other than the amount of times that you start the bot, and the time that you last started the bot. I use these statistics to know the popularity of my projects over time, and how the general usage trend looks.

The API that runs this service is developed by me, so the information is not shared with any third parties. The analytics project is also open-source, and can be found <a href="https://github.com/NerdyTechy/Analytics">here</a>.

If you do not want to contribute to these analytics, you can disable the <strong>enableAnalytics</strong> option in the bot's configuration file, and no requests will be made to this service.

While leaving these analytics enabled helps me to understand the demand of my projects, which can help me to decide which projects deserve more attention in terms of updates, I respect that you may not agree to providing these analytics, and so I have tried to make it as easy to opt out of as possible.

## Emojis

Melody utilises many custom emojis for menus, and so if you would like to use them, they are available in the <strong>/emojis/</strong> directory. Simply upload them to your server, and edit the config.yml file to have the correct names and IDs. If you would like to make your own emojis, or use default Discord emojis, simply change the config file accordingly.

## Genius

Melody utilises Genius' API to find lyrics for songs. A Genius API key is therefore required to use the bot. Obtaining one is free, and can be done so <a href="https://genius.com/api-clients">here</a>.

## Common Issues

If you are experiencing an issue, check below to see if it is listed. If it's not listed, open an issue and we'll be happy to help.

1. `Error: FFmpeg/avconv not found!`: If you are experiencing this issue, please try removing `ffmpeg-static` with `npm remove ffmpeg-static`, then install `ffmpeg` with `npm install ffmpeg`. If this does not fix the issue, please open an issue on GitHub.
2. `[Aborted] Unable to find config.yml file.`: Rename the `config.yml.example` file to `config.yml`, then change all of your settings in the file accordingly and restart the bot.

## Hosting

Want to host this bot online? Any hosting company that provides Discord bot hosting will work, but I highly recommend <a href="https://techy.lol/revivenode">Revivenode</a> (Affiliate Link).

## Like Melody?

There are many ways you can support Melody, and its development. One of the best ways that you can support the project is by starring it. It's free, and really helps out. Other than that, you can support Melody's development by using my [Revivenode affiliate link](https://techy.lol/revivenode) which will give me a small percentage of what you spend at Revivenode, without charging you anything extra, or you can donate directly to me via [GitHub Sponsors](https://github.com/sponsors/NerdyTechy), or [buymeacoffee.com](https://www.buymeacoffee.com/techy). All donations are highly appreciated! <3
