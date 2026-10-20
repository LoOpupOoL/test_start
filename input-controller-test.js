(() => {
    const game = document.getElementById("game");
    const player = document.getElementById("player");
    const status = document.getElementById("status");
    const actionLog = document.getElementById("actionLog")

    const controller = new InputController({
        left: { keys: [37, 65] },
        right: { keys: [39, 68] },
        up: {keys: [38, 87]},
        down: {keys: [40,83]},
        jump: {keys: [32]},
        shoot: {mouseButton: [0]}
    }, game);

    let playerX = 280;
    let playerY = 105
    const speed = 4;
    let lastEvent = "Событий пока нет";

    const setStatus = (message) => {
        status.textContent = `${message} | ${lastEvent}`;
    };

    document.getElementById("attach").addEventListener("click", () => {
        controller.attach(game);
        game.focus();
        setStatus("Контроллер подключён");
    });

    document.getElementById("detach").addEventListener("click", () => {
        controller.detach();
        setStatus("Контроллер отключён");
    });

    document.getElementById("enable").addEventListener("click", () => {
        controller.enabled = true;
        game.focus();
        setStatus("Контроллер включён");
    });

    document.getElementById("disable").addEventListener("click", () => {
        controller.enabled = false;
        setStatus("Контроллер выключен");
    });

    document.getElementById("bindJump").addEventListener("click", () => {
        controller.bindActions({
            jump: { keys: [32] }
        });

        game.focus();
        setStatus("Прыжок привязан к пробелу");
    });

    document.getElementById("enableLeft").addEventListener("click", () => {
        controller.enableAction("left");
        game.focus();
        setStatus("Действие left включено");
    });

    document.getElementById("disableLeft").addEventListener("click", () => {
        controller.disableAction("left");
        game.focus();
        setStatus("Действие left отключено");
    });

    game.addEventListener(controller.ACTION_ACTIVATED, (event) => {
        lastEvent = `Активация: ${event.detail.action}`;
        setStatus("Контроллер работает");
        addLog(`Активация: ${event.detail.action}`);
    });

    game.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
        lastEvent = `Деактивация: ${event.detail.action}`;
        setStatus("Контроллер работает");
        addLog(`Деактивация: ${event.detail.action}`)
    });

    document.addEventListener(
        InputController.ACTION_ACTIVATED, (event) => {
            console.log("Активированно", event.detail.action);
        }
    );


    function update() {
        if (controller.isActionActive("left")) {
            playerX -= speed;
        }

        if (controller.isActionActive("right")) {
            playerX += speed;
        }
        if (controller.isActionActive("up")){
            playerY -= speed;
        }
        if (controller.isActionActive("down")){
            playerY += speed;
        }

        playerX = Math.max(0, Math.min(playerX, game.clientWidth - player.offsetWidth)
        );
        playerY = Math.max(0, Math.min(playerY, game.clientHeight - player.offsetHeight))

        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`

        player.style.background = controller.isActionActive("jump")
            ? "orange"
            : "royalblue";

        requestAnimationFrame(update);
    }
    function addLog(message) {
        const entry = document.createElement("div");
        entry.textContent = message;
        actionLog.prepend(entry);
    }


    game.focus();
    update();
})();