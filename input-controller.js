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
            this._plugin = new Map();
            const keyboard = new KeyboardPlugin();
            this._plugin.set(keyboard.name, keyboard);
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
                plugin.pressKey.clear();
            }
        }
        _onFocus(){
            for (const plugin of this._plugin.values()){
                plugin.pressKey.clear();
            }
            this.focused = true;
        }
        bindActions(actionsToBind){
            for (const [actionName, config] of Object.entries(actionsToBind)){
                
                if (!this._action[actionName]){
                    this._action[actionName] = {
                        keys: new Set(),
                        enabled: config.enabled !== false
                    };
                }
                for (const key of config.keys){
                    this._action[actionName].keys.add(key);
                }               

            }
        }
        enableAction(actionName){
            if (this._action[actionName]){
                this._action[actionName].enabled =true;
            }
        }
        disableAction(actionName){
            if (this._action[actionName]){
                this._action[actionName].enabled = false;
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
            for (const key of action.keys){
                if(this.isKeyPressed(key)){
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
                plugin.onChange = () => this._updateActions();
                this.target.addEventListener("keydown", plugin._keyDown);
                this.target.addEventListener("keyup", plugin._keyUp);
                plugin.pressKey.clear();
            }
            if (!dontEnable){
                this.enabled = true;
            }
        }
        detach() {
            if (this.target){
                for (const plugin of this._plugin.values()){
                    this.target.removeEventListener("keydown", plugin._keyDown);
                    this.target.removeEventListener("keyup", plugin._keyUp);
                    plugin.pressKey.clear();
                    plugin.onChange = null;
                }
        }
        this.target = null;
        this.enabled = false;
        }
    }
return InputController;
})();