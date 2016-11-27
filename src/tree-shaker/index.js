const TreeModel = require('./lib/tree-model');
const Button = require('./lib/button');
const AvailableListView = require('./lib/available-list-view');

class TreeShaker {
	constructor(nodes) {
		this.handleChooseButtonClick = this.handleChooseButtonClick.bind(this);

		this.model = new TreeModel(nodes);
		const element = this.element = document.createElement('div');
		const availableListView = this.createAvailableView();
		const chooseButton = this.chooseButton = this.createChooseButton();

		element.appendChild(availableListView.element);
		element.appendChild(chooseButton.element);

		this.updateChooseButton();
	}

	createAvailableView() {
		const { model } = this;
		const availableListView = new AvailableListView();

		availableListView.onSelect = (id) => {
			const node = model.getById(id);

			model.available.toggleSelect(node);
			if (model.available.isSelected(node)) {
				availableListView.select(node);
			} else {
				availableListView.deselect(node);
			}

			this.updateChooseButton();
		};

		availableListView.renderNodes(model.available.list);

		return availableListView;
	}

	createChooseButton() {
		const button = new Button();

		button.content('->');
		button.onClick = this.handleChooseButtonClick;

		return button;
	}

	handleChooseButtonClick() {
		const { model, availableListView } = this;
		const { selected } = model.available;

		model.moveSelectedAvailableToChosen();
		availableListView.deselectMany(selected);
		this.updateChooseButton();
	}

	updateChooseButton() {
		const { model, chooseButton } = this;
		const { selectedList } = model.available;

		if (selectedList.length) {
			chooseButton.enable();
		} else {
			chooseButton.disable();
		}
	}
}

module.exports = TreeShaker;

// export default class TreeShaker {
// 	constructor(nodes) {
// 		const store = new Observable({
// 			nodes: normalize(nodes),
// 			selectedIds: [],
// 		});
//
// 		this.allNodes = new Tree(store, (state) => {
// 			return {
// 				list: state.nodes.list,
// 			};
// 		});
//
// 		this.element = document.createElement('div');
//
// 		this.element.appendChild(this.allNodes.element);
// 	}
//
// 	// constructor(container, options) {
// 	// 	const { nodes } = options;
// 	//
// 	// 	this.nodes = new Observable(normalize(nodes.state));
// 	//
// 	// 	nodes.subscribe((state) => {
// 	// 		this.nodes.setState(normalize(state));
// 	// 	});
// 	//
// 	// 	this.selectedIds = new Observable([]);
// 	//
// 	// 	this.container = container;
// 	// 	this.container.className = 'tree-shaker';
// 	//
// 	// 	this.allNodesTree = new Tree({
// 	// 		nodeClassName: 'node',
// 	// 		nodes: this.nodes,
// 	// 		selectedIds: this.selectedIds,
// 	// 	});
// 	//
// 	// 	this.container.appendChild(this.allNodesTree.element);
// 	// 	this.allNodesTree.element.className = 'list-all';
// 	//
// 	// 	const buttons = document.createElement('div');
// 	// 	const button = document.createElement('button');
// 	//
// 	// 	buttons.className = 'buttons';
// 	// 	button.setAttribute('type', 'button');
// 	// 	button.innerHTML = '->';
// 	// 	buttons.appendChild(button);
// 	// 	this.container.appendChild(buttons);
// 	//
// 	// 	button.addEventListener('click', this.handleMoveClick.bind(this));
// 	// }
// 	//
// 	// handleMoveClick() {
// 	//
// 	// }
// }
//
// export { Observable };
