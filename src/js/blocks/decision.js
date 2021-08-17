_ChartFlows.classes._Decision = class extends _ChartFlows.classes._Block {
    constructor(id) {
        super(id);
        this.type = 'Decision';
    }
}
ChartFlows.addBlock('Decision', _ChartFlows.classes._Decision);