/**
 *
 * @param {jQuery} canvas
 * @returns {{start: start}}
 */
_ChartFlows.utils.drag = function (canvas) {

    if (!canvas instanceof jQuery) {
        console.error('Canvas is not a jquery object')
    }

    let offset = {}, mouse = {}, drag = {}, originalEle, dragEle, active;

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

                active = true;
                drag.x = mouse.x - (originalEle[0].getBoundingClientRect().left);
                drag.y = mouse.y - (originalEle[0].getBoundingClientRect().top);

                dragEle.style('left', mouse.x - drag.x + "px");
                dragEle.style('top', mouse.y - drag.y + "px");

                _ChartFlows.utils.eventDispatch.fire('ondragstart', originalEle, dragEle)
            }
        },
        endHandle: function (event) {

            if (event.which != 3 && (active || rearrange)) {
                dragblock = false;
                blockReleased();
                if (!document.querySelector(".indicator").classList.contains("invisible")) {
                    document.querySelector(".indicator").classList.add("invisible");
                }
                if (active) {
                    original.classList.remove("dragnow");
                    drag.classList.remove("dragging");
                }
                if (parseInt(drag.querySelector(".blockid").value) === 0 && rearrange) {
                    firstBlock("rearrange")
                } else if (active && blocks.length == 0 && (drag.getBoundingClientRect().top + window.scrollY) > (canvas_div.getBoundingClientRect().top + window.scrollY) && (drag.getBoundingClientRect().left + window.scrollX) > (canvas_div.getBoundingClientRect().left + window.scrollX)) {
                    firstBlock("drop");
                } else if (active && blocks.length == 0) {
                    removeSelection();
                } else if (active) {
                    var blocko = blocks.map(a => a.id);
                    for (var i = 0; i < blocks.length; i++) {
                        if (checkAttach(blocko[i])) {
                            active = false;
                            if (blockSnap(drag, false, document.querySelector(".blockid[value='" + blocko[i] + "']").parentNode)) {
                                snap(drag, i, blocko);
                            } else {
                                active = false;
                                removeSelection();
                            }
                            break;
                        } else if (i == blocks.length - 1) {
                            active = false;
                            removeSelection();
                        }
                    }
                } else if (rearrange) {
                    var blocko = blocks.map(a => a.id);
                    for (var i = 0; i < blocks.length; i++) {
                        if (checkAttach(blocko[i])) {
                            active = false;
                            drag.classList.remove("dragging");
                            snap(drag, i, blocko);
                            break;
                        } else if (i == blocks.length - 1) {
                            if (beforeDelete(drag, blocks.filter(id => id.id == blocko[i])[0])) {
                                active = false;
                                drag.classList.remove("dragging");
                                snap(drag, blocko.indexOf(prevblock), blocko);
                                break;
                            } else {
                                rearrange = false;
                                blockstemp = [];
                                active = false;
                                removeSelection();
                                break;
                            }
                        }
                    }
                }
            }


            _ChartFlows.utils.eventDispatch.fire('ondragstart', originalEle, dragEle)
        }
    }
}

