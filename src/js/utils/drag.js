/**
 *
 * @param {string} rootID css selector to get the root of the block
 * @returns {{endHandle: endHandle, startHandle: startHandle}}
 */
_ChartFlows.utils.drag = function ( rootID) {
    let $originalEle, $helperEle;

    /**
     *
     * @param originalEle
     * @returns {boolean|jQuery}
     */
    function getEle(originalEle) {
        let res = originalEle.closest('.' + rootID);
        if (res.length === 0) {
            if (!originalEle.hasClass(rootID)) {
                console.error('Cant find the root of the block using the id: ', rootID);
                return false;
            }
        } else {
            originalEle = res;
        }
        return originalEle
    }

    return {
        /**
         *
         * @param event
         * @param ui
         */
        startHandle: function (event, ui) {
            $originalEle = getEle($(event.target));
            $helperEle = ui.helper;

            if ($originalEle) {
                _ChartFlows.utils.eventDispatch.fire('ondragstart', $originalEle, $helperEle)
            }
        },
        /**
         *
         * @param event
         * @param ui
         */
        endHandle: function (event, ui) {
            //console.log(event, ui)
           // $helperEle.remove();
            _ChartFlows.utils.eventDispatch.fire('ondragend', $originalEle)
        },
        /**
         *
         * @param event
         * @param ui
         */
        moveBlock: function (event, ui) {

            _ChartFlows.utils.eventDispatch.fire('ondragmove', $originalEle, $helperEle)
        },
    }
}

