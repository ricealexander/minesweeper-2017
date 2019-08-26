function x(s) {
  let q = document.querySelectorAll(s);
  if (q.length != 1) return q;
  else return q[0];
}

// object to store board information
var ms = {
  h: 13,
  w: 13,
  m: 26
}
  
// board array and mines array
var tiles = [], mines = [];

// Button Controls
var flipt = true, flagt = false;

x('#fliptile').addEventListener('click', togFlip);
x('#flagtile').addEventListener('click', togFlag);
x('#startnew').addEventListener('click', newGame);

function togFlip() {
  flipt = true;
  flagt = false;

  x('#fliptile').className = "";
  x('#flagtile').className = "inactive";
}

function togFlag() {
  flipt = false;
  flagt = true;

  x('#fliptile').className = "inactive";
  x('#flagtile').className = "";
}


function newGame() {
  // stop timer
  ///  timer will reset once validation passes
  ///  otherwise, timer will continue once user returns to their game
  tmr.stop();

  let w = x('#widthno').value;
  let h = x('#heightno').value;
  let m = x('#mineno').value;
  // use a boolean flag so error check returns all errors at once
  let error = false;

  // if values are blank, load a new default game
  if (!w && !h && !m) {
    loadboard(ms.h,ms.w,ms.m);
	return;
  }

  if (isNaN(parseFloat(w)) || (parseInt(w) < 1)) {
    x('#widthno').className = "invalid";
	x('#widthno').value = "";
	error = true;
  } else x('#widthno').className = "";

  if (isNaN(parseFloat(h)) || (parseInt(h) < 1)) {
    x('#heightno').className = "invalid";
	x('#heightno').value = "";
	error = true;
  } else x('#heightno').className = "";

  if ((isNaN(parseFloat(m))) || (parseInt(m) < 0) || (parseInt(m) > parseInt(w) * parseInt(h))) {
    x('#mineno').className = "invalid";
	x('#mineno').value = "";
	error = true;
  } else x('#mineno').className = "";
  
  if (error == true) return;
  else loadboard(parseInt(w),parseInt(h),parseInt(m));
}


function loadboard(h,w,m,cust) {
  if (tmr.running) tmr.reset();
  else tmr.clear();
	  
  ms.w = w; // w is for width
  ms.h = h; // h is for height
  ms.m = m; // m is for mines
  // cust is for cool stuff

  // clear inputs
  x('#widthno').value = "";
  x('#heightno').value = "";
  x('#mineno').value = "";
  
  
  // generate the blank board
  var list = x('#board ul');
  ///  empty previous board if one exists
  for (var i = list.childNodes.length; i > 0 ; i--) list.removeChild(list.childNodes[i - 1]);
  ///  remove message if present
  x('#status').innerHTML = "&nbsp;";
  
  ///  responsive board layout
  let wide = 30 * w + "px"
  list.style.width = wide;
  x('#board').style.width = wide;
  
  if (30 * w > 390) x('#gamearea').style.width = wide;
  else x('#gamearea').style.width = "";

  for (var i = 0; i < (w*h); i++) {
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(''));
    item.innerHTML = '&nbsp;';
    list.appendChild(item);
  }
  x('#board').appendChild(list);
  
  // load the board as an array of tiles
  tiles = [];
  tiles = x('#board li');
  

  // generate random list of mines
  mines = [];
  for (var i = 0; i < m; i++) mines[i] = true;
  for (var i = mines.length; i < (w*h); i++) mines[i] = false;

  ///  Fisher-Yates Shuffle
  var cur = mines.length, tmp, ran;
  while (0 !== cur) {
    var ran = Math.floor(Math.random() * cur);
    cur -= 1; tmp = mines[cur]; mines[cur] = mines[ran]; mines[ran] = tmp;
  }
  
  // Easter Egg - Dreamboard map
  if ((w == "16") && (h == "16") && (m == "40") && (cust == "dreamboard"))
  mines = [false,false,false,false,false,true,true,false,true,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false];

  // count nearby mines
  ///  data-count attribute will be used as a tally
  for (var i = 0; i < tiles.length; i++)
    tiles[i].setAttribute("data-count",0);

  // determine which tiles are near mines
  for (var i = 0; i < mines.length; i++) {
    if (mines[i] == true) {
    /// top left diagonal
    addcount(i,i-(w+1));

    /// top middle
    addcount(i,i-w);

    /// top right diagonal
    addcount(i,i-(w-1));

    /// middle left
    addcount(i,i-1);

    /// middle right
    addcount(i,i+1);

    /// bottom left diagonal
    addcount(i,i+(w-1));

    /// bottom middle
    addcount(i,i+w);

    /// bottom right diagonal
    addcount(i,i+(w+1));
	
	/// count the mine as touching a mine - for source code peekers
	let a = parseInt(tiles[i].getAttribute("data-count"));
	tiles[i].setAttribute("data-count", a+=1);
    }
  }

  function addcount(m, n) {
    // if the value is within the range of tiles
    if ((n >= 0) && (n < w*h)) {
      // don't include values where the target and the mine are on opposite edges of the board
      if (!((n % w == 0) && (m % w == w - 1) || (m % w == 0) && (n % w == w - 1))) {
        let a = parseInt(tiles[n].getAttribute("data-count"));
        tiles[n].setAttribute("data-count", a+=1);
      }
    }
  }
  // add the mine count
  x('#flagct').innerHTML = m;

  // add the tile flip event listener
  for (i = 0; i < tiles.length; i++) tiles[i].addEventListener('click', eventManager);
}


