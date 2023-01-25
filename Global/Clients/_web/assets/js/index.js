const BG_IMAGE_URL = ''
const BG_COLOR = '#36393f';
const POINTS_AMOUNT = 1000;
const WIDTH = 1280;
const HEIGHT = "AUTO";
const RADIUS = 730;
const image = new Image();
let canvas,
ctx,
simplex,
points = [],
dots = [],
time = 0,
dotsMoveCoef = 0;


window.onload = function init() {
  canvas = document.querySelector('#canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx = canvas.getContext('2d');
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 10;
  simplex = new SimplexNoise('noise1');

  image.src = BG_IMAGE_URL;


  this.addEventListener('mousemove', e => {
    const halfX = window.innerWidth / 2;
    dotsMoveCoef = (e.clientX - halfX) / 100;
  });

  createPoints();
  createDots();
  animate();

  function createPoints() {
    for (let i = 0; i < POINTS_AMOUNT; i++) {
      const point = {
        x: +Math.cos(i / POINTS_AMOUNT * Math.PI * 2),
        y: Math.sin(i / POINTS_AMOUNT * Math.PI * 2) };

      point._x = point.x;
      point._y = point.y;

      points.push(point);
    }
  }

  function createDots() {
    for (let i = 0; i < 20; i++) {
      dots.push(new Dot());
    }
  }
};

function animate() {
  render();
  update();
  requestAnimationFrame(animate);

  function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = BG_COLOR;
    ctx.lineCap = 'round';
    drawShape();
    drawDots();

    function drawShape() {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.clip();
    }

    function drawDots() {
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 2 * Math.PI, false);
        ctx.fillStyle = dot.color;
        ctx.fill();
      });
    }
  }

  function update() {
    updatePoints();
    updateDots();

    function updatePoints() {
      const coef = 3.2;
      points.forEach(point => {
        let noise = simplex.noise2D(point._x * coef + time, point._y * coef + time) * 20;
        point.x = point._x * RADIUS + noise;
        point.y = point._y * RADIUS + noise;
      });
      time += .001;
    }

    function updateDots() {
      dots.forEach(dot => {
        dot.update();
      });
    }
  }
}

function Dot() {
  const x = Math.random() * RADIUS;

  return {
    radius: Math.round(Math.random() * 4),
    color: '#fff',
    x: x + dotsMoveCoef,
    _x: x,
    y: Math.random() * HEIGHT,
    speed: -Math.random() * .5,
    update: function () {
      this.y += this.speed;

      if (this.y + this.radius < 0) {
        this.y = HEIGHT + 50;
      }

      const delta = this.x - (this._x + dotsMoveCoef);
     // console.log(delta);
      if (Math.abs(delta) / 4 > 1) {
        this.x += delta > 0 ? .1 : -.1;
      } else {
        this.x = this._x + dotsMoveCoef;
      }
    } };

}
var currentTab = 0;
document.addEventListener("DOMContentLoaded", function(event) {


showTab(currentTab);

});

function showTab(n) {
var x = document.getElementsByClassName("tab");
if(x && x[n]) x[n].style.display = "block";
if (n == 0) {
document.getElementById("prevBtn").style.display = "none";
} else {
document.getElementById("regForm").className = "formuzun"
document.getElementById("prevBtn").style.display = "inline";
}
if (n == (x.length - 1)) {
document.getElementById("nextBtn").innerHTML = "Kurulumu Tamamla";
document.getElementById("nextBtn").style.backgroundColor = "ORANGE"
} else {
document.getElementById("nextBtn").style.backgroundColor = "#575b61"
document.getElementById("regForm").className = "form"
document.getElementById("nextBtn").innerHTML = "İlerle";
}
fixStepIndicator(n)
}

function nextPrev(n) {
var x = document.getElementsByClassName("tab");
if (n == 1 && !validateForm()) return false;
x[currentTab].style.display = "none";
currentTab = currentTab + n;
if (currentTab >= x.length) {
//document.getElementById("regForm").submit();
//alert("Kurulum başarılı!");
document.getElementById("prevBtn").style.display = "none";
document.getElementById("regForm").style.display = "none";
document.getElementById("regForm").className = "form"
if(document.getElementById("nextBtn")) document.getElementById("nextBtn").style.display = "none";
if(document.getElementById("all-steps")) document.getElementById("all-steps").style.display = "none";
if(document.getElementById("register")) document.getElementById("register").style.display = "none";
if(document.getElementById("text-message")) document.getElementById("text-message").style.display = "block";
return false;



}
showTab(currentTab);
}

function validateForm() {
var x, y, i, valid = true;
x = document.getElementsByClassName("tab");
y = x[currentTab].getElementsByTagName("input");
for (i = 0; i < y.length; i++) { if (y[i].value=="" ) { y[i].className +=" invalid" ; valid=false; } } if (valid) { document.getElementsByClassName("step")[currentTab].className +=" finish" ; } return valid; } function fixStepIndicator(n) { var i, x=document.getElementsByClassName("step"); for (i=0; i < x.length; i++) { x[i].className=x[i].className.replace(" active", "" ); } x[n].className +=" active" ; }