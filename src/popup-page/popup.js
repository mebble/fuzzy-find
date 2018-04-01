const fuseOptions = {
	keys: ['title', 'url'],
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	shouldSort: true
};
let flattenedBookmarks = [];
let fuse;

// initialise Fuse instance
chrome.bookmarks.getTree(results => {
	let bookmarks = results[0]
		.children
		.find(child => child.title === 'Bookmarks bar')
		.children;
	bookmarks.forEach(b => {
		b.path = `root/${b.title}`;
		if (b.hasOwnProperty('children')) {
			initNodePaths(b);
		}
	});
	flattenedBookmarks = flattenTree(bookmarks);
	fuse = new Fuse(flattenedBookmarks, fuseOptions);
});

$('#search-input').on('input', function(event) {
	const query = $(this).val();
	const results = fuse.search(query);

	if (results.length > 0) {
		$('body').addClass('res-present');
	} else {
		$('body').removeClass('res-present');
	}
	displayResults(results, '.results-box');
	console.log(results);
});

function displayResults(results, location) {
	$(location).empty();
	const resultNodes = results.map(res => {
		const resElem = `
			<div>
				<h3><a href="${res.url}" target="_blank">${res.title}</a></h3>
			</div>
		`;
		return $(resElem);
	});
	$(location).append(resultNodes);
}

function flattenTree(rootNode) {
	let tempPtr = rootNode;
	while (tempPtr.some(node => node.hasOwnProperty('children'))) {
		tempPtr = tempPtr.reduce((acc, curr) => {
			if (curr.hasOwnProperty('children')) {
				return acc.concat(curr.children);
			} else {
				return acc.concat([curr]);
			}
		}, []);
	}
	return tempPtr;
}

function initNodePaths(root) {
	root.children.forEach(child => {
		child.path = `${root.path}/${child.title}`;
		if (child.hasOwnProperty('children')) {
			initNodePaths(child);
		}
	});
}
