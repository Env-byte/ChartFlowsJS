_ChartFlows.classes.canvas = class {
    /**
     *
     * @param element
     * @param {_ChartFlows.api} api
     */
    constructor(element, api) {
        this._itemClass = _ChartFlows.classes.blockEntity;
        this._$element = element;
        this._blocks = new _ChartFlows.utils.tree(null);
        this._api = api;
        this.init();
    }

    init() {
        this._hDrop = _ChartFlows.utils.drop(this);
        this._$element.droppable({
            tolerance: "fit",
            accept: ".block-item.can-drop",
            drop: this._hDrop.dropHandle
        })
    }

    get element() {
        return this._$element;
    }

    /**
     *
     * @param {jQuery} $block
     */
    addBlockEntity($block) {
        let blockList = this._api.blockList;
        if (blockList instanceof _ChartFlows.classes.blockList) {
            let blockID = $block.data('instance');
            let blockObj = this._api.blockList.getBlock(blockID)
            console.log(blockObj);
            this._blocks.addNode(new _ChartFlows.utils.treeNode(new this._itemClass($block, blockObj, this), []), 'root');
        }
    }
}