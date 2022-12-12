module.exports = {
    name: 'shardError',
    once: false,
    async execute(error, client){
        return console.error(error);
    },
};