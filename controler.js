const InputController = () => {
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
        }
        _keyDown(){}
        _keyUp(){}
    }
}