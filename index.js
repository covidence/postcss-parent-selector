var postcss = require('postcss');
var Tokenizer = require('css-selector-tokenizer');

module.exports = postcss.plugin('postcss-scope-at-selector', function (opts) {
    opts = opts || {};

    // Work with options here
    return function (root /* , result*/ ) {
        root.walkRules(rule => {
            if (rule.parent && rule.parent.type === 'atrule' &&
                rule.parent.name.indexOf('keyframes') !== -1) {
                return;
            }

            const klass = opts.class.trim().replace(/^\./, '');

            rule.selectors = rule.selectors.map(selector => {
                let needsClassAdded = true;

                const newNodes = [];

                const addClass = () => {
                    if (needsClassAdded) {
                        newNodes.push({
                            type: 'class',
                            name: klass
                        });
                        needsClassAdded = false;
                    }
                };

                // We'll only have 1 selector node because the
                // `rule.selectors.map` above has already split on `,` for us:
                const parsed = Tokenizer.parse(selector);
                parsed.nodes[0].nodes.forEach(node => {
                    switch (needsClassAdded && node.type) {
                    case false:
                    case 'element':
                    case 'id':
                        newNodes.push(node);
                        break;
                    case 'universal':
                        break;
                    default:
                        addClass();
                        newNodes.push(node);
                        break;
                    }
                });

                addClass(); // If we got to end of loop without adding it yet

                parsed.nodes[0].nodes = newNodes;

                const ancestorSelector = `.${klass} ${selector}`;
                const selfSelector = Tokenizer.stringify(parsed);

                return [
                    ancestorSelector,
                    selfSelector
                ].join(',\n');
            });
        });
    };
});
