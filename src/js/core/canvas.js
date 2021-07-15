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
     * @param {_Block} blockObj
     * @param {jQuery} snapped
     */
    addBlockEntity($block, blockObj, snapped) {
        let blockCount = 0;
        this._blocks.traverse(function (node) {
            if (node) {
                blockCount++;
            }
        });

        let parent = 'root';
        if (blockCount === 0) {
            parent = 'root';
        } else {
            // this seems to work so far
            if (snapped && snapped.length > 0) {
                parent = this.getBlockEntity(snapped[0]).id;
            } else {
                // need to cancel drag if there is no snap
                console.error('No Snap but more than one block');
            }
        }

        console.log('before', blockCount);

        this._blocks.addNode(new _ChartFlows.utils.treeNode(new this._itemClass($block, blockObj, this), []), parent);
        console.log('this._blocks', this._blocks);
    }

    /**
     *
     * @param {jQuery} $ele
     * @return {_ChartFlows.utils.treeNode}
     */
    getBlockEntity($ele) {
        let id = $ele.closest('.block-item').attr('id');
        let node = this._blocks.search(id);
        console.log('node', node);
        return node;
    }

}