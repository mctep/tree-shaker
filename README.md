# Tree Shaker Component

## [Live Demo](https://mctep.github.io/tree-shaker/)

## Usage

```sh
npm install tree-shaker
```

Require main script and basic theme to your page:

```html
<!-- jquery and lodash is requied by tree-shaker -->
<script src="node_modules/jquery.js" />
<script src="node_modules/lodash.js" />

<link href="node_modules/tree-shaker/build/theme/tree-shaker-theme.min.css" rel="stylesheet" />
<script src="node_modules/tree-shaker/build/dist/tree-shaker.min.js" />
<script src="node_modules/tree-shaker/build/theme/tree-shaker-theme.min.js" />

<div id="tree-shaker" style="height: 600px"></div>

<script>
	var treeShaker = new TreeShaker(TreeShakerTheme);
	$('#tree-shaker').append(treeShaker.$element);
	// it is need to update shaker height after applying to DOM
	treeShaker.updateHeight();
	
	var nodes = [{
		id: 'node_1',
		title: 'Parent Node'
	}, {
		id: 'node_2',
		parentId: 'node_1',
		title: 'Child Node'
	}];
	
	treeShaker.setNodes(nodes);
</script>
```

## Extending

You can extend any element in `tree-shaker` by define your own theme or redefine `TreShakerTheme`.

```js
// redefine option template in available nodes list
TreeShakerTheme.templates.available = {
	getElement: function(option) {
		return $(
			'<div class="my-own-class"><img src="my-icon.png" />' +
				option.data.title +
			'</div>'
		);
	}
}
```

Also you can change any class for element used in `tree-shaker`:

```js
TreeShakerTheme.classNames.buttonsSort.container += ' my-button-sort-mix';
```

You can see all [classNames](https://github.com/mctep/tree-shaker/blob/master/src/tree-shaker-theme/styles/index.js) and [templates](https://github.com/mctep/tree-shaker/blob/master/src/tree-shaker-theme/index.js) in theme source code. 

## Development

```bash
git clone https://github.com/mctep/tree-shaker.git
cd tree-shaker
npm install
npm start
```
