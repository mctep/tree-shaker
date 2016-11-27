/* eslint-env browser */
import TreeShaker from 'tree-shaker';
import generateRandomNodes from 'lib/generate-random-nodes';
import './style.css';

const exampleDOMElement = document.getElementById('example');
const nodes = generateRandomNodes();
const treeShaker = new TreeShaker(nodes);

exampleDOMElement.appendChild(treeShaker.element);
