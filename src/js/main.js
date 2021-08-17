if (typeof $ !== "function") {
    alert('jQuery is not loaded');
}
if (typeof jQuery.ui === "undefined") {
    alert('jQuery ui is not loaded');
}

let ChartFlows = new _ChartFlows.api();

ChartFlows.config.addTemplate('Process', `<div class="process">
    <div class="container-fluid">
    <div class="row">
        <div class="col-md-2"><?% info.icon %?></div>
        <div class="col-md-10">
            <p><?% info.name %?></p>
            <p><?% info.description %?></p>
        </div>
    </div>
    </div>
</div>`);
ChartFlows.config.addTemplate('Decision', `<div class="decision decision-node"><div class="start-node-inner"></div></div>`);
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
                let $template = startTemplate.$.clone().detach();
                api.canvas.element.append($template);
                let node = api.canvas.addBlockEntity($template, startTemplate, []);
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