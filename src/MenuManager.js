import MenuPanel from './menuPanel.js';
import constants from './Constants.js';

// this class is used for control MenuPanul behavior, like when to show or when to hide.
export default {
	element_menu_map: new WeakMap(),
    separator:constants.separator,


	registerContextMenu(targetElement, menu) {
		const menuPanel = new MenuPanel(menu);
		this.element_menu_map.set(targetElement, menuPanel);

		window.addEventListener('contextmenu', this._oncontextmenu.bind(this));
		window.addEventListener('click', this._onclick.bind(this));
	},
	unregisterContextMenu(targetElement) {
		window.removeEventListener('contextmenu', this._oncontextmenu.bind(this));
		window.removeEventListener('click', this._onclick.bind(this));
		this.element_menu_map.delete(targetElement);
	},

	_oncontextmenu(e) {
        for (let element of e.path) {
            const menuPanel = this.element_menu_map.get(element);
            if (menuPanel) {
                e.preventDefault();
                menuPanel.render(e.clientX, e.clientY, e.target);
                break;
            }
        }
	},
	_onclick(e) {
		e.path.forEach(element => {
			const menuPanel = this.element_menu_map.get(element);
			if (menuPanel) {
				menuPanel.hide();
			}
		});
	},
};
