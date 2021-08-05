_ChartFlows.classes.canvas = class {
    /**
     *
     * @param element
     */
    constructor(element) {
        this._itemClass = _ChartFlows.classes.blockEntity;
        this._$element = element;
        this._blocks = new _ChartFlows.utils.tree(null);
        this.init();
    }

    init() {
        this._hDrop = _ChartFlows.utils.drop();
        this._$element.droppable({
            tolerance: "fit",
            accept: ".block-item.can-drop",
            drop: this._hDrop.dropHandle
        })
    }

    /**
     *
     * @return {jQuery}
     */
    get element() {
        return this._$element;
    }

    /**
     *
     * @return { _ChartFlows.utils.tree}
     */
    get blocks() {
        return this._blocks;
    }

    /**
     *
     * @param {jQuery} $block
     * @param {_Block} blockObj
     * @param {jQuery[] | _ChartFlows.utils.treeNode} snapped
     * @return { _ChartFlows.utils.treeNode|boolean}
     */
    addBlockEntity($block, blockObj, snapped) {
        let blockCount = 0;
        this._blocks.traverse(function (node) {
            if (node) {
                blockCount++;
            }
        });

        let parent = 'root';
        let parentNode = false;
        if (blockCount === 0) {
            parent = 'root';
        } else {
            console.log('snapped', snapped)
            if (snapped) {
                if (snapped instanceof _ChartFlows.utils.treeNode) {
                    parentNode = snapped;
                } else if (snapped.length > 0) {
                    parentNode = this.getBlockEntityNode(snapped[0]);
                    if (parentNode === false) {
                        console.error('Could not find parent');
                        $block.remove();
                        return false;
                    }
                } else {
                    console.error('No Snap but more than one block');
                    $block.remove();
                    return false;
                }
                parent = parentNode.id;
            } else {
                // need to cancel drag if there is no snap
                console.error('No Snap but more than one block');
                $block.remove();
                return false;
            }
        }

        //setup class
        let newBlock = new this._itemClass($block);
        newBlock.info = $.extend(true, {}, blockObj.info);
        newBlock.instanceOf = blockObj.id;
        newBlock.setPos($block.css('left'), $block.css('top'));

        let result = _ChartFlows.utils.eventDispatch.fire('blocksnap', newBlock, parentNode.value || false)

        if (result === false) {
            newBlock.$.remove();
            return false;
        }

        let node = new _ChartFlows.utils.treeNode(newBlock, []);
        this._blocks.addNode(node, parent);
        if (parentNode && parentNode instanceof _ChartFlows.utils.treeNode) {
            //reposition block using the spacing from config;
            this._BuildLinks(parentNode, node)
        }

        return node;
    }

    /**
     *
     * @param {_ChartFlows.classes.blockEntity} blockEntity
     * @param {jQuery[]} snapped
     */
    changeBlockEntityParent(blockEntity, snapped) {
        if (snapped.length === 0) {
            this._revertPosition(blockEntity);
            return;
        }
        let parentNode = this.getBlockEntityNode(snapped[0]);
        let parent = parentNode.id;

        let result = _ChartFlows.utils.eventDispatch.fire('blocksnap', blockEntity, parentNode.value)

        if (result === false) {
            this._revertPosition(blockEntity);
            return;
        }

        //detach from tree remove arrows
        let node = this._blocks.search(blockEntity.id)
        this._blocks.removeNode(blockEntity.id)
        this._blocks.addNode(node, parent)

        this._BuildLinks(parentNode, node)
        _ChartFlows.utils.eventDispatch.fire('blockreparent', blockEntity, parentNode.value)
    }

    /**
     *
     * @param {jQuery} $ele
     * @return {_ChartFlows.utils.treeNode}
     */
    getBlockEntityNode($ele) {
        let id = $ele.closest('.block-item').attr('id');
        return this._blocks.search(id);
    }

    /**
     *
     * @param {_ChartFlows.utils.treeNode} parentNode
     * @param {_ChartFlows.utils.treeNode} node
     * @private
     */
    _BuildLinks(parentNode, node) {
        //reattach to tree reposition then build arrows.
        parentNode.repositionChildren()
        parentNode.rebuildNodeLinks();
        node.value.parentID = parentNode.value.id;
        node.value.reparent(parentNode.value.$);
    }

    /**
     *
     * @param {_ChartFlows.classes.blockEntity } blockEntity
     * @private
     */
    _revertPosition(blockEntity) {
        let arrow = blockEntity.getParentArrow();

        // revert position
        blockEntity.$.animate({
                left: blockEntity.pos.left,
                top: blockEntity.pos.top
            },
            300,
            () => {
                if (arrow instanceof _Symbol) {
                    arrow.show();
                }
            })

    }
}