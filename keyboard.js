const keyboardPlugin = (() => {
    class keyboar {
        constructor(){
            this.name = "keyboard";
            this.pressKeys = new Set();
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
            if(this.pressKeys.has(key)) return;
            this.pressKeys.add(key);
            if(this.onChange){
                this.onChange();
            }
        }
         _keyUp(event) {
            const key = event.keyCode;

            if (!this.pressKeys.has(key)) return;

            this.pressKeys.delete(key);
            if(this.onChange){
                this.onChange();
            }




        }
         isActionActive(config){
            const keys = config?.keys??[];
            return keys.some(key => this.pressKeys.has(key))
        }
        isKeyPressed(keyCode){
            return this.pressKeys.has(keyCode);
        }
        reset(){
            trhis.pressKeys.clear();
        }
    }
    return keyboardPlugin;
})