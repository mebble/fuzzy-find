const fuseOptions = {
	keys: ['title', 'url', 'path'],
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
	const bookmarksBar = results[0]
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
	/**
	 * @param {Array.<BookmarkTreeNode>} results - The BookmarkTreeNodes to render in the UI
	 * @param {string} location - The CSS selector of the UI container in which to render
	 * @requires module:jquery
	 */
	$(location).empty();
	const resultNodes = results.map(res => {
		const resElem = `
			<div class="list-group search-item">
				<a href="${res.url}" target="_blank" class="list-group-item list-group-item-action flex-column align-items-start">
					<div class="d-flex w-100 justify-content-between">
						<h6 class="font-weight-bold title">${res.title}</h6>
						<small>${res.id}</small>
					</div>
					<small class="text-muted path">${res.path}</small>
				</a>
			</div>
		`;
		return $(resElem);
	});
	$(location).append(resultNodes);
}

function flattenArray(arr) {
	/**
	 * Return a flattened array without any children
	 * @param {Array.<BookmarkTreeNode>} arr - BookmarkTreeNodes with children
	 * @param {Array.<BookmarkTreeNode>} arr.children - BookmarkTreeNodes with children
	 * @returns {Array.<BookmarkTreeNode>}
	 */
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

function initNodePaths(parent, parentPath) {
	/**
	 * Recursively create a path attribute for every child node in the tree whose root is @parent
	 * @param {BookmarkTreeNode} parent - The node whose path will be given to its children
	 * @param {string} parentPath - The path to give to
	 */
	parent.children.forEach(child => {
		child.path = parentPath;
		if (child.hasOwnProperty('children')) {
			child.path += `/${child.title}`
			initNodePaths(child, child.path);
		}
	});
}
