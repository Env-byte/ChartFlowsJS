_ChartFlows.utils.eventDispatch = {
    fire: function (event, ...params) {
        if (ChartFlows.events.hasOwnProperty(event)) {
            if (typeof ChartFlows.events[event] === "function") {
                ChartFlows.events[event](...params)
            }
        }
    }
}
