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

  // 1. A kapott adatokat rendezd ár(cost_in_creadits) szerint növekvő sorrendbe.
  function novekvoSorrend() {
    var nullCredit = [];
    var vanCredit = [];
    for (var i = 0; i < userDatas.length; i++) {
      if (userDatas[i].cost_in_credits === null) {
        nullCredit.push(userDatas[i]);
      } else {
        vanCredit.push(userDatas[i]);
      }
    }
    for (var i = vanCredit.length; i > 0; i--) {
      var tmp;
      for (var j = 0; j < i - 1; j++) {
        if (parseInt(vanCredit[j].cost_in_credits) > parseInt(vanCredit[j + 1].cost_in_credits)) {
          tmp = vanCredit[j];
          vanCredit[j] = vanCredit[j + 1];
          vanCredit[j + 1] = tmp;
        }
      }
    }
    userDatas = vanCredit.concat(nullCredit);
    console.log(userDatas);
    return userDatas;
  }

  novekvoSorrend();
  consumaleDelete(userDatas);
  var spaceships = nullToUnknown(userDatas); // ez a tömb amivel tovább kell dolgoznom;
  createDivs(spaceships);

  /*6. A jobb oldalon található keresősáv segítségével legyen lehetőség a hajókra rákeresni _model_ szerint. 
   * A keresés kattintásra induljon
   * A keresés nem case sensitive
   * Nem csak teljes egyezést vizsgálunk, tehát ha a keresett szöveg szerepel a hajó nevében már az is találat
   * Ha több találatunk is lenne, nem foglalkozunk velük, az első találat eredményét (tehát az első megfelelő névvel rendelkező hajó adatait) adjuk vissza.
   * Az adott hajó adatait a one-spaceship class-ű div-be kell megjeleníteni rendezett formában, képpel együtt. */

  var objSearchButton = document.getElementById('search-button');
  objSearchButton.addEventListener('click', function () {
    var searchInput = document.getElementById('search-text').value;
    var sender = event.target;
    var talalat = {};
    for (var i = 0; i < spaceships.length; i++) {
      if (spaceships[i].model.toLowerCase().indexOf(searchInput.toLowerCase()) != -1) {
        talalat = spaceships[i];
        break;
      }
    }
    intoSideDiv(talalat);

  });

  egyFosLegenyseg(spaceships);
  legNagyobbHajo(spaceships);
  osszesUtasSzama(spaceships);
  legHosszabbHajo(spaceships);
}

function intoSideDiv(amiBekerulADivbe) {
  var keresesiFoDiv = document.querySelector('.one-spaceship');
  var keresesiAdatok = document.createElement('div');
  var divImg = document.createElement('div');
  var imgX = document.createElement('img');
  var adatokDiv = document.createElement('div');
  var adatok = "";
  imgX.setAttribute('src', "\/img/" + amiBekerulADivbe.image);
  imgX.setAttribute('alt', "");
  for (var j in amiBekerulADivbe) {
    adatok += j + ": " + amiBekerulADivbe[j] + "<br>";
    adatokDiv.innerHTML = adatok;
    console.log(amiBekerulADivbe);
  }

  keresesiFoDiv.appendChild(keresesiAdatok);
  keresesiAdatok.appendChild(imgX);
  keresesiAdatok.appendChild(adatokDiv);
}


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
    portrait.setAttribute('class', 'adatok');
    imgX.setAttribute('src', "\/img/" + array[i].image);
    imgX.setAttribute('alt', "");
    imgX.setAttribute('class', 'portraitimg')
    imgDiv.setAttribute('class', 'imgDiv');
    mainDiv.appendChild(portrait);
    portrait.appendChild(imgDiv);
    imgDiv.appendChild(imgX);
    for (var j in array[i]) {
      adatok += j + ": " + array[i][j] + "<br>";
      portraitAdatok.innerHTML = adatok;
    }
    portrait.appendChild(portraitAdatok);
  }
}


/* 
5. Készítened kell egy statisztikát, mely a shapceship-list class-ű div aljára a következő adatokat fogja beleírni:
* Egy fős (crew = 1) legénységgel rendelkező hajók darabszáma.
* A legnagyobb cargo_capacity-vel rendelkező hajó neve (model)
* Az összes hajó utasainak (passengers) összesített száma
* A leghosszabb(lengthiness) hajó képe
*/
var mainDiv = document.querySelector('.shapceship-list');

function egyFosLegenyseg(array) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i].crew === "1") {
      count++;
    }
  }
  var egyFosLegenyseg = document.createElement('p');
  egyFosLegenyseg.innerHTML = 'Egy fős (crew = 1) legénységgel rendelkező hajók darabszáma:  ' + count;
  mainDiv.appendChild(egyFosLegenyseg);
  console.log(count);
  return count;
}

function legNagyobbHajo(array) {
  var nev = "";
  var aktual = parseInt(array[0].cargo_capacity);
  for (var i = 0; i < array.length; i++) {
    if (parseInt(array[i].cargo_capacity) > aktual) {
      aktual = parseInt(array[i].cargo_capacity);
      nev = array[i].model;
    }
  }
  var legNagyobbHajoNeve = document.createElement('p');
  legNagyobbHajoNeve.innerHTML = 'A legnagyobb cargo_capacity-vel rendelkező hajó neve (model):  ' + nev;
  mainDiv.appendChild(legNagyobbHajoNeve);
  console.log(nev);
  return nev;
}

function osszesUtasSzama(array) {
  var osszesUtas = 0;
  for (var i = 0; i < array.length; i++) {
    var aktualUtasSzam = array[i].passengers;
    aktualUtasSzam = parseInt(aktualUtasSzam);
    if (!Number.isNaN(aktualUtasSzam)) {
      osszesUtas += aktualUtasSzam;
    }
  }
  var osszesUtasSzama = document.createElement('p');
  osszesUtasSzama.innerHTML = 'Az összes hajó utasainak (passengers) összesített száma: ' + osszesUtas;
  mainDiv.appendChild(osszesUtasSzama);
  console.log(osszesUtas);
  return osszesUtas;
}

function legHosszabbHajo(array) {
  var legHosszabbHajoKepe = "\/img/";
  var hajo = {};
  var legnagyobb = parseInt(array[0].lengthiness);
  for (var i = 0; i < array.length; i++) {
    var aktualHajoHossz = parseInt(array[i].lengthiness);
    if (aktualHajoHossz > legnagyobb) {
      legnagyobb = parseInt(array[i].lengthiness);
      hajo = array[i];
    }
  }
  legHosszabbHajoKepe += hajo.image
  var divX = document.createElement('div');
  var imgX = document.createElement('img');
  divX.innerHTML = 'A leghosszabb(lengthiness) hajó képe:  '
  mainDiv.appendChild(divX);
  imgX.setAttribute('src', legHosszabbHajoKepe);
  divX.appendChild(imgX);
  console.log(legHosszabbHajoKepe);
}

getData('/json/spaceships.json', successAjax);