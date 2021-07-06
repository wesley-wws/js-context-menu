import constants from './Constants.js';

export default class MenuPanel {
	constructor(settings) {
		const defaultSettings = {
			menuItems: [],
		};

		Object.assign(defaultSettings, settings);

		this._menuItemElement_menuItem_mapp = new WeakMap();
		this._menuItemElement_subMenuPanel_mapp = new WeakMap();
		this._menuItems = settings.menuItems;

		this._menuItemClick = (e) => {
			let itemElement = e.currentTarget;
			const menuItem = this._menuItemElement_menuItem_mapp.get(itemElement);
			if (menuItem) {
				if (menuItem.disabled) {
					e.stopPropagation();
					return;
				}

				if (menuItem.onClick && typeof menuItem.onClick === 'function') {
					const context = {
						data: menuItem,
						key: menuItem.key,
						value: menuItem.value,
					};

					const isPropagation = menuItem.onClick(context);
					if (!isPropagation) {
						e.stopPropagation();
					}
				}
			}
		};

		this._menuItemMouseEnter = (e) => {
			// hide all sub menu and show correct sub menu
			this._hideSubMenus();
			let itemElement = e.target;
			const subMenu = this._menuItemElement_subMenuPanel_mapp.get(itemElement);
			if (subMenu) {
				const x = this.menuElement.offsetLeft + this.menuElement.offsetWidth;
				const y = this.menuElement.offsetTop + itemElement.offsetTop;

				subMenu.render(x, y, itemElement);
			}
		};
	}

	get menuElement() {
		if (!this._menuElement) {
			this._menuElement = this._createMenuElement({
				menuItems: this._menuItems,
			});
		}
		return this._menuElement;
	}

	render(x, y, container) {
		this.hide();

		this.menuElement.style.left = `${x}px`;
		this.menuElement.style.top = `${y}px`;
		container.appendChild(this.menuElement);
	}

	hide() {
		this._hideSubMenus();

		this.menuElement.remove();
		this._menuElement = null;
	}

	_hideSubMenus() {
		this._queryMenuItemElements().forEach((element) => {
			const subMenu = this._menuItemElement_subMenuPanel_mapp.get(element);
			if (subMenu) {
				subMenu.hide();
			}
		});
	}

	_queryMenuItemElements() {
		return this.menuElement.querySelectorAll(`.${constants.menuItemClass}`);
	}

	_createMenuElement(menuPanel) {
		const pannelOptions = {
			menuItems: [],
		};

		Object.assign(pannelOptions, menuPanel);

		const menuElement = document.createElement('div');
		menuElement.classList.add(constants.menuPanelClass);

		for (const menuItem of pannelOptions.menuItems) {
			if (menuItem) {
				let menuItemElement = this._createMenuItemElement(menuItem);
				menuElement.appendChild(menuItemElement);
				this._menuItemElement_menuItem_mapp.set(menuItemElement, menuItem);
			}
		}
		return menuElement;
	}

	_createMenuItemElement(menuItem) {
		if (!menuItem) {
			return null;
		}

		const itemElement = document.createElement('div');

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

		itemElement.addEventListener('mouseenter', this._menuItemMouseEnter);

		itemElement.classList.add(constants.menuItemClass);

		const textElement = document.createElement('span');
		textElement.classList = 'wes-context-menu-text';
		textElement.innerText = menuItem.text;
		itemElement.appendChild(textElement);

		// if (menuItem.textColor && /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(menuItem.textColor)) {
		// 	textElement.style.cssText = 'color:'+menuItem.textColor;
		// }

		const subTextElement = document.createElement('span');
		subTextElement.classList = 'wes-context-menu-subtext';
		subTextElement.innerText = menuItem.subText ? menuItem.subText : '';
		itemElement.appendChild(subTextElement);

		if (menuItem.disabled) {
			itemElement.classList.add('wes-context-menu-item__disabled');
			return itemElement;
		}

		if (menuItem.hasOwnProperty('subMenu')) {
			subTextElement.innerText += ' ❯';
			itemElement.classList.add('wes-context-menu-item__has-submenu');

			const subMenu = new MenuPanel(menuItem.subMenu);

			this._menuItemElement_subMenuPanel_mapp.set(itemElement, subMenu);
			return itemElement;
		}

		itemElement.addEventListener('click', this._menuItemClick);

		return itemElement;
	}
}
