$('#search-input').on('input', function(event) {
	const query = $(this).val();
	chrome.bookmarks.search(query, results => {
		$('.results-box').empty();
		const resultNodes = results.map(res => {
			const resElem = `
				<div>
					<h3>${res.title}</h3>
					<p>${res.url}</p
				</div>
			`;
			return $(resElem);
		});
		$('.results-box').append(resultNodes);
	});
});

// function sendMessage(message) {
// 	const params = {
// 		active: true,
// 		currentWindow: true
// 	};
// 	chrome.tabs.query(params, (tabs) => {
// 		chrome.tabs.sendMessage(tabs[0].id, message);
// 	});
// }
