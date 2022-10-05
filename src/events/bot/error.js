module.exports = {
    name: 'shardError',
    once: false,
    async execute(client){
        await client.channel.send("An error ocurred whilst executing this action. Please see the console log for more information.");
    },
};