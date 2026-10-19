const InputController = (() => {
    class InputController {
        static ACTION_ACTIVATED = "input-controller:action-activated";
        static ACTION_DEACTIVATED = "input-controller:action-deactivated";
        ACTION_ACTIVATED = InputController.ACTION_ACTIVATED;
        ACTION_DEACTIVATED = InputController.ACTION_DEACTIVATED;
        constructor(actionsToBind = {}, target = null){
            this._enabled = true;
            this.focused = true;
            this.target =null;
            this._action = {};
            this.pressKey = new Set();
            this._keyDown = this._keyDown.bind(this)
            this._keyUp = this._keyUp.bind(this)   
            if (target){
                this.atttach(target);
            }
            this.target=target;    
            this.bindActions(actionsToBind);          
        }
        _keyDown(event){
            this.pressKey.add(event.keyCode)
        }
        _keyUp(event){
            this.pressKey.delete(event.keyCode)
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
                    this._action[actionName].add(key);
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
        atttach(target, dontEnable = false){
            if (!target)return;
            if (this.target){
                this.detach();
            }
            this.target.addEventListener("keydown", this._keyDown);
            this.target.addEventListener("keyUp", this._keyUp);
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