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
     * @param {function(_ChartFlows.utils.treeNode|boolean)} callback
     */
    traverse(callback) {
        function goThrough(node) {
            if (node instanceof _ChartFlows.utils.treeNode) {
                callback(node);
                node.children.forEach((child) => {
                    goThrough(child);
                });
            } else {
                callback(false);
            }
        }

        goThrough(this._root);
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

        let top = this.value.$.height() + _ChartFlows.utils.statics.getApi().config.blockSpacing;

        if (this.children.length === 0) {
            return;
        }
        if (this.children.length === 1) {
            child = this.children[0];
            let offset = 0;

            if (this.value.$.width() > child.value.$.width()) {
                offset = this.value.$.width() - child.value.$.width();
            } else if (this.value.$.width() < child.value.$.width()) {
                offset = this.value.$.width() - child.value.$.width();
            }
            if (offset > 0) {
                offset = (offset / 2)
            }
            console.log('offset', offset)

            child.value.setPos('0px', top + 'px');
            child.value.$.css('margin-left', offset + 'px');
        } else {
            // set start to middle of the parent node
            let leftStart = this.value.$.width() / 2;

            //iterate over all the children and get the highest width block
            let maxWidth = 0;
            for (let i = 0, iL = this.children.length; i < iL; i++) {
                child = this.children[i];
                if (child.value.$.width() > maxWidth) {
                    maxWidth = child.value.$.width();
                }
            }

            //offset the start to center the child block under this block
            //this assumes all blocks are the same width
            leftStart = leftStart - (maxWidth * this.children.length * .5) - ((this.children.length - 1) * 10);

            for (let i = 0, iL = this.children.length; i < iL; i++) {
                child = this.children[i];

                let offset = 0;
                if (maxWidth > child.value.$.width()) {
                    offset = (maxWidth - child.value.$.width()) / 2;
                }

                // 20 margin between each one
                let left = leftStart + (i * (maxWidth + 20));

                child.value.setPos(left + 'px', top + 'px');
                child.value.$.css('margin-left', offset + 'px');
            }

        }
    }

    rebuildNodeLinks() {
        //the that the arrows should branch from
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
        let data = {
            block: this.value.serialize(),
            symbols: []
        }

        for (let i = 0, iL = this.symbols.length; i < iL; i++) {
            data.symbols.push(this.symbols[i].serialize());
        }

        return data;

    }
}