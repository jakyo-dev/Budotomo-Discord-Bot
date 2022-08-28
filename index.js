require("dotenv").config()
const { Client, GatewayIntentBits } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
    allowedMentions: { parse: ["everyone"] },
})
const schedule = require("node-schedule")

const TOKEN = process.env.TOKEN

const m = new Date()
m.setDate(m.getDate() + ((((7 - m.getDay()) % 7) + 1) % 7))
const w = new Date()
w.setDate(w.getDate() + ((((7 - w.getDay()) % 7) + 3) % 7))
const dateOptions = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
}
const montag = m.toLocaleDateString("de-DE", dateOptions)
const mittwoch = w.toLocaleDateString("de-DE", dateOptions)

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    starteUmfragen()
    console.log(new Date().getHours())
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const { commandName } = interaction

    if (commandName === "starteteilnahmeumfragen") {
        try {
            starteUmfragen()
            await interaction.reply("Umfragen aktiv")
        } catch (error) {
            await interaction.reply("Irgendetwas ist schiefgelaufen...")
        }
    }

    if (commandName === "pausiereteilnahmeumfragen") {
        try {
            schedule.gracefulShutdown()
            console.log("Umfragen pausiert")
            interaction.reply("Umfragen pausiert")
        } catch (error) {
            await interaction.reply("Irgendetwas ist schiefgelaufen...")
        }
    }
})

async function starteUmfragen() {
    // const testChannel = "1009936933385941044"
    const umfrageChannel = "997867816306872400"

    const channel = client.channels.cache.get(umfrageChannel)

    // https://www.npmjs.com/package/node-schedule
    // SECONDS(OPT) MINUTES HOURS DAYOFMONTH MONTH DAYOFWEEK(0-7)
    // Achtung: Zeitzone vom jeweiligen Server ist meist anders (Stunden)!
    // const zeitpunkt = "0 15 * * 7"

    const MINUTES = 0
    const HOURS = 15
    const DAYOFMONTH = "*"
    const MONTH = "*"
    const DAYOFWEEK = 7

    const zeitpunkt = `${MINUTES} ${HOURS} ${DAYOFMONTH} ${MONTH} ${DAYOFWEEK}`

    schedule.scheduleJob(zeitpunkt, async () => {
        try {
            const message = await channel.send(
                `Trainingsteilnahme @everyone \n
                - M für ${montag} \n
                - W für ${mittwoch}`
            )
            await message.react("<:Montag:1010187185267421184>")
            await message.react("<:Mittwoch:1010187341882720317>")
        } catch (error) {
            console.error(error)
        }
    })
    console.log("Umfragen aktiv")
}

client.login(TOKEN)
