let Canvas = require("canvas");
let fs = require("fs");

let jobs = [];
let jobIndex = 0;
let canvasWidth = 4096;
let canvasHeight = 4096;
let canvas;
let ctx;

function runLine(red = 255, green = 255, blue = 255, alpha = 0.5, steps = 1000, position = [2048, 2048], changeRed, changeBlue, changeGreen) {
    ctx.strokeStyle = createColorString(red, green, blue, alpha);
    while(steps--) {
        ctx.beginPath();
        ctx.moveTo(position[0], position[1]);
        position[0] += Math.floor(Math.random() * 10.99999 - 5);
        position[1] += Math.floor(Math.random() * 10.99999 - 5);
        ctx.lineTo(position[0], position[1]);
        ctx.stroke();
        if (changeRed) red = Math.floor(Math.max(0, Math.min(255, red + Math.random() * 16.9999 - 8)));
        if (changeGreen) green = Math.floor(Math.max(0, Math.min(255, green + Math.random() * 16.9999 - 8)));
        if (changeBlue) blue = Math.floor(Math.max(0, Math.min(255, blue + Math.random() * 16.9999 - 8)));
        ctx.strokeStyle = createColorString(red, green, blue, alpha);
    }
}

function createArt(background, lines, changeRed = false, changeBlue = false, changeGreen = false) {
    canvas = new Canvas(canvasWidth, canvasHeight);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    while (lines--) {
        runLine(255, 200, 255, .5, 1000000, [2048, 2048], changeRed, changeBlue, changeGreen);
    }
    let out = fs.createWriteStream(__dirname + "/walk" + Date.now() + ".png");
    let stream = canvas.pngStream();

    stream.on("data", function(chunk){
        out.write(chunk);
    });

    stream.on("end", function(){
        console.log("saved png");
        startNextJob();
    });
}

function createColorString(r, g, b, a) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function addJob() {
    jobs.push(arguments);
}

function startNextJob() {
    if (jobs[jobIndex]) {
        createArt.apply(null, jobs[jobIndex]);
        jobIndex++;
    } else {
        console.log("sucessfully created", jobIndex, "jobs");
    }
}

addJob("#d0d0d0", 2, false, false, true);
addJob("#f9f6cb", 3, false, true, true);
addJob("#d2d5ff", 5, false, true, false);
addJob("#ffc6fc", 1, true, false, true);
startNextJob();
