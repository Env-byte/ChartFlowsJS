_ChartFlows.utils.tree = class {
    /**
     *
     * @param {_ChartFlows.utils.treeNode|null} root
     */
    constructor(root) {
        this._root = root || null;
    }

    /**
     *
     * @param {function(_ChartFlows.utils.treeNode, number)} callback
     */
    traverse(callback) {
        function goThrough(node, level) {
            if (node instanceof _ChartFlows.utils.treeNode) {
                callback(node, level);
                node.children.forEach((child) => {
                    goThrough(child, level + 1);
                });
            }
        }

        goThrough(this._root, 0);
    }

    /**
     *
     * @param {_ChartFlows.utils.treeNode} value
     * @param {string} parentId
     */
    addNode(value, parentId) {
        if (this._root === null) {
            this._root = value;
            return;
        }

        this.traverse((node) => {

            if (node.id === parentId) {
                node.children.push(value);
            }
        });
    }

    /**
     *
     * @param {string} id
     */
    removeNode(id) {
        let removedNode = this.displayLeaves(id);

        this.traverse((node) => {
            node.children.forEach((childNode, index) => {
                if (childNode.id === id) {
                    node.children.splice(index, 1);
                    return removedNode;
                }
            });
        })
        return removedNode;
    }

    /**
     *
     * @param {string} id
     * @returns {boolean|_ChartFlows.utils.treeNode }
     */
    search(id) {
        let returnNode = false;
        this.traverse((node) => {
            if (node.id === id) {
                returnNode = node;
            }
        });
        return returnNode;
    }

    /**
     *
     * @param parentID
     * @returns {boolean|[]}
     */
    displayLeaves(parentID) {
        const parentNode = typeof parentID === 'string' ? this.search(parentID) : parentID;
        let leafsRet = [];

        if (parentNode instanceof _ChartFlows.utils.treeNode) {
            if (parentNode.children) {
                if (parentNode.children.length && parentNode.children.length > 0) {
                    parentNode.children.forEach((child) => {
                        // todo need to look at making this output a flat array
                        let childLeaves = this.displayLeaves(child);
                        if (childLeaves && childLeaves.length) {
                            leafsRet = leafsRet.concat(childLeaves);
                        }
                    });
                }
                leafsRet.push(parentNode)
                return leafsRet;

            }
            return [];
        } else {
            console.error('Invalid parameter parentID: ' + typeof parentID);
            return false;
        }
    }

    /**
     *
     * @param {string} childID
     * @return {_ChartFlows.utils.treeNode|boolean}
     */
    getParent(childID) {
        let parent = false;
        this.traverse((node) => {
            if (node instanceof _ChartFlows.utils.treeNode) {
                node.children.forEach((child) => {
                    if (child.value.id === childID) {
                        parent = node;
                    }
                })
            }
        })
        return parent;
    }

    /**
     *
     * @returns {null|_ChartFlows.utils.treeNode}
     */
    get root() {
        return this._root;
    }

    adjustTreeWidth() {
        let rows = [];
        this.traverse((node, level) => {
            if (!rows[level]) {
                rows[level] = {width: 0, nodes: []};
            }
            rows[level].width += node.value.$.width();
            rows[level].nodes.push(node);
        })
        //dont iterate over 0, stop just before
        for (let i = rows.length - 1, iL = 1; i > iL; i--) {
            let thisRow = rows[i];
            if (rows.hasOwnProperty(i - 1)) {
                let parentRow = rows[i - 1];
                if (thisRow.width > parentRow.width) {
                    let diff = parentRow.width - thisRow.width;
                    let offset = (diff / parentRow.nodes.length) / 4;
                    for (let key in parentRow.nodes) {
                        if (parentRow.nodes.hasOwnProperty(key)) {

                            let pos = parentRow.nodes[key].value.pos;
                            if (isNaN(pos.left)) {
                                let left = parentRow.nodes[key].value.$.css('left').replace('px', '');
                                pos.left = parseInt(left);
                            }
                            if (pos.left < 0) {
                                parentRow.nodes[key].value.setPos((pos.left + offset) + 'px', false);
                            } else {
                                parentRow.nodes[key].value.setPos((pos.left - offset) + 'px', false);
                            }
                        }
                    }

                }
            }
        }

        this.traverse((node) => {
            node.rebuildNodeLinks();
        })

    }
}
_ChartFlows.utils.treeNode = class {

    /**
     *
     * @param {_ChartFlows.classes.blockEntity} blockEntity
     * @param {_ChartFlows.utils.treeNode[]} children
     */
    constructor(blockEntity, children) {
        this.value = blockEntity;
        this.children = children;
        this.value.node = this;
        this.symbols = [];
        /**
         *
         * @type {string}
         */
        this.id = blockEntity.id
    }

    repositionChildren() {

        let child;
        let api = _ChartFlows.utils.statics.getApi();
        let top = this.value.$.height() + api.config.blockSpacing;

        if (this.children.length === 0) {
            return;
        }
        if (this.children.length === 1) {
            child = this.children[0];
            let offset = 0;

            console.log('this.$.width()', this.value.$.width())
            console.log('child.$.width()', child.value.$.width())

            if (this.value.$.width() > child.value.$.width()) {
                offset = this.value.$.width() - child.value.$.width();
            } else if (this.value.$.width() < child.value.$.width()) {
                offset = (this.value.$.width() / 2) - (child.value.$.width() / 2);
                console.log('offset', offset)
            }

            if (offset > 0) {
                offset = (offset / 2)
            }

            child.value.setPos('0px', top + 'px');
            child.value.$.css('margin-left', offset + 'px');
        } else {
            // todo need to work on this
            // set start to middle of the parent node
            let leftStart = this.value.$.width() / 2;

            //iterate over all the children and get the largest width block
            // do this because all blocks should be equally spaced
            let rowWidth = 20;
            let maxWidth = 0;
            for (let i = 0, iL = this.children.length; i < iL; i++) {
                child = this.children[i];
                //rowWidth += child.value.$.width() + 20;
                if (maxWidth < child.value.$.width()) {
                    maxWidth = child.value.$.width()
                }
            }

            //offset the start to center the child block under this block
            //this assumes all blocks are the same width
            //leftStart = leftStart - (maxWidth * this.children.length * .5) - ((this.children.length - 1) * 10);

            let offset = 0;
            rowWidth += (this.children.length * (20 + maxWidth));
            let left = rowWidth / -2;

            for (let i = 0, iL = this.children.length; i < iL; i++) {
                child = this.children[i];

                if (this.value.$.width() === child.value.$.width()) {
                    offset = leftStart;
                } else {
                    offset = leftStart;
                }

                child.value.setPos((left + offset) + 'px', top + 'px');

                if (i > 0) {
                    //if there is an odd number of nodes dont add margin to middle one
                    // if (!(this.children.length % 2 !== 0 && Math.ceil(this.children.length / 2) === i)) {
                    child.value.$.css('margin-left', 20 + 'px');
                    //}
                } else {
                    child.value.$.css('margin-left', 20 + 'px');
                }
                left += maxWidth + 20;
            }
        }
        //bug with and decision
        //api.canvas.blocks.adjustTreeWidth();
    }

    rebuildNodeLinks() {
        let child, arrow;

        let classDef = ChartFlows.getSymbol('Arrow');
        for (let i = 0, iL = this.symbols.length; i < iL; i++) {
            this.symbols[i].remove();
        }
        this.symbols = [];

        if (this.children.length === 0) {
            return;
        }

        for (let i = 0, iL = this.children.length; i < iL; i++) {
            arrow = new classDef(this);
            child = this.children[i];


            //for each child build arrow
            arrow.linkedTo = child.id;
            arrow.render(this.value, child.value)
            this.symbols.push(arrow);

            if (this.value instanceof _ChartFlows.classes.decisionEntity) {
                console.log('treeStructure - this.value.branches', this.value.branches)
                console.log('treeStructure - child.id', child.id)
                if (this.value.branches['true'] && this.value.branches['true'].id === child.id) {
                    arrow.$.addClass('arrowTrue')
                }
                if (this.value.branches['false'] && this.value.branches['false'].id === child.id) {
                    arrow.$.addClass('arrowFalse')
                }
            }
        }

        _ChartFlows.utils.eventDispatch.fire('buildlinks', this)
    }

    remove() {
        //remove html
        this.value.$.remove();

        //remove arrows to children
        for (let i = 0, iL = this.symbols.length; i < iL; i++) {
            if (this.symbols[i] instanceof _ChartFlows.classes._Symbol) {
                this.symbols[i].remove();
            }
        }
    }

    serialize() {
        return {block: this.value.serialize()};
    }
}