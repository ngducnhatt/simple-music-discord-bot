const { PREFIX, TOKEN} = require("./config.json")

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, generateDependencyReport } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { search } = require('yt-search');
const sodium = require('libsodium-wrappers');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const connections = new Map();

client.once('ready', async () => {
    await sodium.ready; // Initialize libsodium-wrappers
    console.log('Bot is ready!');
    console.log(generateDependencyReport());
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        if (!args.length) {
            return message.reply('Please provide a YouTube URL or search term.');
        }

        const query = args.join(' ');
        let url;

        if (ytdl.validateURL(query)) {
            url = query;
        } else {
            try {
                const searchResult = await search(query);
                if (searchResult && searchResult.videos.length > 0) {
                    url = searchResult.videos[0].url;
                } else {
                    return message.reply('No results found.');
                }
            } catch (error) {
                console.error(error);
                return message.reply('An error occurred while searching for the video.');
            }
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to play music.');
        }

        let connection;
        try {
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
                connections.delete(message.guild.id);
            });

            connections.set(message.guild.id, connection);
        } catch (error) {
            console.error(error);
            return message.reply('An error occurred while trying to join the voice channel.');
        }

        const player = createAudioPlayer();
        player.on('error', error => {
            console.error(error);
            message.reply('An error occurred while playing the audio.');
            if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
            }
            connections.delete(message.guild.id);
        });

        try {
            const stream = ytdl(url, { filter: 'audioonly' });
            const resource = createAudioResource(stream);

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => {
                if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
                connections.delete(message.guild.id);
            });

            message.reply(`Now playing: ${url}`);
        } catch (error) {
            console.error(error);
            if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
            }
            connections.delete(message.guild.id);
            return message.reply('An error occurred while trying to play the audio.');
        }
    } else if (command === 'stop') {
        const connection = connections.get(message.guild.id);

        if (!connection) {
            return message.reply('I am not connected to a voice channel.');
        }

        if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
            connection.destroy();
        }
        connections.delete(message.guild.id);
        message.reply('Stopped playing music and left the voice channel.');
    }
});

client.login(TOKEN);
