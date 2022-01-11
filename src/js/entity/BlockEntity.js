_ChartFlows.classes.blockEntity = class {
    /**
     *
     * @param  $ele
     */
    constructor($ele) {

        /**
         *
         * @type {string}
         * used to reconstruct this entity
         * @private
         */
        this.ClassName = 'BlockEntity'
        this._instanceOf = '';
        this._id = 'Entity_' + _ChartFlows.utils.statics.genId()
        this._hDrag = _ChartFlows.utils.drag(this._id);
        this.$ = $ele;
        this._parentID = null;
        this._init();
        this.type = '';
        this._info = {};
        this.data = new _ChartFlows.utils.data();
        this._pos = {
            left: '0px',
            top: '0px'
        }

        this.node = null;

        /**
         *
         * @type {string }
         * @private
         */
        this._parentArrowID = 'null';

    }

    set info(info) {
        this._info = info;
        if (info.hasOwnProperty('data') && info.data.length) {
            this.data = new _ChartFlows.utils.data(info.data);
            delete this._info['data'];
        }
    }

    get info() {
        return this._info;
    }

    set instanceOf(id) {
        this._instanceOf = id;
        this._createSnapIndicator();
    }

    get instanceOf() {
        return this._instanceOf;
    }

    /**
     *
     * @param {string} arrowID
     */
    set parentArrow(arrowID) {
        this._parentArrowID = arrowID;
    }

    /**
     *
     * @return {null|_Symbol}
     */
    getParentArrow() {
        let canvas = _ChartFlows.utils.statics.getApi().canvas;
        let node = canvas.blocks.search(this._parentID);
        if (node instanceof _ChartFlows.utils.treeNode && node.symbols.hasOwnProperty(this._parentArrowID)) {
            return node.symbols[this._parentArrowID];
        }
        return null;
    }

    /**
     *
     * @private
     */
    _init() {
        this.$.attr('id', this._id);
        this.$.removeClass('can-drop');

        let api = _ChartFlows.utils.statics.getApi();
        if (!_ChartFlows.utils.statics.getApi().config.disableDrag) {
            this.$.draggable({
                containment: api.canvas.element,
                handle: this.$.find('.container-fluid'),
                snap: '.snapIndicator:not(.' + this._id + ')', // create an indicator to snap to, then draw arrow from this block to the next
                snapMode: 'both',
                snapTolerance: api.config.snapTolerance,
                drag: this._hDrag.moveBlock,
                start: (event, ui) => {
                    let arrow = this.getParentArrow();
                    if (arrow instanceof _ChartFlows.classes._Symbol) {
                        arrow.hide();
                    }

                    this._hDrag.startHandle(event, ui)
                },
                stop: this._hDrag.endHandle,
            })
        }
        this.$.on('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            _ChartFlows.utils.eventDispatch.fire('blockclick', e, this)
        })
    }

    reparent($parent) {
        if ($parent.find('.start-node-inner').length > 0) {
            $parent = $parent.find('.start-node-inner');
        }
        this.$.detach().appendTo($parent);
    }

    _createSnapIndicator() {
        this.$.find('.snapIndicator').remove();
        let style = 'left:' + ((this.$.width() / 2) - 5) + 'px;bottom:-6px;';
        style += 'visibility:hidden;';
        let indicator = $('<div style="' + style + '" class="snapIndicator ' + this._id + '"></div>');
        this.$.append(indicator);
    }

    /**
     *
     * @return {{top: string|boolean, left: string|boolean}}
     */
    get pos() {
        return this._pos
    }

    /**
     *
     * @param {string|boolean} left
     * @param {string|boolean} top
     */
    setPos(left, top) {
        this.$.css('position', 'absolute');
        if (top) {
            this.$.css('top', top);
            this._pos.top = top;
        }
        if (left) {
            this.$.css('left', left);
            this._pos.left = left;
        }
    }

    set parentID(value) {
        this._parentID = value;
    }

    get parentID() {
        return this._parentID;
    }

    /**
     *
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     *
     * @param {string} id
     */
    set id(id) {
        //can not change start node id
        if (this._id === 'Entity_StartNode') {
            return;
        }

        this._id = id;
        this.$.attr('id', id);
        this.$.attr('id', id);
        if (this._hDrag) {
            this._hDrag.updateRootID(id);
        }
        this._createSnapIndicator();
        //change child parent id references
        let canvas = _ChartFlows.utils.statics.getApi().canvas;
        let thisNode = canvas.blocks.search(this._id);
        for (let i = 0, iL = thisNode.children.length; i < iL; i++) {
            thisNode.children[i].value.parentID = this._id;
        }
    }

    serialize() {
        let info = $.extend(true, {}, this._info);
        info.data = this.data.serialize()
        return {
            id: this._id,
            info: info,
            parentID: this._parentID,
            _instanceOf: this._instanceOf
        }
    }

    onCreate() {

    }

    onChildRemoved() {

    }
}