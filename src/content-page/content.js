import Mark from 'mark.js';
import scrollToElement from 'scroll-to-element';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

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

function cyclicIterator(array) {
    var index = 0;
    var copy = array.slice(0);

    return {
        getCurrent: function () {
            return copy[index];
        },

        getNext: function () {
            index = ++index % copy.length;
            return this.getCurrent();
        },

        getPrevious: function () {
            if(--index < 0) {
              index += copy.length;
            }
            return this.getCurrent();
        }
    };
};
