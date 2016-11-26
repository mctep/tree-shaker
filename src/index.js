/* eslint-env browser */
import TreeShaker from 'tree-shaker';

const exampleNode = document.getElementById('example');

const treeShaker = new TreeShaker(exampleNode);

treeShaker.toString();
