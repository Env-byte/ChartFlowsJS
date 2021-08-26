if (typeof $ !== "function") {
    alert('jQuery is not loaded');
}

let ChartFlows = new _ChartFlows.api();

const BlockTemplate = `<div class="process">
    <div class="container-fluid">
    <div class="row">
        <div class="col-md-2"><% info.icon %></div>
        <div class="col-md-10">
            <p><% info.name %></p>
            <p><% info.description %></p>
        </div>
    </div>
    </div>
</div>`

ChartFlows.config.addTemplate('ListTemplate', BlockTemplate);
ChartFlows.config.addTemplate('Process', BlockTemplate);
ChartFlows.config.addTemplate('Decision', `<div class="decision-wrapper"><div class="decision decision-node"><div class="decision-node-inner"><p class="text-center" style="margin-top: 20px"><% info.name %></p></div></div></div>`);
ChartFlows.config.addTemplate('Start', `<div class="start"><div class="container-fluid">
    <div class="row">
        <div class="col-md-12 text-center">
        <h4>Start</h4>
        </div>
    </div>
    </div></div>`);


ChartFlows.on('initialized', (api) => {
    if (api instanceof _ChartFlows.api && api.config.showStart) {
        api.blockList.add('Start', {
            id: 'StartNode',
            name: 'StartNode',
            description: '',
            icon: '',
            data: [],
            hidden: true
        });
        let blockList = api.blockList;
        if (blockList instanceof _ChartFlows.classes.blockList) {
            let startTemplate = blockList.getBlock('StartNode');
            if (startTemplate) {
                let node = api.addToCanvas(startTemplate, [], {id: api.config.startNodeID});
                if (node) {
                    let left = (api.canvas.element.width() / 2) - (node.value.$.width() / 2);
                    let top = node.value.$.height() + 40;
                    node.value.setPos(left + 'px', top + 'px');
                    //show node as its set to invisible above
                    node.value.$.show();
                }
            }
        }
    }
})