if (typeof $ !== "function") {
    alert('jQuery is not loaded');
}
let ChartFlows = new _ChartFlowsApi();

ChartFlows.config.addTemplate('Process', `<div data-id="<?% id %?>" class="block-item process">
    <div class="container-fluid">
        <div class="col-md-2"><?% info.icon %?></div>
        <div class="col-md-10">
            <p><?% info.name %?></p>
            <p><?% info.description %?></p>
        </div>
    </div>
</div>`);