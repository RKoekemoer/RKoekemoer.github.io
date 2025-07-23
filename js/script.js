/* Slide in animations */
$(document).ready(function () {

    const education = new IntersectionObserver(function (entries, observer) {
        entries.forEach(( entry,index )=> {
            if (entry.isIntersecting) {

                const delay = index * 750;

                setTimeout(() => {
                    $(entry.target)
                        .addClass('animate__slideInRight')
                        .css('visibility', 'visible');
                }, delay);

            }
        });
    }, {
        threshold: 0
    });

    $('#education').find('.educationItem').each(function () {
        education.observe(this);
    });

});

/* Skills matrix - numbering */
$(document).ready(function () {

    const skillsMatrix = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                var item = $(entry.target).find('.skillMastery');

                item.html( item.data('fill') );
                $(entry.target).find('.filler').css('width', item.data('fill'));

            }
        });
    }, {
        threshold: 0
    });

    $('#skills').find('.skillItem').each(function () {
        skillsMatrix.observe(this);
    });

});

/*  cat and mouse game */
$(document).ready(function () {

    const canvas = document.getElementById("catAndMouse");
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const gridSize = 20;
    const cellSize = canvas.width / gridSize;

    function randomSpawn() {

        return Math.floor( Math.random() * gridSize );
    }

    let rat;
    let cat;
    let catMovement;
    let speedOfcat;
    let catMoves;
    let totalcatMoves;

    let isGameOver = false;

    function spawnAvitars() {
        /* Set Rat spawn location */
        rat = {
            x: randomSpawn(),
            y: randomSpawn()
        };

        /* Set cat spawn location */
        cat = [{
            x: randomSpawn(),
            y: randomSpawn()
        }];

        /* Ensure Rat and cat aren't spawned at same location */
        if ( cat[0].x === rat.x && cat[0].y === rat.y ) {

            while (cat[0].x === rat.x && cat[0].y === rat.y) {
                cat[0].x = randomSpawn();
                cat[0].y = randomSpawn();
            }

        }
    }

    /* Grid to help visualise movement */
    function drawGrid() {
        ctx.strokeStyle = "#333";

        for (let i = 0; i <= gridSize; i++) {
            //Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }
    }

    /* Function to draw rat */
    function drawRat() {
        ctx.fillStyle = "#9e270d";

        ctx.fillRect(
            rat.x * cellSize,
            rat.y *cellSize,
            cellSize,
            cellSize
        )
    }

    /* Function to draw cat */
    function drawcat() {
        ctx.fillStyle = "#20aad3";

        cat.forEach( segment => {
            ctx.fillRect(
                segment.x * cellSize,
                segment.y * cellSize,
                cellSize,
                cellSize
            )
        });
    }

    /* Move cat auto */
    function movecatTowardRat() {
        const head = { ...cat[0] };

        /* Move to rat */
        if (rat.x > head.x) head.x++;
        else if (rat.x < head.x) head.x--;
        else if (rat.y > head.y) head.y++;
        else if (rat.y < head.y) head.y--;

        // Add new head to front of cat
        cat.unshift(head);

        // Remove last segment (so it stays the same length for now)
        cat.pop();

        /* Count cat moves */
        catMoves++;
        totalcatMoves++;

        /* Update scores */
        $('#catMoves').html(totalcatMoves);

        if (catMoves === 2 && speedOfcat >= 150) {
            /* Stop cat */
            clearInterval(catMovement);

            /* Adjust speed */
            speedOfcat = speedOfcat - 50;

            /* Start cat at new speed */
            catSpeed( speedOfcat );

            console.log( speedOfcat );

            /* Restart move counter */
            catMoves = 0;

            $('#catSpeed').html(speedOfcat);
        }
    }

    /* Clean canvas */
    function cleanUp() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /* Draw content of canvas */
    function draw() {
        cleanUp();
        drawGrid();
        drawRat();
    }

    /* memory for players next move */
    let pendingMove = {
        x: 0,
        y: 0
    };
    /* Get user input */
    document.addEventListener("keydown", (e) => {
        if (e.key === "w") pendingMove = { x: 0, y: -1 };
        if (e.key === "s") pendingMove = { x: 0, y: 1 };
        if (e.key === "a") pendingMove = { x: -1, y: 0 };
        if (e.key === "d") pendingMove = { x: 1, y: 0 };
    });

    /* Update Rat position on new move */
    function update() {
        const newX = rat.x + pendingMove.x;
        const newY = rat.y + pendingMove.y;

        /* Ensure move is within grid */
        if ( newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize  ) {
            rat.x = newX;
            rat.y = newY;
        }

        pendingMove = { x: 0, y: 0 };

        if (cat[0].x === rat.x && cat[0].y === rat.y) {
            clearInterval(catMovement);
            isGameOver = true;

            $("#totalScore").html(totalcatMoves);
            $("#theBoard").find('.gameOver').addClass("show");
        }

    }

    /* Start cat */
    function catSpeed(speed) {
        catMovement = setInterval( movecatTowardRat, speed);
    }

    function startGame() {
        if (catMovement) {
            clearInterval(catMovement);
            catMovement = null;
        }

        speedOfcat = 1000;
        catMoves = 0;
        totalcatMoves = 0;
        isGameOver = false;

        $('#catSpeed').html(speedOfcat);
        $('#catMoves').html(totalcatMoves);
        $("#totalScore").html("0");
        $("#theBoard").find('.gameOver').removeClass("show");

        spawnAvitars();
        draw();
        gameLoop();
        catSpeed(speedOfcat);
        $('#startGame').html("Restart game");
    }


    function gameLoop() {
        update();
        cleanUp();
        drawGrid();
        drawRat();
        drawcat();

        if (!isGameOver) {
            window.requestAnimationFrame(gameLoop);
        }
    }

    $("#startGame").on('click', function () {
        startGame();
    })
});