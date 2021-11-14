window.AlpineClone = {
	directives: {
		'x-text': (el, value) => {
			el.innerText = value;
		},
		'x-show': (el, value) => {
			el.style.display = value ? 'block' : 'none';
		},
	},

	/**
	 * Initialize the app.
	 */
	start() {
		this.root = document.querySelector('[x-data]');
		this.rawData = this.getInitialData();
		this.data = this.observe(this.rawData);
		this.registerListeners();
		this.updateDom();
	},

	/**
	 * Find our x-data attribute and return the data.
	 *
	 * @returns {object}
	 */
	 getInitialData() {
		let dataString = this.root.getAttribute('x-data');
		return eval(`(${dataString})`);
	},

	/**
	 * Recursively walk the dom starting from the element el.
	 *
	 * @param {HTMLElement} el 
	 * @param {function}    callback 
	 */
	walkDom(el, callback) {
		callback(el);

		el = el.firstElementChild;
	
		while (el) {
			this.walkDom(el, callback);
			el = el.nextElementSibling;
		}
	},

	/**
	 * The reactivity.
	 *
	 * @param {Object} data 
	 */
	observe(data) {
		const self = this;
		return new Proxy(data, {
			set(target, key, value) {
				target[key] = value;
				self.updateDom();
			}
		});
	},

	/**
	 * Update the dom.
	 */
	updateDom() {
		this.walkDom(this.root, el => {
			Array.from(el.attributes).forEach(attr => {
				if (!Object.keys(this.directives).includes(attr.name)) return;
	
				this.directives[attr.name](el, eval(`with (this.data) { (${attr.value}) }`));
			});
		});
	},

	/**
	 * Event Listeners for the dom.
	 */
	registerListeners() {
		this.walkDom(this.root, el => {
			Array.from(el.attributes).forEach(attr => {
				if (!attr.name.startsWith('@')) return;
	
				let event = attr.name.replace('@', '');
	
				el.addEventListener(event, () => {
					eval(`with (this.data) { (${attr.value}) }`);
				});
			});
		});
	}
};

window.AlpineClone.start();