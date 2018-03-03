const $ = (selector) => document.querySelector(selector);

$('#textInput').addEventListener('input', function(event) {
	const message = {
		txt: this.value
	};
	const params = {
		active: true,
		currentWindow: true
	};
	chrome.tabs.query(params, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, message);
	});
});
