const InputController = (() => {
    class KeyboardPlugin{
        constructor(){
            this.name = "keyboard";
            this.pressKey = new Set()
            this.onChange = null;
            this._keyDown = this._keyDown.bind(this);
            this._keyUp = this._keyUp.bind(this);
        }
        _keyDown(event){
            const key = event.keyCode;
            if(this.pressKey.has(key)) return;
            this.pressKey.add(key);
            if (this.onChange){
                this.onChange();
            }
        }
        _keyUp(event) {
            const key = event.keyCode;
            if (!this.pressKey.has(key)) return;
            this.pressKey.delete(key);
            if (this.onChange){
                this.onChange();
            }

        }
        reset(){
            this.pressKey.clear();
        }
        isActionActive(config){
            if (!config.keys) return false;
            for (const key of config.keys){
                if (this.pressKey.has(key)){
                    return true;
                }
            }
            return false;
        }
        attach(target, onChange){
            this.onChange = onChange;
            target.addEventListener("keydown", this._keyDown)
            target.addEventListener("keyup", this._keyUp)
        }
        detach(target){
            target.removeEventListener("keydown", this._keyDown)
            target.removeEventListener("keyup", this._keyUp)
            this.reset();
            this.onChange = null;
        }
    }
    class MousePlugin{
        constructor(){
            this.name = "mouse";
            this.pressedButton = new Set();
            this.onChange = null;
            this._mouseDown = this._mouseDown.bind(this);
            this._mouseUp = this._mouseUp.bind(this);
        }
        _mouseDown(event){
            const button = event.button;
            if (this.pressedButton.has(button)) return;
            this.pressedButton.add(button);
            if (this.onChange){
                this.onChange();
            }
        }
        _mouseUp(event){
            const button = event.button;
            if(!this.pressedButton.has(button)) return;
            this.pressedButton.delete(button);
            if(this.onChange){
                this.onChange();
            }
        }
        reset(){
            this.pressedButton.clear();
        }
        isActionActive(config){
            if(!config.mouseButtons) return false;
            for (const button of config.mouseButtons){
                if (this.pressedButton.has(button)){
                    return true;
                }
            }
            return false;
        }
        attach(target,onChange){
            this.onChange = onChange;
            target.addEventListener("mousedown", this._mouseDown);
            target.addEventListener("mouseup", this._mouseUp);
        }
        detach(target){
            target.removeEventListener("mousedown", this._mouseDown);
            target.removeEventListener("mouseup", this._mouseUp);
            this.reset();
            this.onChange = null;
        }
    }
    class InputController {
        static ACTION_ACTIVATED = "input-controller:action-activated";
        static ACTION_DEACTIVATED = "input-controller:action-deactivated";
        ACTION_ACTIVATED = InputController.ACTION_ACTIVATED;
        ACTION_DEACTIVATED = InputController.ACTION_DEACTIVATED;
        constructor(actionsToBind = {}, target = null){
            this.enabled = true;
            this.focused = true;
            this.target =null;
            this._action = {};
            this._actionActivasion = new Set();
            this._plugin = new Map();
            const keyboard = new KeyboardPlugin();
            this._plugin.set(keyboard.name, keyboard);
            const mouse = new MousePlugin();
            this._plugin.set(mouse.name, mouse);
            this._onBlur = this._onBlur.bind(this);
            this._onFocus = this._onFocus.bind(this);
            window.addEventListener("blur", this._onBlur);
            window.addEventListener("focus", this._onFocus)   
            if (target){
                this.attach(target);
            }    
            this.bindActions(actionsToBind);          
        }
      
        _onBlur(){
            this.focused = false;
            for (const plugin of this._plugin.values()){
                plugin.reset();
            }
            this._updateActions();
        }
        _onFocus(){
            for (const plugin of this._plugin.values()){
                plugin.reset();
            }
            this.focused = true;
        }
        _updateActions(){
            for (const actionName of Object.keys(this._action)){
                const isActive = this.isActionActive(actionName);
                const wasActive = this._actionActivasion.has(actionName);
                if (isActive === wasActive) continue;
                if (isActive){
                    this._actionActivasion.add(actionName)
                }
                else {
                    this._actionActivasion.delete(actionName)
                }
                if (this.target){
                    const eventName = isActive
                    ? this.ACTION_ACTIVATED
                    : this.ACTION_DEACTIVATED;
                    this.target.dispatchEvent(new CustomEvent(eventName, {
                        detail: {action: actionName}
                    }));
                }
            }
        }
        bindActions(actionsToBind){
            for (const [actionName, config] of Object.entries(actionsToBind)){
                
                if (!this._action[actionName]){
                    this._action[actionName] = {
                        keys: new Set(),
                        mouseButtons: new Set(),
                        enabled: config.enabled !== false
                    };
                }
                for (const key of config.keys || []){
                    this._action[actionName].keys.add(key);
                }
                for (const button of config.mouseButtons || []){
                    this._action[actionName].mouseButtons.add(button);
                }
                             

            }
            this._updateActions();  
        }
        enableAction(actionName){
            if (this._action[actionName]){
                this._action[actionName].enabled =true;
                this._updateActions();
            }
        }
        disableAction(actionName){
            if (this._action[actionName]){
                this._action[actionName].enabled = false;
                this._updateActions();
            }
        }
        isKeyPressed(keyCode){
            const keyboard = this._plugin.get("keyboard");
            return this.enabled && this.focused && keyboard.pressKey.has(keyCode)
        }
        isActionActive(actionName){
            const action = this._action[actionName];
            if (!this.enabled || !this.focused || !action || !action.enabled){
                return false;
            }
            for (const plugin of this._plugin.values()){
                if(plugin.isActionActive(action)){
                    return true;
                }
            }
            
            return false;
        }
        attach(target, dontEnable = false){
            if (!target)return;
            if (this.target){
                this.detach();
            }
            this.target = target;
            for (const plugin of this._plugin.values()){
                plugin.attach(this.target, () => this._updateActions());
                plugin.reset();
            }
            if (!dontEnable){
                this.enabled = true;
            }
        }
        detach() {
            if (this.target){
                for (const plugin of this._plugin.values()){
                    plugin.reset();
                }
                this.enabled = false;
                this._updateActions();
                for (const plugin of this._plugin.values()){
                    plugin.detach(this.target);
                }
        }
        this._actionActivasion.clear(;)
        this.target = null;
        this.enabled = false;
        }
    }
return InputController;
})();