const canvas = document.getElementById('game');


let totalPixels;
let factor;

let ctx ;

let radius;

let x = canvas.width / 2;
let y = canvas.height;
let dx = 0
let dy = 0;

let scored;
let score;


let hoopXintersect ;
let hoopYintersect;
let backboardWidth;
let backboardHeight;
let rimHeightCollision;
let rimHeightScore;
let rimWidth ;
let rimGap;
let standWidth;

score = 0;

let isDragging = false;

let zoneX = 1;
let zoneY = 1;
function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
     totalPixels = canvas.width * canvas.height;
     factor = totalPixels / 2000000;

     ctx = canvas.getContext("2d");

     radius = 20 * factor;


     scored = false;


     hoopXintersect = canvas.width - (100 * factor);
     hoopYintersect = canvas.height / 2;
     backboardWidth = 5 * factor;
     backboardHeight = 140 * factor;
     rimHeightCollision = 15 * factor;
     rimHeightScore = 200 * factor;
     rimWidth = 1 * factor;
     rimGap = 200 * factor;
     standWidth = 4 * factor;


     isDragging = false;

     zoneX = 1;
     zoneY = 1;


    zoneXf();
    zoneYf();
}
setup();

window.onresize = function(event) {
    setup();
};

function zoneXf() {
    let max = hoopXintersect - rimWidth * 2 - rimGap - (zoneWidth()*1.2);

    let min = 600 * (canvas.width/ 1600);
    zoneX = Math.floor(Math.random() * (max - min) + min);
    if(zoneX > max){
        zoneX = max;
    }
    scaleHoop((98)/100);
}

function zoneYf() {
    let max = (canvas.height*0.8) - zoneHeight();
    let min = Math.max(canvas.height *( 1/(5+score)),50);
    zoneY = Math.floor(Math.random() * (max - min) + min);
}

function zoneWidth() {
    return canvas.width/2 * (100-score * 2)/100;
}

function zoneHeight() {
    return canvas.height / (2) * (100-score * 2)/100;
}

function drawZone(){
    // draw translucent zone
    ctx.beginPath();
    ctx.rect(zoneX, zoneY, zoneWidth(), zoneHeight());
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    let size = parseInt(40 * factor);
    if(size < 4){
        size = 4;
    }
    ctx.font = size+"px Arial";
    ctx.fillStyle = "#000000";
    if(score === 50){

        ctx.fillText("Well done, you win!", (canvas.width / 2) - size * 4, size+10);
        return;
    }

    if(score === 0){
        ctx.fillText("Click and drag within the shaded zone to shoot", zoneX, zoneY + zoneHeight() + 50);
    }
    ctx.fillText("Level: " + (score+1) + " / 50", (canvas.width / 2) - size*3, size+10);
}

function drawBasketball() {
    ctx.beginPath();
    //ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    //ctx.fillStyle = "#FFA500";
    //ctx.fill();
    //ctx.lineWidth = 5;
    //ctx.strokeStyle = "#000000";
    //ctx.stroke();
    ctx.drawImage(document.getElementById("bball"), x - radius, y - radius, radius * 2, radius * 2);
    ctx.closePath();
}

function drawBackboard() {
    ctx.beginPath();
    ctx.drawImage(document.getElementById("bb"), hoopXintersect, hoopYintersect - backboardHeight,( canvas.width - hoopXintersect), backboardHeight);
    ctx.fill();
    ctx.closePath();

}

function drawStand() {
    ctx.beginPath();
    ctx.drawImage(document.getElementById("stand"), hoopXintersect, hoopYintersect, canvas.width - hoopXintersect, canvas.height - hoopYintersect);
    ctx.closePath();
}

function drawRim() {

    ctx.beginPath();

    ctx.drawImage(document.getElementById("hoop"), hoopXintersect - rimGap - rimWidth, hoopYintersect, rimGap, rimGap);
    //ctx.rect(hoopXintersect - rimGap- rimWidth, hoopYintersect - backboardWidth, rimWidth, rimHeight);
    //ctx.rect(hoopXintersect - rimWidth, hoopYintersect - backboardWidth, rimWidth, rimHeight);
    //ctx.fillStyle = "#000000";
    //ctx.fill();
    ctx.closePath();
}


function drawBackground(){
    ctx.beginPath();
    if(canvas.width > canvas.height){
        let offset = (canvas.width - canvas.height) / 2;
        ctx.drawImage(document.getElementById("bg"),0, -offset, canvas.width, canvas.width);
    } else {
        let offset = (canvas.height - canvas.width) / 2;
        ctx.drawImage(document.getElementById("bg"),-offset, 0, canvas.height, canvas.height);
    }
    //let longDimension = Math.max(canvas.width, canvas.height);
    //ctx.drawImage(document.getElementById("bg"),0, 0, longDimension, longDimension);
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(255, 255,255 , 0.5)";
    ctx.fill();
    ctx.closePath();

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBackboard();
    drawStand();
    drawRim();
    drawScore();
    drawZone();
    if (isDragging) {
        drawPullback();
    }
    drawBasketball();
}

function collisionBackboard() {
    return x + radius > hoopXintersect && x - radius < hoopXintersect + backboardWidth && y + radius > hoopYintersect - backboardHeight && y - radius > 0;
}



