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
  // 1. A kapott adatokat rendezd ár(cost_in_creadits) szerint növekvő sorrendbe.
  novekvoSorrend(userDatas);
  consumaleDelete(userDatas);
  nullToUnknown(userDatas);
}
function novekvoSorrend(array){
  for (var i = array.length; i > 0; i--) {
    var tmp;
    for (var j = 0; j < i - 1; j++) {
      if (array[j].cost_in_credits > array[j + 1].cost_in_credits) {
        tmp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = tmp;
      }
    }
  }
  console.log(array);
  return array;
}
// 2. Töröld az összes olyan adatot, ahol a consumables értéke NULL. Fontos, hogy ne csak undefined-ra állítsd a tömbelemet!!!
function consumaleDelete(array){
  for(var i = 0; i < array.length; i++){
    if(array[i].consumables == null){
      array.splice(i, 1);
    }
  }
  console.log(array);
  return array;
}
// 3. Az összes NULL értéket (minden objektum minden tulajdonságánál) módosítsd "unknown"-ra
function nullToUnknown(array){
  for(var i = 0; i < array.length; i++){
    for(var j in array[i]){
      if(array[i][j] == null){
        array[i][j] = "unknown";
      }
    }
  }
  console.log(array);
  return array;
}
getData('/json/spaceships.json', successAjax);