const keyboardPlugin = (() => {
    class keyboar {
        constructor(){
            this.name = "keyboard";
            this.prssedKeys = new Set();
            this.target = null;
            this.onChange = null;
            this._keyDown = this._keyDown.bind(this);
            this._keyUp = this._keyUp.bind(this);
        }
        attach(target, onChange){
            this.detach();
            this.target = target;
            this.onChange = onChange;
            this.target.addEventListener("keydown", this._keyDown);
            this.target.addEventListener("keyup", this._keyUp)
        }
         detach() {
            if (this.target){
                this.target.removeEventListener("keydown", this._keyDown);
                this.target.removeEventListener("keyup", this._keyUp);
            }
            this.target = null;
            this.onChange = null;
            this.reset();
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
        
    }
})