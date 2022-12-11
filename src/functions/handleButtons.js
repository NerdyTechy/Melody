const fs = require('node:fs');

module.exports = (client) => {
	client.handleButtons = async() => {
		client.buttonArray = [];

		const buttonFiles = fs.readdirSync('src/buttons').filter(file => file.endsWith('.js'));

		for (file of buttonFiles){
            const button = require(`../buttons/${file}`);
            client.buttons.set(button.data.name, button);
            client.buttonArray.push(button.data.toJSON());
		}
	};
}
