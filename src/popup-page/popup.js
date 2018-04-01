$('#search-input').on('input', function(event) {
	const query = $(this).val();
	chrome.bookmarks.search(query, results => {
		if (results.length > 0) {
			$('body').addClass('res-present');
		} else {
			$('body').removeClass('res-present');
		}
		displayResults(results, '.results-box');
	});
});

$('#btn-flatten').on('click', function(event) {
	chrome.bookmarks.getTree(function(results) {
		let bookmarks = results[0]
			.children
			.find(child => child.title === 'Bookmarks bar')
			.children;
		while (bookmarks.some(b => b.hasOwnProperty('children'))) {
			// flatten the bookmarks tree
			bookmarks = bookmarks.reduce((acc, curr) => {
				if (curr.hasOwnProperty('children')) {
					return acc.concat(curr.children);
				} else {
					return acc.concat([curr]);
				}
			}, []);
		}
		$('body').addClass('res-present');
		displayResults(bookmarks, '.results-box');
	});
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
