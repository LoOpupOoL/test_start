(() => {
    const game = document.getElementById("game");
    const player = document.getElementById("player");
    const status = document.getElementById("status");

    const controller = new InputController({
        left: { keys: [37, 65] },
        right: { keys: [39, 68] }
    }, game);

    let playerX = 280;
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
    });

    game.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
        lastEvent = `Деактивация: ${event.detail.action}`;
        setStatus("Контроллер работает");
    });

    function update() {
        if (controller.isActionActive("left")) {
            playerX -= speed;
        }

        if (controller.isActionActive("right")) {
            playerX += speed;
        }

        playerX = Math.max(
            0,
            Math.min(playerX, game.clientWidth - player.offsetWidth)
        );

        player.style.left = `${playerX}px`;

        player.style.background = controller.isActionActive("jump")
            ? "orange"
            : "royalblue";

        requestAnimationFrame(update);
    }

    game.focus();
    update();
})();