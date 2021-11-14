let root = document.querySelector('[x-data]');
let rawData = getInitialData();
let data = observe(rawData);
registerListeners();
updateDom();

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
 * The reactivity.
 *
 * @param {Object} data 
 */
function observe(data) {
	return new Proxy(data, {
		set(target, key, value) {
			target[key] = value;
			updateDom();
		}
	});
}

/**
 * Update the dom.
 */
 function updateDom() {
	walkDom(root, el => {
		if (el.hasAttribute('x-text')) {
			let expression = el.getAttribute('x-text');
			el.innerText = eval(`with (data) { (${expression}) }`);
		}
	});
}

function registerListeners() {
	walkDom(root, el => {
		if (el.hasAttribute('@click')) {
			let expression = el.getAttribute('@click');
			el.addEventListener('click', () => {
				eval(`with (data) { (${expression}) }`);
			});
		}
	});
}
