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
                target.addEventListener("keydown", this._keyDown);
                target.addEventListener("keyup", this._keyUp);
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
                console.log(actionName)
            }
        }
        

    }
return InputController;
}
)();