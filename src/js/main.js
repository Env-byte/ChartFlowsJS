if (typeof $ !== "function") {
    alert('jQuery is not loaded');
}
if (typeof jQuery.ui === "undefined") {
    alert('jQuery ui is not loaded');
}


let ChartFlows = new _ChartFlows.api();

ChartFlows.config.addTemplate('Process', `<div class="processBlock process">
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