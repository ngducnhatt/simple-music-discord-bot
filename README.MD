# Simple Music Discord Bot

A simple Discord bot that plays music from YouTube. The bot can play a specific song when given a YouTube URL or search for a song based on a search query.

## Features

- Play music from YouTube using a URL or search query
- Join and leave voice channels
- Stop currently playing music

    Example Bot : [Jett]() - My music bot

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A Discord account and a Discord server

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ngducnhatt/simple-music-discord-bot.git
    ```

2. Install the required packages:
    ```sh
    npm install
    ```

3. Create a new Discord application and bot:
    - Go to the [Discord Developer Portal](https://discord.com/developers/applications)
    - Create a new application
    - Add a bot to your application
    - Copy the bot token

4. Go to `config.json` and edit your TOKEN
    ```env
    TOKEN=YOUR_BOT_TOKEN_HERE
    ```

5. Start the bot:
    ```sh
    node index.js
    ```

## Usage

1. Invite the bot to your server using the OAuth2 URL Generator on the Discord Developer Portal, with the `bot` scope and the necessary permissions (read messages, connect and speak in voice channels).

2. Use the following commands in your Discord server:
    - `-play <YouTube URL or search query>`: Play a song from YouTube.
    - `-stop`: Stop the currently playing music and leave the voice channel.

## Example

- To play a song using a YouTube URL:
    ```
    -play https://www.youtube.com/watch?v=dQw4w9WgXcQ
    ```

- To search for a song and play the first result:
    ```
    -play Never Gonna Give You Up
    ```

- To stop the currently playing song:
    ```
    -stop
    ```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
