let ATOMS_PROPERTIES = {
    numberOfAtoms: 20,
    size: 0.5,
    explosionSize: 3,
    explosionOffsetX: 3,
    explosionOffsetY: 3,
    distanceBetweenMultiplier: 2,
    connectionRadius: 200,
    addExplosion: true,
    rippleEnabled: true,
    rippleFill: false,
    rippleSize: 5,
    invisibleAtoms: true,
    mouseHasRipple: true,
    imgMode: false,
    imgSrc: "",
    imgSize: {
        x: 8,
        y: 8,
    },
    canvasWidth: window.innerWidth,
    canvasHeigth: window.innerHeight,
    lightAtomsOnClick: false, //ripple must be true
    alwaysConnected: false,
    rippleDuration: 100, //milliseconds
}
const atoms = function() {
    let canvas = document.getElementById('atoms-canvas');
    canvas.width = ATOMS_PROPERTIES.canvasWidth;
    canvas.height = ATOMS_PROPERTIES.canvasHeigth;
    canvas.style.boxSizing = "border-box";
    let ctx = canvas.getContext("2d");
    let mousePosition = {};
    let explosionOfParticles = false;
    let rippleEffect = ATOMS_PROPERTIES.rippleSize;
    let rippleBool = false;
    const image = new Image(60, 45);
    image.src = ATOMS_PROPERTIES.imgSrc;

    document.addEventListener("mousemove", (e) => {
        mousePosition.x = e.x;
        mousePosition.y = e.y;
    })

    function windowResize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', windowResize);

    document.addEventListener("mousedown", (e) => {
        if (ATOMS_PROPERTIES.addExplosion) {
            explosionOfParticles = true;
        }
        if (ATOMS_PROPERTIES.rippleEnabled) {
        let rippleInterval = setInterval(() => {
            if (rippleEffect !== 0) {
                rippleEffect--;
                rippleBool = true;
            }
        }, ATOMS_PROPERTIES.rippleDuration)
        if (rippleEffect == 0) {
            clearInterval(rippleInterval);
            rippleEffect = ATOMS_PROPERTIES.rippleSize;
            rippleBool = false;
        }
    }
    })
    let bounceHeight = [];
    let bounceWidth = [];
    let randomWidth = [];
    let randomHeight = [];

    ATOMS_PROPERTIES.render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (explosionOfParticles) {
            for (let i = 0; i < ATOMS_PROPERTIES.explosionSize; i++) {
                ATOMS_PROPERTIES.numberOfAtoms++;
                let operation = Math.floor(Math.random() * (1 - 0 + 1) + 0) ? "add" : "subtract";
                switch(operation) {
                    case "add": {
                        randomWidth[ATOMS_PROPERTIES.numberOfAtoms - 1] = mousePosition.x + ATOMS_PROPERTIES.explosionOffsetX * ATOMS_PROPERTIES.distanceBetweenMultiplier;
                        randomHeight[ATOMS_PROPERTIES.numberOfAtoms - 1] = mousePosition.y + ATOMS_PROPERTIES.explosionOffsetY * ATOMS_PROPERTIES.distanceBetweenMultiplier;        
                    } break;
                  
                    case "subtract": { 
                        randomWidth[ATOMS_PROPERTIES.numberOfAtoms - 1] = mousePosition.x - ATOMS_PROPERTIES.explosionOffsetX * ATOMS_PROPERTIES.distanceBetweenMultiplier;
                        randomHeight[ATOMS_PROPERTIES.numberOfAtoms - 1] = mousePosition.y - ATOMS_PROPERTIES.explosionOffsetY * ATOMS_PROPERTIES.distanceBetweenMultiplier;
                    } break;
                  }
            }
            explosionOfParticles = false;
        }
        for (let i = 0; i < ATOMS_PROPERTIES.numberOfAtoms; i++) {
            if (randomWidth.length < ATOMS_PROPERTIES.numberOfAtoms || randomHeight.length < ATOMS_PROPERTIES.numberOfAtoms) {
                randomWidth[i] = Math.floor(Math.random() * (canvas.width - 0 + 1)) + 0;
                randomHeight[i] = Math.floor(Math.random() * (canvas.height - 0 + 1)) + 0;
            }
            if (bounceWidth.length < ATOMS_PROPERTIES.numberOfAtoms || bounceHeight.length < ATOMS_PROPERTIES.numberOfAtoms) {
                bounceHeight[i] = Math.floor(Math.random() * (1 - 0 + 1) + 0) ? true : false;
                bounceWidth[i] = Math.floor(Math.random() * (1 - 0 + 1) + 0) ? true : false;
            }
            if (randomHeight[i] <= canvas.height + 15 && !bounceHeight[i]) {
                bounceHeight[i] = false;
                randomHeight[i] += 1;
            } else {
                randomHeight[i] -= 1;
                bounceHeight[i] = randomHeight[i] >= 0 ? true : false;
            }
    
            if (randomWidth[i] <= canvas.width + 15 && !bounceWidth[i]) {
                bounceWidth[i] = false;
                randomWidth[i] += 1;
            } else {
                randomWidth[i] -= 1;
                bounceWidth[i] = randomWidth[i] >= 0 ? true : false;
            }
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 0.1;
            ctx.beginPath();

            let distanceBetweenAtoms = Math.sqrt(Math.pow(randomWidth[i] - mousePosition.x, 2) + Math.pow(randomHeight[i] - mousePosition.y, 2));
            if (ATOMS_PROPERTIES.alwaysConnected || distanceBetweenAtoms < ATOMS_PROPERTIES.connectionRadius) {
                ctx.lineWidth = 0.1;
                ctx.moveTo(randomWidth[i], randomHeight[i]);
                ctx.lineTo(randomWidth[i], randomHeight[i]);
                ctx.lineTo(mousePosition.x, mousePosition.y);
            }
            if(ATOMS_PROPERTIES.mouseHasRipple) {
                ctx.ellipse(mousePosition.x, mousePosition.y, ATOMS_PROPERTIES.rippleSize, ATOMS_PROPERTIES.rippleSize, 0,0, Math.PI*2);
            }

            ctx.stroke();
            ctx.closePath();
            if (!ATOMS_PROPERTIES.imgMode) {
                ctx.ellipse(randomWidth[i], randomHeight[i], ATOMS_PROPERTIES.size, ATOMS_PROPERTIES.size, 0,0, Math.PI*2);
            }
            if (ATOMS_PROPERTIES.imgMode) {
                ctx.drawImage(image, randomWidth[i], randomHeight[i], ATOMS_PROPERTIES.imgSize.x, ATOMS_PROPERTIES.imgSize.y);
            }
            if (!ATOMS_PROPERTIES.invisibleAtoms) {
                ctx.fill()
            }

            if (rippleBool && rippleEffect > 0 && ATOMS_PROPERTIES.rippleEnabled) {
                ctx.ellipse(mousePosition.x, mousePosition.y, 2 + rippleEffect, 2 + rippleEffect, 0, 0, Math.PI*2);
                if (ATOMS_PROPERTIES.lightAtomsOnClick && !ATOMS_PROPERTIES.rippleFill) {
                    ctx.stroke();
                } 
                if (ATOMS_PROPERTIES.lightAtomsOnClick && ATOMS_PROPERTIES.rippleFill) {
                    ctx.fill();
                }
            }
        }
        window.requestAnimationFrame(ATOMS_PROPERTIES.render)
    }
    window.requestAnimationFrame(ATOMS_PROPERTIES.render)
}