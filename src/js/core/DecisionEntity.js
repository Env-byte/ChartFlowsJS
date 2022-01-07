_ChartFlows.classes.decisionEntity = class extends _ChartFlows.classes.blockEntity {
    constructor($ele) {
        super($ele);
        this.ClassName = 'DecisionEntity'
        this._branches = {"true": null, "false": null};
    }

    /**
     *
     * @param {boolean} cond
     * @param {_ChartFlows.classes.blockEntity} blockEntity
     */
    setBranch(cond, blockEntity) {
        if (cond) {
            this._branches["true"] = blockEntity;
        } else {
            this._branches["false"] = blockEntity;
        }
        if (ChartFlows.config.debug === 1) {
            console.log('DecisionEntity - setBranch', this._branches)
        }
    }

    /**
     *
     * @param {string} id
     */
    removeBranch(id) {
        if (this._branches["true"] instanceof _ChartFlows.classes.blockEntity) {
            if (this._branches["true"].id === id) {
                this._branches["true"] = null;
                return;
            }
        }
        if (this._branches["false"] instanceof _ChartFlows.classes.blockEntity) {
            if (this._branches["false"].id === id) {
                this._branches["false"] = null;
            }
        }
    }

    get branches() {
        return this._branches;
    }

    _createSnapIndicator() {
        this.$.find('.snapIndicator').remove();
        let height = (this.$.height() / 4) - 10;
        let width = 8;

        console.log('width', width)
        console.log('height', height)

        let style = 'left:' + width + 'px;bottom:' + height + 'px;';
        style += 'visibility:hidden;';
        let indicatorTrue = $('<div style="' + style + '" class="snapIndicator true ' + this._id + '"></div>');
        style = 'right:' + width + 'px;bottom:' + height + 'px;';
        style += 'visibility:hidden;';
        let indicatorFalse = $('<div style="' + style + '" class="snapIndicator false ' + this._id + '"></div>');
        this.$.append(indicatorTrue);
        this.$.append(indicatorFalse);
    }

    serialize() {
        let data = super.serialize();
        data['branches'] = {};
        for (let key in this._branches) {
            if (this._branches.hasOwnProperty(key)) {
                if (this._branches[key] instanceof _ChartFlows.classes.blockEntity) {
                    data['branches'][key] = this._branches[key].id;
                }
            }
        }
        return data;
    }
};