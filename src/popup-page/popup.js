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
