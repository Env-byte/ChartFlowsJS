_ChartFlows.utils.eventDispatch = {
    availableEvents: [
        /*
        * called when done initializing
        * @param {_ChartFlows.api } api
        */
        'initialized',

        /*
        * Called on block drag start
        * @param {jQuery} helperEle
        * @param {jQuery} originalEle
        */
        'dragstart', //done

        /*
        * Called on block drag end
        * @param {jQuery} helperEle
        * @param {jQuery} originalEle
        */
        'dragend', //done

        /*
         * Called when the block moves
         * @param {jQuery} helperEle
         * @param {jQuery} originalEle
         */
        'dragmove', //done

        /*
         * called when a new block is dropped onto the canvas
         * @param {eventData} event
         * @param {_Block} block
         * return false to prevent drop
         */
        'drop', //done

        /*
         * called on block click
         * @param {eventData} event - the normal event data from a click event
         * @param {_ChartFlows.classes.blockEntity} block
         */
        'blockclick', //done

        /*
         * called after the block gets re-parented
         * @param {_ChartFlows.classes.blockEntity} block
         * @param {_ChartFlows.classes.blockEntity|null} parent
         */
        'blockreparent', //done

        /*
         *  before the block gets added to canvas / re-parented
         *
         * return false to prevent snap
         * @param {_ChartFlows.classes.blockEntity} block
         * @param {_ChartFlows.classes.blockEntity|null} parent
         *
         * return false to prevent
         */
        'blocksnap', //done
    ],

    /**
     *
     * @param {string} event
     * @param params
     * @return null|boolean
     */
    fire: function (event, ...params) {
        if (ChartFlows.events.hasOwnProperty(event)) {
            if (ChartFlows.events[event]) {
                for (let i = 0, iL = ChartFlows.events[event].length; i < iL; i++) {
                    if (typeof ChartFlows.events[event][i] === "function") {
                        return ChartFlows.events[event][i](...params);
                    }
                }
            }
        }
    }
}