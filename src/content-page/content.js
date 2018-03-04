import Mark from 'mark.js';
import scrollToElement from 'scroll-to-element';
import { $, $$, cyclicIterator } from './util';

const marker = new Mark(document.body);

let nodesFound = [];
let nodesIter;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.newInput) {
		resetMarks(request.newInput);
		resetNodes();
	}
	if (request.jump) {
		jump(request.jump);
	}
});

function resetMarks(text) {
	marker.unmark();
	marker.mark(text);
}

function resetNodes() {
	nodesFound = Array.from($$('[data-markjs="true"]'));
	nodesIter = cyclicIterator(nodesFound);
}

function jump(jumpWhere) {
	let currNode = nodesIter.getCurrent();
	currNode.style.backgroundColor = '#ff0';  // color reset

	if (jumpWhere === 'next') {
		currNode = nodesIter.getNext();
	} else if (jumpWhere === 'previous') {
		currNode = nodesIter.getPrevious();
	}

	scrollToElement(currNode, {
		offset: 0,
		ease: 'linear',
		duration: 100
	});
	currNode.style.backgroundColor = '#ff9696';
}
