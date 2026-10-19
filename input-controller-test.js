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
document.getElementById("detach").addEventListener("click", () =>{
    controller.detach();
    status.textContent = "Статус: контроллер отключён";
});
document.getElementById("enable").addEventListener("click", () =>{
    controller.enabled = true;
    game.focus();
    status.textContent = "Статус: контролер включён";
});
document.getElementById("disable").addEventListener("click", () => {
    controller.enabled = false;
    status.textContent = "Статус: контроллер выключен"
});
document.getElementById("bindJump").addEventListener("click", () => {
    controller.bindActions({
        jump: {keys: [32]}
    });
    game.focus();
    status.textContent="Статус: прыжок привязан к пробелу"
});
document.getElementById("enableLeft").addEventListener("click", () =>{
    controller.enableAction("left");
    game.focus();
    status.textContent="Действие left включено"
});
document.getElementById("disableLeft").addEventListener("click", () =>{
    controller.disableAction("left");
    game.focus();
    status.textContent="Действие left выключено"
     
});
game.addEventListener(controller.ACTION_ACTIVATED, (event) =>{
    lastEvent = 'Активация: ${event.detail.action}';
    setStatus
})
function update(){
    if (controller.isActionActive("left")){
        playerX -= speed;
    }
    if (controller.isActionActive("right")){
        playerX += speed;
    }
    playerX = Math.max(0, Math.min(playerX, game.clientWidth - player.offsetWidth));
    player.style.left = playerX + "px";
    if (controller.isActionActive("jump")){
        player.style.background = "orange";
    }
    else {player.style.background = "royalblue";}
    requestAnimationFrame(update);
}
update();