function eventManager() {
  if ((flipt == true) && (this.className != "flag")) fliptile(this);
  else if (flagt == true) flagtile(this);
}

function fliptile(that) {
  if (tmr.running == false) tmr.start();
  let w = ms.w;
  let h = ms.h;

  // determine which tile this is
  let index = -1;
  for (var i = 0; i < tiles.length; i++) if (that == tiles[i]) index = i;

  // if you've clicked on a mine
  if (mines[index] == true) {
    // you lose code
    x('#status').innerHTML = "You Lose!";
    showmines(index);

  } else {
    ///  flip the tile
    flipspace(index);
    checkboard();

    function flipspace(index) {
      // determine if tile has already been flipped
      if (tiles[index].className != "empty") {

        tiles[index].removeEventListener('click', eventManager);
        tiles[index].className = "empty";
        let a = tiles[index].getAttribute("data-count");

        if (a != "0") {
          // flipped tiles with numbers will show numbers
          tiles[index].innerHTML = a;
          tiles[index].className += " num" + a;

        } else {
          // flipped tiles with spaces will reveal other spaces
          if ((index - w) >= 0)         flipspace(index - w); // up
          if ((index + 1) % w != 0)     flipspace(index + 1); // right
          if ((index + w) < w*h)        flipspace(index + w); // down
          // if the previous tile is not on the right edge and this tile is not the first tile
          if (((index - 1) % w != w - 1) && (index != 0)) flipspace(index - 1); // left
          
          /// corners
          if (((index - w - 1) >=0) && ((index - w - 1) % w != w - 1)) flipspace(index - w - 1); // top left
          
          if (((index - w + 1) >= 0) && ((index - w + 1) % w != 0))    flipspace(index - w + 1); // top right
          
          if (((index + w - 1) < w*h) && ((index + w - 1) % w != w - 1)) flipspace(index + w - 1);
          // bottom left
          
          if (((index + w + 1) < w*h) && ((index + w + 1) % w != 0)) flipspace(index + w + 1);
          // bottom right
          
        }
      }
    }
  }
}

function flagtile(that) {
  let ct = parseInt(x('#flagct').innerHTML);
  if (that.className == "flag") {
    // remove a flag
    that.className = "";
	x('#flagct').innerHTML = ct + 1;
  } else if (ct > 0){
    // place a flag
    that.className = "flag";
	x('#flagct').innerHTML = ct - 1;
  }
}


function checkboard() {
// this function checks the board to see if you win!
  var flag = true;
  for (var i = 0; i < tiles.length; i++) {
    if ((!tiles[i].classList.contains("empty")) && (mines[i] == false)) {
      flag = false;
    }
  }

  if (flag == true) {
	tmr.stop();
    x('#status').innerHTML = "You Win!";
	
	// remove event listeners so you can't click a mine once you've won
	for (i = 0; i < tiles.length; i++) {
	  tiles[i].removeEventListener('click', eventManager);
	  tiles[i].className += " noclick";
	}
  }
}

// This function uncovers all tiles
///  it has been deprecated in favor of the showmines() function
function showboard() {
  for (i = 0; i < tiles.length; i++) {
  
    ///  remove event listeners
    tiles[i].removeEventListener('click', eventManager);
    
    ///  assign proper classes
    if (mines[i] == true) tiles[i].className = "mine"
    else tiles[i].className = "empty";
    
    ///  display all values
    let a = tiles[i].getAttribute("data-count");
    if ((a != "0") && (mines[i] == false)) {
      tiles[i].innerHTML = a;
      tiles[i].className += " num" + a;
    }
  }
}

// You Lose!
function showmines(n) {
  tmr.stop();
  for (i = 0; i < tiles.length; i++) {
    ///  remove event listeners
    tiles[i].removeEventListener('click', eventManager);

    ///  show the mines
    if (mines[i] == true) tiles[i].className = "mine";
	else tiles[i].className += " noclick";
  }
  ///  indicate the mine that you clicked
  tiles[n].className += " thismine";
}

var t, tmr = {
  seconds: 0,
  minutes: 0,
  hours: 0,
  running: false,

  add: function() {
    tmr.seconds++;

    if (tmr.seconds >= 60) {
      tmr.seconds = 0;
      tmr.minutes++;

      if (tmr.minutes >= 60) {
        tmr.minutes = 0;
        tmr.hours++;
      }
    }

    x('#timer').textContent = (tmr.hours ? (tmr.hours > 9 ? tmr.hours : "0" + tmr.hours) : "00") + ":" + (tmr.minutes ? (tmr.minutes > 9 ? tmr.minutes : "0" + tmr.minutes) : "00") + ":" + (tmr.seconds > 9 ? tmr.seconds : "0" + tmr.seconds);
  },

  start: function() {
	tmr.running = true;
    t = setInterval(tmr.add, 1000);
  },

  stop: function() {
	tmr.running = false;
    clearInterval(t);
  },
  
  clear: function() {
    x('#timer').textContent = "00:00:00";
    tmr.seconds = 0; tmr.minutes = 0; tmr.hours = 0;
  },

  reset: function() {
    tmr.stop();
    tmr.clear();
  }
}

// Load the Board
loadboard(13,13,26); //default board - 13x13 grid with 26 mines