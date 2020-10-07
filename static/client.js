var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}



function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#252525";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    w = canvas.width;
    h = canvas.height;

    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            console.log("hdalkdjalks")
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    canvas.addEventListener('mousedown', startPainting); 
    canvas.addEventListener('mouseup', stopPainting); 
    canvas.addEventListener('mousemove', sketch);    

    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    
}

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
        document.getElementById("pred").innerHTML = `The digit is <span id="ans">${json['pred']}</span>`
    })
})

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

let coord = {x:0 , y:0};
let paint = false; 

function getPosition(event){ 
    coord.x = event.clientX - canvas.offsetLeft; 
    coord.y = event.clientY - canvas.offsetTop; 
} 

// The following functions toggle the flag to start 
// and stop drawing 
function startPainting(event){ 
    paint = true; 
    getPosition(event); 
} 
function stopPainting(){ 
    paint = false; 
} 
    
function sketch(event){ 
    if (!paint) return; 
    ctx.beginPath(); 
        
    ctx.lineWidth = 24; 
        
    // Sets the end of the lines drawn 
    // to a round shape. 
    ctx.lineCap = 'round'; 
        
    ctx.strokeStyle = 'white'; 
        
    // The cursor to start drawing 
    // moves to this coordinate 
    ctx.moveTo(coord.x, coord.y); 
        
    // The position of the cursor 
    // gets updated as we move the 
    // mouse around. 
    getPosition(event); 
        
    // A line is traced from start 
    // coordinate to this coordinate 
    ctx.lineTo(coord.x , coord.y); 
        
    // Draws the line. 
    ctx.stroke(); 
} 