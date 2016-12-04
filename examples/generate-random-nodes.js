const PARENT_CHANCE = 0.8;
const CHILD_CHANCE = 0.8;

const FIRST_NAMES = [
	'Lorretta',
	'Kori',
	'Jannie',
	'Katherin',
	'Theresia',
	'Neoma',
	'Fanny',
	'Sally',
	'Nestor',
	'Cari',
	'Myron',
	'Isiah',
	'Mellisa',
	'Jonnie',
	'Delores',
	'Fritz',
	'Maricruz',
	'Heike',
	'Mabelle',
	'Haydee',
	'Ryann',
	'Iraida',
	'Dani',
	'Florrie',
	'Tegan',
	'Roselle',
	'Eddy',
	'Jacinta',
	'Caitlyn',
	'Donya',
];

const LAST_NAMES = [
	'Twanda',
	'Synthia',
	'Octavia',
	'Cinthia',
	'Willene',
	'Martine',
	'Cassidy',
	'Palmira',
	'Cody',
	'Kyle',
	'Lilliam',
	'Renee',
	'Candy',
	'Will',
	'Marcelo',
	'Lenora',
	'Celsa',
	'Glen',
	'Johnnie',
	'Nannette',
];

function randomBoolean(chance) {
	return Math.random() <= chance;
}

function randomItem(array) {
	const index = Math.floor(Math.random() * array.length);

	return array[index];
}

function randomTitle() {
	return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
}

module.exports = function generateRandomNodes(count) {
	let step = count;
	const parentIds = [];
	const result = [];

	function makeChild(node) {
		const isChild = randomBoolean(CHILD_CHANCE);

		if (isChild) {
			node.parentId = randomItem(parentIds) || null;
		}
	}

	function makeParent(node) {
		const isParent = randomBoolean(PARENT_CHANCE);

		if (isParent) {
			parentIds.push(node.id);
		}
	}

	while (step) {
		const node = {
			id: `${step}`,
			name: randomTitle(),
		};

		makeChild(node);
		makeParent(node);

		result.push(node);
		step -= 1;
	}

	return result;
};
