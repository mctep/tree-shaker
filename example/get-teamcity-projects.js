const _ = require('lodash');
const $ = require('jquery');
const DATA_URI = require('./teamcity-projects.json');

function parseData(data) {
	const result = [];
	const length = data.project.length;

	for (let idx = 0; idx < length; idx += 1) {
		const node = data.project[idx];
		const { id, parentProject } = node;

		if (id !== '_Root') {
			const parentId = (parentProject &&
				parentProject.id !== '_Root' &&
				parentProject.id
			) || null;

			result.push(_.assign({}, node, { id, parentId }));
		}
	}

	return result;
}

module.exports = function getTeamcityProjects(callback) {
	$.ajax(DATA_URI).done((data) => {
		callback(parseData(data));
	});
};
