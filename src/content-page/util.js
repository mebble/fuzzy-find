const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

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

export { $, $$, cyclicIterator };
