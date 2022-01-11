_ChartFlows.classes.canvas = class {
    /**
     *
     * @param element
     */
    constructor(element) {
        this._$element = element;
        this._blocks = new _ChartFlows.utils.tree(null);
        this.init();
    }

    init() {
        this._hDrop = _ChartFlows.utils.drop();
        if (!_ChartFlows.utils.statics.getApi().config.disableDrag) {
            this._$element.droppable({
                tolerance: "fit",
                accept: ".block-item.can-drop",
                drop: this._hDrop.dropHandle
            })
        }
    }

    /**
     *
     * @return {jQuery}
     */
    get element() {
        return this._$element;
    }

    /**
     * @return { _ChartFlows.utils.tree}
     */
    get blocks() {
        return this._blocks;
    }

    /**
     * @param {_ChartFlows.utils.treeNode} parentNode
     * @param {_ChartFlows.utils.treeNode} oldNode
     * @param {jQuery} $block
     * @param {_ChartFlows.classes._Block} instanceOf
     * @return { _ChartFlows.utils.treeNode|boolean}
     */
    replaceBlockEntity(parentNode, oldNode, $block, instanceOf, onReplace) {
        let newBlock = _ChartFlows.utils.statics.createBlockEntity($block, instanceOf);
        oldNode.value.$.remove();
        oldNode.id = newBlock.id;
        oldNode.value = newBlock;
        newBlock.onCreate();

        if (typeof onReplace === "function") {
            onReplace(oldNode);
        }

        if (parentNode && parentNode instanceof _ChartFlows.utils.treeNode) {
            //reposition block using the spacing from config;
            this._BuildLinks(parentNode, oldNode)
        }

        let result;
        if (_ChartFlows.utils.statics.getApi().loading === false) {
            result = _ChartFlows.utils.eventDispatch.fire('blocksnap', newBlock, parentNode || false)
            if (result === false) {
                newBlock.$.remove();
                console.log('blocksnap event false')
                return false;
            }
        }

        if (_ChartFlows.utils.statics.getApi().loading === false) {
            _ChartFlows.utils.eventDispatch.fire('afterreplace', oldNode, parentNode || false)
        }

        return oldNode;
    }

    /**
     * @param {jQuery} $block
     * @param {_ChartFlows.classes._Block} instanceOf
     * @param {_ChartFlows.utils.treeNode|false} snapped
     * @param  OnBlockCreated
     * @return { _ChartFlows.utils.treeNode|boolean}
     */
    addBlockEntity($block, instanceOf, snapped, OnBlockCreated) {
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

        let newBlock = _ChartFlows.utils.statics.createBlockEntity($block, instanceOf);

        if (typeof OnBlockCreated === "function") {
            if (OnBlockCreated(newBlock) === false) {
                newBlock.$.remove();
                console.log('OnBlockCreated false')
                return false;
            }
        }

        let result;
        if (_ChartFlows.utils.statics.getApi().loading === false) {
            result = _ChartFlows.utils.eventDispatch.fire('blocksnap', newBlock, parentNode || false)
            if (result === false) {
                newBlock.$.remove();
                console.log('blocksnap event false')
                return false;
            }
        }

        let node = new _ChartFlows.utils.treeNode(newBlock, []);
        this._blocks.addNode(node, parent);
        console.log('loading', _ChartFlows.utils.statics.getApi().loading);
        if (_ChartFlows.utils.statics.getApi().loading === false) {
            newBlock.onCreate();
        }
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
        let existingParent = this._blocks.search(blockEntity.parentID);

        if (existingParent.value instanceof _ChartFlows.classes.decisionEntity) {
            existingParent.value.removeBranch(blockEntity.id);
        }
        this._blocks.removeNode(blockEntity.id)
        this._blocks.addNode(node, parent)

        if (parentNode.value instanceof _ChartFlows.classes.decisionEntity) {
            if ($(snapped[0]).hasClass('true')) {
                parentNode.value.setBranch(true, blockEntity);
            } else {
                parentNode.value.setBranch(false, blockEntity);
            }
        }

        setTimeout(() => {
            this._BuildLinks(parentNode, node)
            _ChartFlows.utils.eventDispatch.fire('blockreparent', blockEntity, parentNode.value)
            _ChartFlows.utils.eventDispatch.fire('afterblocksnap', blockEntity, parentNode || false)
        }, 30);
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
     * @param {string}id
     * @param {false|null}silent
     * @return {*}
     */
    removeBlockEntity(id, silent) {
        let node = this._blocks.search(id);
        let parentID = node.value.parentID;
        let parentNode = this._blocks.search(parentID);

        //rebuild parent node links
        if (parentNode.value instanceof _ChartFlows.classes.decisionEntity) {
            let instanceOf = new _ChartFlows.classes._Empty('emptyBlock');
            instanceOf.init(false);
            let $template;
            $template = instanceOf.$.clone().detach();
            _ChartFlows.utils.statics.getApi().canvas.element.append($template);
            $template.removeClass('can-drop')
            $template.css('position', 'absolute')
            let condition = parentNode.value.getBranchById(node.id);
            this.replaceBlockEntity(parentNode, node, $template, instanceOf, (newNode) => {
                parentNode.value.setBranch(condition === 'true', newNode.value)

            });
            return [node];
        }
        let nodesRemoved = this._blocks.removeNode(id);
        for (let key in nodesRemoved) {
            if (nodesRemoved.hasOwnProperty(key) && nodesRemoved[key] instanceof _ChartFlows.utils.treeNode) {
                //remove arrows and block html
                nodesRemoved[key].remove()
            } else {
                console.error('Error node is not instance of treeNode', nodesRemoved[key])
            }
        }

        if (!silent) {
            parentNode.value.onChildRemoved();
        }
        if (parentNode) {
            this._BuildLinks(parentNode, false);
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
        if (node && node instanceof _ChartFlows.utils.treeNode) {
            node.value.parentID = parentNode.value.id;
            node.value.reparent(parentNode.value.$);
        }
        this.blocks.traverse(function (node) {
            node.repositionChildren();
            node.rebuildNodeLinks();
        });
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