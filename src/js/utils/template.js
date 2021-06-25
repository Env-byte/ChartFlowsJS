const _TemplateHandler = function () {

    let expression = new RegExp(/(<\?%[\s]*)([A-z0-9.]+)([\s]*%\?>)/g)

    /**
     *
     * @param template
     * @returns {Object}
     */
    function getTags(template) {

        let tags = {};
        let results;

        do {
            results = expression.exec(template)
            // second group in reg ex is the tag
            if (results && results.hasOwnProperty(2)) {
                tags[results[0]] = (results[2]);
            }
        } while (results)

        return tags;
    }

    function createMap(tags, object) {
        let map = {};
        let obj, smallTag, parts, value;
        for (let fullTag in tags) {
            if (tags.hasOwnProperty(fullTag)) {
                smallTag = tags[fullTag];

                parts = smallTag.split('.');
                value = '';
                obj = object;

                for (let x = 0, xL = parts.length; x < xL; x++) {
                    if (obj.hasOwnProperty(parts[x])) {
                        obj = obj[parts[x]];
                    }
                }

                if (typeof obj !== "object") {
                    value = obj;
                }

                map[fullTag] = value;
            }
        }
        return map;
    }

    function replaceTags(map, template) {
        let html = template;
        for (let tag in map) {
            if (map.hasOwnProperty(tag)) {
                html = html.replace(tag, map[tag]);
            }
        }
        return html;
    }

    return {
        parse: (object) => {
            let html = '';
            if (ChartFlows.config.debug === 1) {
                console.log('Parse', object)
            }

            if (object.hasOwnProperty('template')) {
                let tags = getTags(object.template);
                if (ChartFlows.config.debug === 1) {
                    console.log('Tags', tags)
                }
                if (Object.keys(tags).length > 0) {
                    html = replaceTags(createMap(tags, object), object.template);
                    if (ChartFlows.config.debug === 1) {
                        console.log('Generated HTML', html)
                    }
                } else {
                    if (ChartFlows.config.debug === 1) {
                        console.log('No tags found')
                    }
                }
            } else {
                console.error('Object does not have property `template`')
            }

            return html;
        }
    }
}