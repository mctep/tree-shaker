module.exports = () => {
	return `
		<!doctype html>
		<title>Tree Shaker</title>
		<meta charset="utf8" />
		<form class="example-form">
			<h1>Tree Shaker Demo</h1>
			<button type="button" class="ts-button example-button-teamcity">
				Get mocked Teamcity Projects
			</button>
			or set random
			<input
					type="input"
					class="ts-input example-input-count"
					placeholder="count"
					value="10K"
			/>
			<span class="example-annotation">
				(only "K" shorthand supported)
			</span>
			nodes&nbsp;and&nbsp;<!--
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
		</form>
	`;
};
