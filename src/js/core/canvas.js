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
     * @param {_ChartFlows.classes._Block} instanceOf
     * @param {_ChartFlows.utils.treeNode|false} snapped
     * @return { _ChartFlows.utils.treeNode|boolean}
     */
    addBlockEntity($block, instanceOf, snapped) {
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
            if (ChartFlows.config.debug === 1) {
                console.log('snappedTo', snapped)
            }
            if (snapped && snapped instanceof _ChartFlows.utils.treeNode) {
                parentNode = snapped;
                parent = parentNode.id;
            } else {
                // need to cancel drag if there is no snap
                console.error('No Snap but more than one block');
                $block.remove();
                return false;
            }
        }

        //replace $block with the canvas template from the class the block is instanced from

        let $parent = $block.parent();

        let left = $block.css('left');
        let top = $block.css('top');
        $block.remove();

        let $canvasBlock = $(instanceOf.getCanvasHtml());
        $parent.append($canvasBlock);
        $canvasBlock.addClass('block-item');

        //setup class
        let newBlock = new this._itemClass($canvasBlock);
        newBlock.info = $.extend(true, {}, instanceOf.info);
        newBlock.instanceOf = instanceOf.id;
        newBlock.setPos(left, top);
        newBlock.type = instanceOf.type;
        _ChartFlows.utils.eventDispatch.fire('createdblockentity', newBlock, instanceOf)

        let result;
        if (_ChartFlows.utils.statics.getApi().loading === false) {
            result = _ChartFlows.utils.eventDispatch.fire('blocksnap', newBlock, parentNode || false)
            if (result === false) {
                newBlock.$.remove();
                return false;
            }
        }

        let node = new _ChartFlows.utils.treeNode(newBlock, []);
        this._blocks.addNode(node, parent);
        if (parentNode && parentNode instanceof _ChartFlows.utils.treeNode) {
            //reposition block using the spacing from config;
            this._BuildLinks(parentNode, node)
        }

        if (_ChartFlows.utils.statics.getApi().loading === false) {
            _ChartFlows.utils.eventDispatch.fire('afterblocksnap', newBlock, parentNode || false)
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
        _ChartFlows.utils.eventDispatch.fire('afterblocksnap', blockEntity, parentNode || false)

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

    removeBlockEntity(id) {
        let node = this._blocks.search(id);
        let parentID = node.value.parentID;
        let nodesRemoved = this._blocks.removeNode(id);

        for (let key in nodesRemoved) {
            if (nodesRemoved.hasOwnProperty(key) && nodesRemoved[key] instanceof _ChartFlows.utils.treeNode) {
                //remove arrows and block html
                nodesRemoved[key].remove()
            } else {
                console.error('Error node is not instance of treeNode', nodesRemoved[key])
            }
        }

        if (parentID !== null) {
            let parentNode = this._blocks.search(node.value.parentID);
            //rebuild parent node links
            if (parentNode) {
                this._BuildLinks(parentNode, false);
            }
        }
        return nodesRemoved;
    }

    /**
     *
     * @param {_ChartFlows.utils.treeNode} parentNode
     * @param {_ChartFlows.utils.treeNode|boolean} node
     * @private
     */
    _BuildLinks(parentNode, node) {
        //reattach to tree reposition then build arrows.
        parentNode.repositionChildren()
        parentNode.rebuildNodeLinks();
        if (node && node instanceof _ChartFlows.utils.treeNode) {
            node.value.parentID = parentNode.value.id;
            node.value.reparent(parentNode.value.$);
        }
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
                if (arrow instanceof _ChartFlows.classes._Symbol) {
                    arrow.show();
                }
            })

    }
}