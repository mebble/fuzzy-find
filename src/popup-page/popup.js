const $ = (selector) => document.querySelector(selector);

$('#textInput').addEventListener('input', function(event) {
	const message = {
		txt: this.value
	};
	sendMessage(message);
});


$('#nextBtn').addEventListener('click', function(event) {
	sendMessage({ jump: 'next' });
});

$('#prevBtn').addEventListener('click', function(event) {
	sendMessage({ jump: 'previous' });
});

function sendMessage(message) {
	const params = {
		active: true,
		currentWindow: true
	};
	chrome.tabs.query(params, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, message);
	});
}
