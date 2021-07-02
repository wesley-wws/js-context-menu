import MenuPanel from './menuPanel.js'

export default {
    element_menu_map: new WeakMap(),

    register(targetElement, menu) {
		const menuPanel = new MenuPanel(menu);
		this.element_menu_map.set(targetElement, menuPanel);

		window.addEventListener('contextmenu', this.targetElement_oncontextmenu.bind(this));
		window.addEventListener('click', this.targetElement_onclick.bind(this));
	},
     unregister(targetElement) {
		window.removeEventListener('contextmenu', this.targetElement_oncontextmenu.bind(this));
		window.removeEventListener('click', this.targetElement_onclick.bind(this));
		this.element_menu_map.delete(targetElement);
	},
    targetElement_oncontextmenu(e){
		const menuPanel = this.element_menu_map.get(e.target);
        if(menuPanel){
            menuPanel.targetElement_oncontextmenu(e);
        }
    },
    targetElement_onclick(e){
		const menuPanel = this.element_menu_map.get(e.target);
        if(menuPanel){
            menuPanel.targetElement_onclick(e);
        }
    }
}