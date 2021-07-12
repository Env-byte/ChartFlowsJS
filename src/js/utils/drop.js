/**
 *
 * @param {jQuery} canvas
 * @returns {{createHandle: createHandle, activateHandle: activateHandle, deactivateHandle: deactivateHandle, outHandle: outHandle, dropHandle: dropHandle, overHandle: overHandle}}
 */
_ChartFlows.utils.drop = function (canvas) {
    let originalEle, draggedEle;
    if (!canvas instanceof jQuery) {
        console.error('Canvas is not a jquery object')
    }

    return {
        deactivateHandle: function (event, ui) {

            _ChartFlows.utils.eventDispatch.fire('ondropdeactivate', originalEle, draggedEle)
        },
        dropHandle: function (event, ui) {

            _ChartFlows.utils.eventDispatch.fire('ondrop', originalEle, draggedEle)
        },
        outHandle: function (event, ui) {

            _ChartFlows.utils.eventDispatch.fire('ondropout', originalEle, draggedEle)
        },
        overHandle: function (event, ui) {

            _ChartFlows.utils.eventDispatch.fire('ondropover', originalEle, draggedEle)
        },
    }
}

