_ChartFlows.classes._Process = class extends _ChartFlows.classes._Block {
    constructor(id) {
        super(id);
        this.type = 'Process';
    }
}
ChartFlows.addBlock('Process', _ChartFlows.classes._Process);