module.exports = {
    name: 'ready',
    once: true,
    async execute(client){
        console.log("The bot is now ready.");
    }
};