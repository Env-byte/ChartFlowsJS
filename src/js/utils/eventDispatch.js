_ChartFlows.utils.eventDispatch = {
    fire: function (event, ...params) {
        if (ChartFlows.events.hasOwnProperty(event)) {
            ChartFlows.events[event](...params)
        }
    }
}
