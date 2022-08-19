require("dotenv").config()
const { SlashCommandBuilder, Routes } = require("discord.js")
const { REST } = require("@discordjs/rest")

const clientId = process.env.TOKEN
const guildId = process.env.GUILD_ID
const token = process.env.CLIENT_ID

const rest = new REST({ version: "10" }).setToken(token)

const commands = [
    new SlashCommandBuilder()
        .setName("starteteilnahmeumfragen")
        .setDescription(
            "Startet die wöchentlichen Teilnahmeumfragen (Sonntag 18 Uhr)."
        ),
    new SlashCommandBuilder()
        .setName("pausiereteilnahmeumfragen")
        .setDescription("Pausiert die wöchentlichen Teilnahmeumfragen."),
].map((command) => command.toJSON())

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error)

// rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
//     .then(() => console.log("Successfully deleted all guild commands."))
//     .catch(console.error)
