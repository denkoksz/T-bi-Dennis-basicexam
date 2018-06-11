"use strict";

function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunc(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  console.log(userDatas);

  function novekvoSorrend() {
    var tmp;
    var cost;
    var cost2;
    for (var i = userDatas.length; i > 0; i--) {
      for (var j = 0; j < i - 1; j++) {
        if (userDatas[j].cost_in_credits > userDatas[j + 1].cost_in_credits) {
          tmp = userDatas[j];
          userDatas[j] = userDatas[j + 1];
          userDatas[j + 1] = tmp;
        }
      }
    }
    console.log(userDatas)
    return userDatas;
  }

  novekvoSorrend();
  consumaleDelete(userDatas);

  var spaceships = nullToUnknown(userDatas); // ez a tömb amivel tovább kell dolgoznom;
  console.log(spaceships);
  createDivs(spaceships);

}
// 1. A kapott adatokat rendezd ár(cost_in_creadits) szerint növekvő sorrendbe.


// 2. Töröld az összes olyan adatot, ahol a consumables értéke NULL. Fontos, hogy ne csak undefined-ra állítsd a tömbelemet!!!
function consumaleDelete(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].consumables == null) {
      array.splice(i, 1);
    }
  }
  console.log(array);
  return array;
}
// 3. Az összes NULL értéket (minden objektum minden tulajdonságánál) módosítsd "unknown"-ra
function nullToUnknown(array) {
  var urhajok = [];
  for (var i = 0; i < array.length; i++) {
    for (var j in array[i]) {
      if (array[i][j] == null) {
        array[i][j] = "unknown";
      }
    }
  }
  urhajok = array;
  return urhajok;
}

// 4. A shapceship-list class-ű divbe jelenítsd meg az így kapott hajók adatait, beleérve a képét is.
function createDivs(array) {
  var mainDiv = document.querySelector('.shapceship-list');
  for (var i = 0; i < array.length; i++) {
    var portrait = document.createElement('div');
    var imgX = document.createElement('img');
    var portraitAdatok = document.createElement('div');
    var adatok = "";
    var imgDiv = document.createElement('div');
    portraitAdatok.setAttribute('class', 'adatok');
    imgX.setAttribute('src', "\/img/" + array[i].image);
    imgX.setAttribute('alt', array[i].denomination);
    imgX.setAttribute('class', 'portraitimg')
    imgDiv.setAttribute('class', 'imgDiv');
    mainDiv.appendChild(portrait);
    portrait.appendChild(imgDiv);
    imgDiv.appendChild(imgX);
    for(var j in array[i]){
      adatok += j + ": " + array[i][j] + "<br>";
      portraitAdatok.innerHTML = adatok;
    }
    portrait.appendChild(portraitAdatok);
  }
}

getData('/json/spaceships.json', successAjax);