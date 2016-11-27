const $ = require('jquery');
const generateRandomNodes = require('lib/generate-random-nodes');
const TreeShaker = require('tree-shaker');

// eslint-disable-next-line import/no-unassigned-import
require('./style.css');

const nodes = generateRandomNodes();
const $example = $('#example');
const treeShaker = new TreeShaker({ nodes });

$example.append(treeShaker.$element);
