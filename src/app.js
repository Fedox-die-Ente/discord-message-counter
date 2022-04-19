const Discord = require('discord.js');
const fs = require("fs")
const toml = require('toml')
const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8')) 
const mongoose = require('mongoose');
mongoose.connect(config.general.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const Messages = require("./models/messages")

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
    ], partials: ["CHANNEL"]
})

process.on('unhandledRejection', (err) => {
	console.error(`Unhandled Rejection: ${err}`);
});
  
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err}`);
});

// status
let status = config.status
, i = 0;

setInterval(function(){
    let text = status[parseInt(i, 10)].name.replace('{servercount}', client.guilds.cache.size);

    //set activity
    client.user.setActivity(text, { type: status[parseInt(i, 10)].type });
    if(status[parseInt(i+1, 10)]) i++;
    else i = 0;
}, 20000)

// events
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for(let file of eventFiles){
    const event = require('./events/' + file);
    client.on(event.name, (...args) => event.execute(...args));
}

//commands 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const prefix = `${config.general.prefix}`
for(let file of commandFiles){
    const commandName = file.split(".")[0];
    const command = require(`./commands/${commandName}`);
    client.commands.set(commandName, command)
}
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    let messageUser = await Messages.findOne({
        userID: message.author.id
    });

    if(!messageUser) {
        messageUser = new Messages({
            userID: message.author.id,
            messages: 0
        });
        await messageUser.save().catch(e => console.log(e));
    };

    await Messages.findOne({
        userID: message.author.id
    }, async (err, dUser) => {
        if(err) console.log(err);
        dUser.messages += 1;
        await dUser.save().catch(e => console.log(e));
    });

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName)
        if(!command) return
        command.run(client, message, args)
    }


})


client.login(`${config.general.token}`)