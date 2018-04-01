$('#search-input').on('input', function(event) {
	const query = $(this).val();
	chrome.bookmarks.search(query, results => {
		if (results.length > 0) {
			$('body').addClass('res-present');
		} else {
			$('body').removeClass('res-present');
		}

		$('.results-box').empty();
		const resultNodes = results.map(res => {
			const resElem = `
				<div>
					<h3><a href="${res.url}" target="_blank">${res.title}</a></h3>
				</div>
			`;
			return $(resElem);
		});
		$('.results-box').append(resultNodes);
	});
});

$('#btn-flatten').on('click', function(event) {
	chrome.bookmarks.getTree(function(results) {
		let bookmarks = results[0]
			.children
			.find(child => child.title === 'Bookmarks bar')
			.children;
		console.log(bookmarks);
		while (bookmarks.some(b => b.hasOwnProperty('children'))) {
			bookmarks = bookmarks.reduce((acc, curr) => {
				if (curr.hasOwnProperty('children')) {
					return acc.concat(curr.children);
				} else {
					return acc.concat([curr]);
				}
			}, []);
		}
		console.log(bookmarks);  // flattened tree
	});
});
