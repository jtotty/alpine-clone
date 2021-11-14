let root = document.querySelector('[x-data]');
let rawData = getInitialData();
let data = observe(rawData);
refreshDom();

/**
 * Find our x-data attribute and return the data.
 *
 * @returns {object}
 */
 function getInitialData() {
	let dataString = root.getAttribute('x-data');
	return eval(`(${dataString})`);
}


/**
 * Walk the dom starting from the element el.
 *
 * @param {HTMLElement} el 
 * @param {function}    callback 
 */
function walkDom(el, callback) {
	callback(el);
	el = el.firstElementChild;

	while (el) {
		walkDom(el, callback);
		el = el.nextElementSibling;
	}
}

/**
 * 
 * @param {Object} data 
 */
function observe(data) {
	return new Proxy(data, {
		set(target, key, value) {
			target[key] = value;
			refreshDom();
		}
	});
}

/**
 * Update the dom.
 */
 function refreshDom() {
	walkDom(root, el => {
		if (el.hasAttribute('x-text')) {
			let expression = el.getAttribute('x-text');
			el.innerText = eval(`with (data) { (${expression}) }`);
		}
	});
}
