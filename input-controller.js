const InputController = (() => {
    class KeyboardPlugin{
        constructor(){
            this.name = "keyboard";
            this.pressKey = new Set()
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
            this.pressKey = new Set();
            this._keyDown = this._keyDown.bind(this);
            this._keyUp = this._keyUp.bind(this);
            this._onBlur = this._onBlur.bind(this);
            this._onFocus = this._onFocus.bind(this);
            window.addEventListener("blur", this._onBlur);
            window.addEventListener("focus", this._onFocus)   
            if (target){
                this.attach(target);
            }    
            this.bindActions(actionsToBind);          
        }
        _keyDown(event){
            const key = event.keyCode;
            if(this.pressKey.has(key)) return;
            if (!this.enabled || !this.focused || !this.target) return;
            for (const [actionName, action] of Object.entries(this._action)){
                if (!action.enabled || !action.keys.has(key)) continue;
                const wasActive = [...action.keys].some(
                    keyCode => this.pressKey.has(keyCode)
                );
                if (!wasActive){
                    this.target.dispatchEvent(
                        new CustomEvent(this.ACTION_ACTIVATED, {
                            detail: {action: actionName}
                        })
                    )
                }

                
            }
            this.pressKey.add(key);
        }
        _keyUp(event) {
            const key = event.keyCode;

            if (!this.pressKey.has(key)) return;

            this.pressKey.delete(key);

            if (!this.enabled || !this.focused || !this.target) return;

            for (const [actionName, action] of Object.entries(this._action)) {
                if (!action.enabled || !action.keys.has(key)) continue;

                const stillActive = [...action.keys].some(
                    keyCode => this.pressKey.has(keyCode)
                );

                if (!stillActive) {
                    this.target.dispatchEvent(
                        new CustomEvent(this.ACTION_DEACTIVATED, {
                            detail: { action: actionName }
                        })
                    );
                }
            }
        }
        _onBlur(){
            this.focused = false;
            this.pressKey.clear();
        }
        _onFocus(){
            this.pressKey.clear();
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
            return this.enabled && this.focused && this.pressKey.has(keyCode);
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
            this.target.addEventListener("keydown", this._keyDown);
            this.target.addEventListener("keyup", this._keyUp);
            this.pressKey.clear();
            if (!dontEnable){
                this.enabled = true;
            }
        }
        detach() {
            if (this.target){
                this.target.removeEventListener("keydown", this._keyDown);
                this.target.removeEventListener("keyup", this._keyUp);
            }
            this.target = null;
            this.pressKey.clear();
            this.enabled = false
        }
        
        

    }
return InputController;
}
)();