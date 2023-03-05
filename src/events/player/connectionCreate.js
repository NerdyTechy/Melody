module.exports = {
    name: "connectionCreate",
    async execute(queue) {
        queue.connection.voiceConnection.on("stateChange", (oldState, newState) => {
            const oldNetworking = Reflect.get(oldState, "networking");
            const newNetworking = Reflect.get(newState, "networking");

            const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
                const newUdp = Reflect.get(newNetworkState, "udp");
                clearInterval(newUdp?.keepAliveInterval);
            };

            oldNetworking?.off("stateChange", networkStateChangeHandler);
            newNetworking?.on("stateChange", networkStateChangeHandler);
        });
    },
};
