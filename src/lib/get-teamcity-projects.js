const DELAY = 0;
const data = require('./teamcity-projects.json');

function parseData() {
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

			result.push(Object.assign({}, node, { id, parentId }));
		}
	}

	return result;
}

module.exports = function getTeamcityProjects(callback) {
	setTimeout(() => {
		callback(parseData());

		// callback([
		// 	{ id: '1', name: '1' },
		// 	{ id: '1.1', name: '1.1', parentId: '1' },
		// 	{ id: '2', name: '2' },
		// 	{ id: '2.1', name: '2.1', parentId: '2' },
		// ])
	}, DELAY);
};
