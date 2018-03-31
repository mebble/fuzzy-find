const $ = sel => document.querySelector(sel);

$('#search-input').addEventListener('input', function(event) {
	chrome.bookmarks.getTree(treeNodes => {
		const bookmarks = treeNodes[0]
			.children
			.find(child => child.title === 'Bookmarks bar')
			.children;
		console.log(bookmarks);
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
