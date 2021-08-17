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
        this._instanceOf = '';
        this._id = 'Entity_' + _ChartFlows.utils.statics.genId()
        this.$ = $ele;
        this._parentID = null;
        this._init();
        this.info = {};
        this._pos = {
            left: '0px',
            top: '0px'
        }
        /**
         *
         * @type {string }
         * @private
         */
        this._parentArrowID = 'null';
    }

    set instanceOf(id) {
        this._instanceOf = id;
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

        this._createSnapIndicator();
        this._hDrag = _ChartFlows.utils.drag(this._id);

        let api = _ChartFlows.utils.statics.getApi();
        this.$.draggable({
            containment: api.canvas.element,
            handle: this.$.find('.container-fluid'),
            snap: '.snapIndicator:not(.' + this._id + ')', // create an indicator to snap to, then draw arrow from this block to the next
            snapMode: 'outer',
            snapTolerance: api.config.snapTolerance,
            drag: this._hDrag.moveBlock,
            start: (event, ui) => {
                let arrow = this.getParentArrow();
                if (arrow instanceof _ChartFlows.classes._Symbol ) {
                    arrow.hide();
                }

                this._hDrag.startHandle(event, ui)
            },
            stop: this._hDrag.endHandle,
        })

        this.$.on('click', (e) => {
            _ChartFlows.utils.eventDispatch.fire('blockclick', e, this)
        })
    }

    reparent(parent) {
        this.$.detach().appendTo(parent);
    }

    _createSnapIndicator() {
        let width = this.$.width();
        let left = (width / 2) - 6 // -6 as the indicator has width of 12 (in the scss file)
        let style = 'left:' + left + 'px;bottom:-6px;visibility:hidden';

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
        this._id = id;
        this.$.attr('id', id);
        this._hDrag.updateRootID(id);
    }

    serialize() {
        return {
            id: this._id,
            left: this._pos.left,
            top: this._pos.top,
            info: this.info,
            parentID: this._parentID,
            _instanceOf: this._instanceOf
        }

    }
}