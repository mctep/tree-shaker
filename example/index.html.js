module.exports = ({ htmlWebpackPlugin }) => {
	const { options } = htmlWebpackPlugin;

	let styles = '';

	if (options.environment === 'production') {
		styles += '<link href="./tree-shaker-theme.min.css" rel="stylesheet">';
	}

	let result = `
		<!doctype html>
		<head>
			<title>Tree Shaker</title>
			<meta charset="utf-8" />
			${styles}
		</head>
		<div class="example-form">
			<h1>Tree Shaker Demo</h1>
			<button type="button" class="ts-button example-button-teamcity">
				Get mocked Teamcity Projects
			</button>
			or set random
			<input
					type="text"
					class="ts-input example-input-count"
					placeholder="count"
					value="10K"
			/>
			nodes
			<span class="example-annotation">
				(only "K" shorthand supported)
			</span>
			and&nbsp;<!--
			--><button type="button" class="ts-button example-button-have-fun">
				Have fun
			</button>
			<br />
			<h2 class="example-column">
				Available nodes:
			</h2><!--
			--><h2 class="example-column">
				Chosen nodes:
			</h2>
			<div id="tree-shaker" class="example-container"></div>
		</div>
	`;

	if (options.environment === 'production') {
		result += `
			<script
				src="https://code.jquery.com/jquery-3.1.1.min.js"
				integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
				crossorigin="anonymous"
			></script>
			<script
				src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.2/lodash.min.js"
				integrity="sha256-Cv5v4i4SuYvwRYzIONifZjoc99CkwfncROMSWat1cVA="
				crossorigin="anonymous"
			></script>
			<script src="./tree-shaker.min.js"></script>
			<script src="./tree-shaker-theme.min.js"></script>
		`;
	}

	return result;
};
