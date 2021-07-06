import constants from './Constants.js';

export default class MenuPanel {
	constructor(settings) {
		const defaultSettings = {
			menuItems: [],
		};

		Object.assign(defaultSettings, settings);

		this._menuItemElement_subMenu_mapp = new WeakMap();
		this._menuItems = settings.menuItems;
		this._menuElement = null;

		//todo : move out from this
		this.targetElement_oncontextmenu = (e) => {
			e.preventDefault();
			this.render(e.clientX, e.clientY, e.target);
		};
		//todo : move out from this
		this.targetElement_onclick = (e) => {
			this.hide();
		};
	}

	render(x, y, container) {
		this.hide();
		if (this._menuElement === null) {
			this._menuElement = this._createMenuElement({
				menuItems: this._menuItems,
			});
		}
		this._menuElement.style.left = `${x}px`;
		this._menuElement.style.top = `${y}px`;
		container.appendChild(this._menuElement);
	}

	hide() {
		if (this._menuElement === null) {
			return;
		}

		this._menuElement.querySelectorAll('.wes-context-menu-item__has-submenu').forEach((e) => {
			const subMenu = this._menuItemElement_subMenu_mapp.get(e);
			subMenu.hide();
		});
		
		this._menuElement.remove();
		this._menuElement = null;
	}

	_createMenuElement(menuPanel) {
		const pannelOptions = {
			menuItems: [],
		};

		Object.assign(pannelOptions, menuPanel);

		const menuElement = document.createElement('div');
		menuElement.classList.add('wes-context-menu-panel');

		for (const menuItem of pannelOptions.menuItems) {
			if (menuItem) {
				menuElement.appendChild(this._createMenuItemElement(menuItem));
			}
		}

		menuElement.addEventListener('mouseenter', (e) => {
			// todo: hide all sub menu and show correct sub menu
		});
		menuElement.addEventListener('click', (e) => {
			// todo: menu item click event
		});

		return menuElement;
	}

	_createMenuItemElement(menuItem) {
		if (!menuItem) {
			return null;
		}

		if (menuItem === constants.separator) {
			itemElement.classList = 'wes-context-menu-separator';
			return itemElement;
		}

		const menuItemOptions = {
			text: '',
			// textColor: undefined,
			subText: null,
			subMenu: null,
			disabled: false,
			onclick: null,
		};
		Object.assign(menuItemOptions, menuItem);

		const itemElement = document.createElement('div');
		itemElement.classList.add('wes-context-menu-item');

		const textElement = document.createElement('span');
		textElement.classList = 'wes-context-menu-text';
		textElement.innerText = menuItem.text;
		itemElement.appendChild(textElement);

		// if (menuItem.textColor && /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(menuItem.textColor)) {
		// 	textElement.style.cssText = 'color:'+menuItem.textColor;
		// }

		if (menuItem.subText) {
			const subTextElement = document.createElement('span');
			subTextElement.classList = 'wes-context-menu-subtext';
			subTextElement.innerText = menuItem.subText;
			itemElement.appendChild(subTextElement);
		}

		if (menuItem.disabled) {
			itemElement.classList.add('wes-context-menu-item__disabled');
			return itemElement;
		}

		if (!menuItem.hasOwnProperty('subMenu')) {
			// todo: delegate event handler to panel
			if (menuItem.onclick && typeof menuItem.onclick === 'function') {
				itemElement.addEventListener('click', (e) => {
					const context = {
						data: data,
					};

					data.onclick(context);
					e.stopPropagation();
				});
			}

			return itemElement;
		}

		// has submenu
		textElement.innerText += ' ❯';

		itemElement.classList.add('wes-context-menu-item__has-submenu');

		this._menuItemElement_subMenu_mapp.set(itemElement, new MenuPanel(menuItem.subMenu));

		// todo: delegate event handler to panel
		itemElement.addEventListener('mouseenter', (e) => {
			const subMenu = this._menuItemElement_subMenu_mapp.get(itemElement);

			const x = this._menuElement.offsetLeft + this._menuElement.offsetWidth;
			const y = this._menuElement.offsetTop + itemElement.offsetTop;

			subMenu.render(x, y, itemElement);
		});
		return itemElement;
	}
}
