/**
 *
 * @param {jQuery} canvas
 * @param {string} rootID css selector to get the root of the block
 * @returns {{endHandle: endHandle, startHandle: startHandle}}
 */
_ChartFlows.utils.drag = function (canvas, rootID) {


    if (!canvas instanceof jQuery) {
        console.error('Canvas is not a jquery object')
    }

    let originalEle, draggedEle;


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
        startHandle: function (event, ui) {
            originalEle = getEle($(event.target));
            if (originalEle) {
                _ChartFlows.utils.eventDispatch.fire('ondragstart', originalEle, draggedEle)
            }
        },
        endHandle: function (event, ui) {

            _ChartFlows.utils.eventDispatch.fire('ondragend', originalEle, draggedEle)
        },
        moveBlock: function (event, ui) {

            _ChartFlows.utils.eventDispatch.fire('ondragmove', originalEle, draggedEle)
        },
        revertHandle: function () {
            // todo check if dropped on canvas
            return true
        },
    }
}