function collisionRim() {

    return x + radius > hoopXintersect - rimGap - rimWidth && x - radius < hoopXintersect - rimGap && y + radius > hoopYintersect && y - radius < hoopYintersect + rimHeightCollision
        || x + radius > hoopXintersect && x - radius < hoopXintersect + rimWidth && y + radius > hoopYintersect && y - radius < hoopYintersect + rimHeightCollision;
}


function scaleHoop(scaleFactor) {
    rimGap *= scaleFactor;
}




let collision = false;
function move() {

        if (x + dx > canvas.width - radius || x + dx < radius) {
            dx = -dx;
        }else if (y + dy < radius) {
            dy = -dy * 0.9;
            if (Math.abs(dy) < 0.2) {
                dy = 0;
            }
        }else if((y + dy > canvas.height - radius)){
            dy = -dy * 0.6;
            y = canvas.height - radius;
        }else if(collisionBackboard() || collisionRim()) {
            if(collision !== true){
                dx = -dx;
                dy = -dy;
                collision = true;
            }
        } else {
            collision = false;
            if (!isDragging) {
                airResistance();
                gravity();
            }
        }
        throughHoop();

        x += dx;
        y += dy;
        draw(x, y);


        if((y + dy > canvas.height - radius)){
            dy = -dy * 0.6;
        y = canvas.height - radius;
    }
}

function throughHoop() {
    rimHeightScore = 2*dy;
    if(scored){
        return;
    }
    if (// is currently between the rims
        x > hoopXintersect - rimGap - rimWidth && x < hoopXintersect + rimWidth && y > hoopYintersect - rimWidth && y < hoopYintersect + rimHeightScore &&
        //is going to be under the rims next time.
        y + dy > hoopYintersect + rimHeightScore) {

        scored = true;
        score++;
        zoneXf();
        zoneYf();
    }

}

function gravity() {
    dy += (0.8*factor);
}

function airResistance() {
    if((Math.abs(dx) >  2) || y > canvas.height*0.7) {

        dx *= 0.960;
    }
    dy *= 0.960;
}

let interval = setInterval(move, 15);

let totalY = 0;
let totalX = 0;


document.addEventListener('mousedown', function(event) {
    totalX = event.clientX;
    totalY = event.clientY;
    if (totalX > zoneX && totalX < zoneX + zoneWidth() && totalY > zoneY && totalY < zoneY + zoneHeight()) {
        isDragging = true;
        x = event.clientX;
        y = event.clientY;
        dx=0;
        dy=0;
    }

});

document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        totalX = event.clientX;
        totalY = event.clientY;
    }
});

document.addEventListener('mouseup', function() {
    if (isDragging) {
        isDragging = false;
        dy = ((y-totalY) / totalPixels)*300000* factor;
        dx = ((x-totalX) / totalPixels)*300000* factor;
        scored = false;
    }

});

function drawPullback() {
    ctx.beginPath();
    ctx.moveTo(x, y);
    let x2 = x + ((x-totalX) / totalPixels)*1000000 * factor;
    let y2 = y + ((y-totalY) / totalPixels)*1000000 * factor;

    ctx.lineTo(x2, y2);
    ctx.lineWidth = 4 * factor;
    ctx.stroke();

    let lengthofline = Math.sqrt((x2-x)*(x2-x) + (y2-y)*(y2-y));



    // Calculate gradient of the pullback line
    let gradient = (y2 - y) / (x2 - x);
    let perpGradient = -1 / gradient;

    let fraction = 0.8;

    // Calculate a point on the pullback line for the perpendicular line
    let midX = x + fraction * (x2 - x);
    let midY = y + fraction * (y2 - y);

    // Length of the perpendicular line, distance from x2, y2 to midx midy
    let length = lengthofline * (1 - fraction)/2;

    // Calculate endpoints of the perpendicular line
    let deltaX = length / Math.sqrt(1 + perpGradient * perpGradient);
    let deltaY = perpGradient * deltaX;

    let x3 = midX + deltaX;
    let y3 = midY + deltaY;
    let x4 = midX - deltaX;
    let y4 = midY - deltaY;

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x4, y4);
    ctx.lineWidth = 4 * factor;
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineWidth =4 * factor;
    ctx.stroke();

}

//touch controls

document.addEventListener('touchstart', function(event) {
    clearInterval(interval);
    interval = setInterval(move, 10);

    totalX = event.touches[0].clientX;
    totalY = event.touches[0].clientY;
    if (totalX > zoneX && totalX < zoneX + zoneWidth() && totalY > zoneY && totalY < zoneY + zoneHeight()) {
        isDragging = true;
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
        dx=0;
        dy=0;
    }

}

);

document.addEventListener('touchmove', function(event) {
    if (isDragging) {
        totalX = event.touches[0].clientX;
        totalY = event.touches[0].clientY;
    }

}
);

document.addEventListener('touchend', function(event) {
    if (isDragging) {
        isDragging = false;
        dy = ((y-totalY) / totalPixels)*200000* factor;
        dx = ((x-totalX) / totalPixels)*200000* factor;
        scored = false;
    }


}
);