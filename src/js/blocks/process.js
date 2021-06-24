ChartFlows.addBlock('Process', class extends _Block {
    constructor() {
        super();
        console.log(this)
        this.template = `<div class="block-item"><div class="container-fluid"><div class="col-md-2">${this.info.icon}</div></div></div>`;
        console.log(this.template)
    }
});