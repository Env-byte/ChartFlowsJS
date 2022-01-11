_ChartFlows.classes.emptyEntity = class extends _ChartFlows.classes.blockEntity {

    constructor($ele) {
        super($ele);
        console.log('_ChartFlows.classes.emptyEntity created')
        this.ClassName = 'EmptyEntity'
    }

    /**
     *
     * @private
     */
    _init() {
        this.$.attr('id', this._id);
        this.$.removeClass('can-drop');
        this.$.droppable({
            tolerance: "pointer",
            accept: ".block-item.can-drop",
            hoverClass: "outer-glow",
            drop: (event, ui) => {
                //replace this with the new block
                let canvas = _ChartFlows.utils.statics.getApi().canvas;

                let parent = canvas.blocks.search(this._parentID);
                let thisNode = canvas.blocks.search(this.id);
                let condition = ''
                if (parent.value instanceof _ChartFlows.classes.decisionEntity) {
                    condition = parent.value.getBranchById(this.id);
                }

                let $block = ui.helper.clone();
                $block.appendTo(canvas.element);
                let blockObj = _ChartFlows.utils.statics.getBlock($block);
                canvas.replaceBlockEntity(parent, thisNode, $block, blockObj, (node) => {
                    if (condition !== '') {
                        if (parent.value instanceof _ChartFlows.classes.decisionEntity) {
                            parent.value.setBranch(condition === 'true', node.value)
                        }
                    }
                })

            }
        })
        let api = _ChartFlows.utils.statics.getApi();
    }

    set instanceOf(id) {
        this._instanceOf = id;
    }

    _createSnapIndicator() {
        return;
    }
}