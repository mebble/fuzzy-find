const marker = new Mark(document.body);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	const txt = request.txt;
	marker.unmark();
	marker.mark(txt);
});
