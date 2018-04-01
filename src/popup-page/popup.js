const fuseOptions = {
	keys: ['title', 'url'],
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	shouldSort: true
};
let bookmarksList = [];
let fuse;

// initialise Fuse instance
chrome.bookmarks.getTree(results => {
	let bookmarksBar = results[0]
		.children
		.find(child => child.title === 'Bookmarks bar');
	initNodePaths(bookmarksBar, 'bookmarks-bar');
	bookmarksList = flattenArray(bookmarksBar.children);
	fuse = new Fuse(bookmarksList, fuseOptions);
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

function flattenArray(arr) {
	let tempPtr = arr;
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

function initNodePaths(root, rootPath) {
	root.children.forEach(child => {
		child.path = `${rootPath}/${child.title}`;
		if (child.hasOwnProperty('children')) {
			initNodePaths(child, child.path);
		}
	});
}
