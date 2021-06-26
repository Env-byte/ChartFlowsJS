/**
 *
 * @param {jQuery} canvas
 * @returns {{start: start}}
 */
_ChartFlows.utils.drag = function (canvas) {

    if (!canvas instanceof jQuery) {
        console.error('Canvas is not a jquery object')
    }

    let offset = {}, mouse = {}, drag = {}, originalEle, dragEle, active, rearrange;

    if (window.getComputedStyle(canvas[0]).position === "absolute" || window.getComputedStyle(canvas[0]).position === "fixed") {
        offset.x = canvas[0].getBoundingClientRect().left;
        offset.y = canvas[0].getBoundingClientRect().top;
    }

    return {
        startHandle: function (event) {

            if (event.targetTouches) {
                mouse.x = event.changedTouches[0].clientX;
                mouse.y = event.changedTouches[0].clientY;
            } else {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
            }

            if (event.which !== 3 && $(event.target)) {
                originalEle = $(event.target)
                $(event.target).addClass("active");

                let newNode = event.target.closest(".create-flowy").clone();
                newNode.classList.add("block");

                dragEle = newNode.appendTo(canvas)
                dragEle.addClass("dragging");
                originalEle.addClass("dragged-now");

                active = true;

                drag.x = mouse.x - (originalEle[0].getBoundingClientRect().left);
                drag.y = mouse.y - (originalEle[0].getBoundingClientRect().top);

                dragEle.style('left', mouse.x - drag.x + "px");
                dragEle.style('top', mouse.y - drag.y + "px");

                _ChartFlows.utils.eventDispatch.fire('ondragstart', originalEle, dragEle)
            }
        },
        endHandle: function (event) {

            if (event.which !== 3 && (active || rearrange)) {
                dragblock = false;

                if (!document.querySelector(".indicator").classList.contains("invisible")) {
                    document.querySelector(".indicator").classList.add("invisible");
                }

                if (active) {
                    originalEle.removeClass("dragged-now");
                    dragEle.removeClass("dragging");
                }

                let condition = (dragEle[0].getBoundingClientRect().top + window.scrollY) > (offset.y + window.scrollY) && (dragEle[0].getBoundingClientRect().left + window.scrollX) > (offset.x + window.scrollX);

                if (parseInt(drag.querySelector(".blockid").value) === 0 && rearrange) {
                    firstBlock("rearrange")
                } else if (active && blocks.length == 0 && condition) {
                    firstBlock("drop");
                } else if (active && blocks.length == 0) {
                    removeSelection();
                } else if (active) {

                } else if (rearrange) {

                }
            }


            _ChartFlows.utils.eventDispatch.fire('ondragstart', originalEle, dragEle)
        }
    }
}

