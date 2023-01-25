function showTab(n) {
var x = document.getElementsByClassName("tab");
if(!x && x[n]) return;
if(x && x[n]) x[n].style.display = "block";
if (n == 0) {
document.getElementById("tekrar").innerHTML = "Bot kurmaya hazır mısın?";
document.getElementById("logo").src ="/img/wumpus.gif";
document.getElementById("prevBtn").style.display = "none";
document.getElementById("regForm").className = "form"
document.getElementById("nextBtn").innerHTML = "Başla...";
document.getElementById("nextBtn").style.backgroundColor = "GREEN"
document.getElementById("all-steps").style.display = "none";
} else {
document.getElementById("all-steps").style.display = "block";
document.getElementById("regForm").className = "formuzun"
document.getElementById("prevBtn").style.display = "inline";
}
if (n == (x.length - 1)) {
  document.getElementById("logo").style ="width: 200px";
document.getElementById("textcik").style.display = "none";
document.getElementById("textcik").innerHTML = "Seninle beraber bot kurulumuna başlayacağız fakat ondan önce gerekli bilgileri aşağıda bulunan kutucuklara girmelisin."
document.getElementById("logo").src ="/img/sonadim.svg";
document.getElementById("tekrar").innerHTML = "Çok heyecanlı bitmek üzere!";
document.getElementById("nextBtn").innerHTML = "Kurulumu Tamamla!";
document.getElementById("nextBtn").style.backgroundColor = "ORANGE"
} else {
  let acar = [
    "/img/wumpusarastirma.gif",
    "/img/wumpuspc.gif"
  ]
  if(n != 3) {
    document.getElementById("logo").style ="width: 200px";
  } else {
    document.getElementById("logo").style ="width: 50px";
  }
  document.getElementById("textcik").style.display = "block";
  document.getElementById("logo").src = acar[Math.floor(Math.random()*acar.length)];
document.getElementById("logo").src ="/img/wumpusarastirma.gif";
document.getElementById("tekrar").innerHTML = "Haydi seninle bot kuralım!";
document.getElementById("nextBtn").style.backgroundColor = "#575b61"
if(n == 0) {
  document.body.style.backgroundImage = "url('/img/background.jpg')"
  document.getElementById("all-steps").style.display = "none";
  document.getElementById("tekrar").innerHTML = "Bot kurmaya hazır mısın?";
  document.getElementById("textcik").innerHTML = "Seninle beraber bot kurulumuna başlayacağız fakat kuruluma başlamadan önce senden bot kurulumundan bahsetmeliyim."
  document.getElementById("logo").src ="/img/wumpus.gif";
  document.getElementById("nextBtn").innerHTML = "Başla...";
  document.getElementById("nextBtn").style.backgroundColor = "GREEN"
  document.getElementById("regForm").className = "form"
} else {
  let acar = [
    "/img/wumpusarastirma.gif",
    "/img/wumpuspc.gif"
  ]
  
  document.getElementById("logo").src = acar[Math.floor(Math.random()*acar.length)];
  document.getElementById("textcik").innerHTML = "Seninle beraber bot kurulumuna başlayacağız fakat ondan önce gerekli bilgileri aşağıda bulunan kutucuklara girmelisin."
  document.getElementById("all-steps").style.display = "block";
  document.getElementById("nextBtn").innerHTML = "Devam et";
}

}
fixStepIndicator(n)
}

function nextPrev(n) {
var x = document.getElementsByClassName("tab");
if (n == 1 && !validateForm()) return false;
x[currentTab].style.display = "none";
currentTab = currentTab + n;
if (currentTab >= x.length) {
document.getElementById("regForm").submit();
//alert("Sunucu kurulumu başarıyla tamamlandı.");
document.getElementById("prevBtn").style.display = "none";
document.getElementById("regForm").style.display = "none";
document.getElementById("regForm").className = "form"
if(document.getElementById("nextBtn")) document.getElementById("nextBtn").style.display = "none";
if(document.getElementById("all-steps")) document.getElementById("all-steps").style.display = "none";
if(document.getElementById("register")) document.getElementById("register").style.display = "none";
if(document.getElementById("text-message")) document.getElementById("text-message").style.display = "block";



}
showTab(currentTab);
}

function validateForm() {
var x, y, i, valid = true;
x = document.getElementsByClassName("tab");
y = x[currentTab].getElementsByTagName("input");
for (i = 0; i < y.length; i++) { if (y[i].value=="" ) { y[i].className +=" invalid" ; valid=false; } } if (valid) { document.getElementsByClassName("step")[currentTab].className +=" finish" ; } return valid; } function fixStepIndicator(n) { var i, x=document.getElementsByClassName("step"); for (i=0; i < x.length; i++) { x[i].className=x[i].className.replace(" active", "" ); } x[n].className +=" active" ; }

