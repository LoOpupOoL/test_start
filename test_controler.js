const game = document.getElementById("game");
const player = document.getElementById("player");
const status = document.getElementById("status")
const controller = new InputController({
    left: {keys: [37, 65]},
    right: {keys: [39, 68]}
}, game);
let playerX = 280;
const speed = 4;
game.focus();
document.getElementById("attach").addEventListener("click", () => {
    controller.attach(game);
    game.focus();
    status.textContent = "Статус: котроллер подключён";
});
document.getElementById("detatch").addEventListener("click", () =>{
    controller.detach();
    status.textContent = "Статус: контроллер отключён";
});
document.getElementById("enable").addEventListener("click", () =>{
    controller.enabled = true;
    game.focus();
    status.textContent = "Статус: контролер включён";
});
document.getElementById("disable").addEventListener("click", () => {
    controller.enabled = fasle;
    status.textContent = "Статус: контроллер выключен"
});
document.getElementById("bindJump").addEventListener("click", () => {
    controller.bindActions({
        jump: {keys: [32]}
    });
    game.focus();
    status.textContent="Статус: прыжок привязан к пробелу"
});
function update(){
    if (controller.isActionActive("left"))
        playerX -=
}