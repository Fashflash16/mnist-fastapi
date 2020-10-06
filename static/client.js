var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "white",
    y = 10;

function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#252525";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

// function save() {
//     document.getElementById("test").style.border = "2px solid";
//     var dataURL = canvas.toDataURL();
//     document.getElementById("test").src = dataURL;
//     document.getElementById("test").style.display = "inline";
// }

const mnistForm = document.getElementById("mnist-form")
mnistForm.addEventListener('submit', (e) => {
    e.preventDefault()
    var loc = window.location;
    fetch(`${loc.protocol}//${loc.hostname}:${loc.port}/upload`, {
        method: "post",
        body: JSON.stringify({
            "canvasimg": document.getElementById('canvasimg').value
        }),
    }).then((res) => {
        return res.json()
    }).then((json) => {
        document.getElementById("pred").innerHTML = `The number is <span id="ans">${json['pred']}</span>`
    })
})

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    ctx.fillStyle = "#252525";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("pred").innerHTML = "";   
}

function canvastoimage() {
    var canvas = document.getElementById('can');
    document.getElementById('canvasimg').value = canvas.toDataURL("image/png");
    //console.log(document.getElementById('canvasimg').value)
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}