import MenuPanel from './MenuPanel.js';
import constants from './Constants.js';

// this class is used for control MenuPanul behavior, like when to show or when to hide.
const contextMenuManager = {
	element_menu_map: new WeakMap(),
    separator:constants.separator,

	register(targetElement, menu) {
		const menuPanel = new MenuPanel(menu);
		this.element_menu_map.set(targetElement, menuPanel);
	},

	unregister(targetElement) {
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


window.addEventListener('contextmenu', contextMenuManager._oncontextmenu.bind(contextMenuManager));
window.addEventListener('click', contextMenuManager._onclick.bind(contextMenuManager));

export default contextMenuManager;