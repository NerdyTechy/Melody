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
  <img alt="Statistics Graphs" src="https://repobeats.axiom.co/api/embed/966fb1f700b2ca070b73426ccafcc5dd2b7576fb.svg">
</p>

<h2>Installation</h2>
<ol>
  <li>Download the source code from this repository.</li>
  <li>Upload to your hosting and extract the files. (Or just extract locally)</li>
  <li>Rename <strong>config.json.example</strong> to <strong>config.json</strong>.</li>
  <li>Enter Discord bot token, Discord bot client ID, and Genius API key into <strong>config.json</strong>.</li>
  <li><strong>Optional:</strong> Upload the custom emojis found in the <strong>/emojis/</strong> directory to your server, and set the IDs of the emojis in the configuration file. (Replace the default emoji with the ID of the custom emoji)</li>
  <li>Install dependencies listed in package.json.</li>
  <li>Launch bot with <strong>node src/bot.js</strong> or <strong>npm run test</strong>. (If your hosting is managed and you can't change the startup command, you should be able to set the file that is run at launch. This must be set to <strong>src/bot.js</strong>).</li>
</ol>

<h2>Analytics</h2>
By default, Melody sends a HTTP request to a custom analytics service when it boots up with a non-identifiable token (A SHA-256 hash of your client ID). This is purely done so that I can see the usage of my projects. The service does not track anything other than the amount of times that you start the bot, and the time that you last started the bot. I use these statistics to know the popularity of my projects over time, and how the general usage trend looks.
<br>
<br>
The API that runs this service is developed by me, so the information is not shared with any third parties. The analytics project is also open-source, and can be found <a href="https://github.com/NerdyTechy/Analytics">here</a>.
<br>
<br>
If you do not want to contribute to these analytics, you can disable the <strong>enableAnalytics</strong> option in the bot's configuration file, and no requests will be made to this service.
<br>
<br>
While leaving these analytics enabled helps me to understand the demand of my projects, which can help me to decide which projects deserve more attention in terms of updates, I respect that you may not agree to providing these analytics, and so I have tried to make it as easy to opt out of as possible.

<h2>Emojis</h2>
Melody utilises many custom emojis for menus, and so if you would like to use them, they are available in the <strong>/emojis/</strong> directory. Simply upload them to your server, and edit the config.json file to have the correct names and IDs. If you would like to make your own emojis, or use default Discord emojis, simply change the config file accordingly.

<h2>Genius</h2>
Melody utilises Genius' API to find lyrics for songs. A Genius API key is therefore required to use the bot. Obtaining one is free, and can be done so <a href="https://genius.com/api-clients">here</a>.

<h2>Hosting</h2>
Want to host this bot online? Any hosting company that provides Discord bot hosting will work, but I highly recommend <a href="https://techy.lol/revivenode">Revivenode</a> (Affiliate Link).
