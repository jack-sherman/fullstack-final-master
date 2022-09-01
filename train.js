const randPuzzle = 'https://api.chess.com/pub/puzzle/random'
var chess;
var step = 0;
var clicks = 0;
var sqOne = 0;
var sqOneColor;
var toMove;
var sqTwo = 0;
var totalStep = 0;
var MOVarray;
var MOV = new String;
var promote=0;
var promoteArr = new Array;
board = new Array(64);//setting a 8x8 grid for a new board
everything();
function everything(){
  fetch(randPuzzle)
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    chess = data;
    console.log(chess.fen);
    //if(customPGN != ""){
    //  chess.pgn = customPGN;
    //}
    //if(customFEN != ""){
    //  chess.fen = customFEN;
    //}
    FEN = chess.fen;

    publishDate = new Date(0);
    publishDate.setUTCSeconds(chess.publish_time)
    infoDate = "Published: <br> <br>" + publishDate.toString();
    console.log(chess);
    //document.getElementById('puzzleIMG').src = chess.image;
    document.getElementById('info').innerHTML += "<br>Puzzle name:<br> <br>"+ chess.title +"<br> <br> <br>" + infoDate + "<br>";
    if(chess.fen.includes(" w ")){
      toMove = "w"
      document.getElementById("turnDisplay").innerHTML = "WHITE TO MOVE";
    }else{
      toMove = "b"
      document.getElementById("turnDisplay").innerHTML = "BLACK TO MOVE";
    }
    console.log(toMove);
    if(toMove == "w"){
      //document.getElementById("puzzle").innerHTML += "white to move";

      
    } 
    else if(toMove == "b"){
      //document.getElementById("puzzle").innerHTML += "black to move";
    }

//   board = new Array(64);//setting a 8x8 grid for a new board
    var counter=0;
    //iterating through the FEN and assigning each index of the array its corresponding piece
    //i = row and j = column
    for(var i=1; i<=8; ++i){
      for(var j=1; j<=8; ++j){
        if(Number(chess.fen[counter])){         //if we encounter a number in the FEN, then we skip that many columns in the array
          //j+=(Number(chess.fen[counter])-1);
          for(var k = 1; k<=Number(chess.fen[counter]); ++k){
            board[(8*(i-1))+j]= "0";
            ++j;
          }
          --j;

        }
        else if(chess.fen[counter]=="/"){       
          //do nothing if a / is encountered in the FEN beside fixing the column adjustment
          --j;
        }
        else{                         // if the character isnt a / or a number, then it must be a piece
          board[(8*(i-1))+j]=chess.fen[counter];
        }
        counter++;
      }
    }
    document.getElementById("footer").innerHTML = chess.pgn.slice(chess.pgn.indexOf("1.",20), chess.pgn.length); //print out the correct solution to the puzzle
    convPGNtoMOV(chess.pgn);
    if(chess.pgn.includes("=") || chess.pgn.includes("threat") ||chess.pgn.includes("(") || chess.pgn.includes("$")){
      if(confirm("Puzzle request gave an invalid puzzle. Press ok to find a new one shortly or cancel and enter your own.")){
        setTimeout(()=> { location.reload(); }, 20000);
      }else{
        for(var i=0; i <64;++i){
          board[i] = "0";
          initBoard(board);
        }
      }

    }
    else{
      initBoard(board);
      createButtons(MOV);
      totalStep = MOVarray.length-1;
      console.log("Total Steps: " + totalStep);
      document.getElementById("stepCounter").innerHTML =`Currently on step: ${step+1} / ${MOVarray.length-1}`
    }
  })
}


function initBoard(x){
  var cellid = 1;
  for(var row = 1; row <= 8 ; ++row){
    for(var column = 1; column <= 8; ++column){
      //document.getElementById(`${cellId}`).innerHTML = x[cellId];
      if(x[cellid] == "p")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png" />'   //black pawn
      else if(x[cellid] == "P")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png" />'   //white pawn
      else if(x[cellid] == "k")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png" />'   //black king
      else if(x[cellid] == "K")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png" />'   //white king
      else if(x[cellid] == "q")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png" />'   //black queen
      else if(x[cellid] == "Q")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png" />'   //white queen
      else if(x[cellid] == "n")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png" />'   //black knight
      else if(x[cellid] == "N")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png" />'   //white knight
      else if(x[cellid] == "r")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png" />'   //black rook
      else if(x[cellid] == "R")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png" />'   //white rook
      else if(x[cellid] == "b")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png" />'   //black bishop
      else if(x[cellid] == "B")document.getElementById(`${cellid}`).innerHTML = '<img src="images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png" />'   //white bishop
      else if(x[cellid] == "0")document.getElementById(`${cellid}`).innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">'   //empty square
      ++cellid;
    }
  }
}
function createButtons(order){
  for(var iterator = 1; iterator <= 64; ++iterator){
    document.getElementById(`${iterator}`).onclick = function(x){

      //setting a background color for squares that are clicked
      //if a square with a piece is clicked, then the path is different than a square without an image. The first element of the path will have a source
      //so I'm using that to determine whether or not there is a piece on the square.

      if(x.path[0].src){
        if(clicks == 0 && board[x.path[1].id] != "0"){

          sqOneColor = x.path[1].style.backgroundColor;
          x.path[1].style.backgroundColor = "#b6fce4";
          sqOne = x.path[1].id;
          ++clicks;
        }
        else{
          sqTwo = x.path[1].id;
          clicks = 0;
          if(document.getElementById(`${sqOne}`).className == "dark"){
            document.getElementById(`${sqOne}`).style.backgroundColor = "#5b829c"
          }
          if(document.getElementById(`${sqOne}`).className == "light"){
            document.getElementById(`${sqOne}`).style.backgroundColor = "#ffffff"
          }
          if(document.getElementById(`${sqTwo}`).className == "dark"){
            document.getElementById(`${sqTwo}`).style.backgroundColor = "#5b829c"
          }
          if(document.getElementById(`${sqTwo}`).className == "light"){
            document.getElementById(`${sqTwo}`).style.backgroundColor = "#ffffff"
          }
          console.log(sqOne);
          console.log(sqTwo);
        checker(sqOne,sqTwo,MOVarray);
        }
      }
      //rest of work below sets click colors to squares with no image
      else{
        if(clicks == 0){
          sqOneColor = x.target.style.backgroundColor;
          x.target.style.backgroundColor = "#b6fce4";
          sqOne = x.target.id;
          ++clicks;
        }
        else{
          sqTwo = x.target.id;
          clicks = 0;

          if(document.getElementById(`${sqOne}`).className == "dark"){
            document.getElementById(`${sqOne}`).style.backgroundColor = "#5b829c"
          }
          if(document.getElementById(`${sqOne}`).className == "light"){
            document.getElementById(`${sqOne}`).style.backgroundColor = "#ffffff"
          }
          if(document.getElementById(`${sqTwo}`).className == "dark"){
            document.getElementById(`${sqTwo}`).style.backgroundColor = "#808080"
          }
          if(document.getElementById(`${sqTwo}`).className == "light"){
            document.getElementById(`${sqTwo}`).style.backgroundColor = "#5b9c6f"
          }
          console.log(sqOne);
          console.log(sqTwo);
          checker(sqOne,sqTwo,MOVarray);

          
        }
      }
    }
  }
}

//function to convert FEN format to a move order based on this square implementation
//EX: 
function convPGNtoMOV(s){

  var crude = s.substr(s.indexOf("1.",20),s.length);
  //var MOVcounter = 1;
  var MoveOrder;
  if(chess.fen.includes("b")){
    MoveOrder = true;
  }else{
    MoveOrder = false;
  }
  for(var u = 1; u<=crude.length-1;++u){  //parse through the crude string of moves and only add the pieces and squares that they move to
    if(u>4 && crude[u] == ".") MOV = MOV.slice(0,-2);
    if((crude[u] != "x") && (crude[u] != ".") && (crude[u] != " ") && (crude[u] != "+") && (crude[u] != "#")&& (crude[u] != "\n") && !Number(crude[u])){
        MOV += crude[u];
      }

    else if(Number(crude[u]) && crude[u+1] != "="){
      MOV += crude[u] + " ";
    }
    if(crude[u] == "#"){
      u = crude.length-1;
    }
  }
  refine(MOV, MoveOrder);
  console.log("Current MOV: " + MOV);
  console.log("Current MOVarray: " + MOVarray);

}
//function to format the order string into something more readable;;; len-4 = last character ; len-3 = " "
function refine(initOrder, bturn){
  MOVarray = initOrder.split(" ");
  for(var index = 0; index<MOVarray.length-1; ++index){
    if(MOVarray[index][0] == MOVarray[index][0].toLowerCase()){
      //pawn moves are denoted by a lower case letter indicating whatever column the pawn is on as the first character
      if(MOVarray[index][MOVarray[index].length-2] == "a"){
        MOVarray[index] = "P" + `${65 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "b"){
        MOVarray[index] = "P" + `${66 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "c"){
        MOVarray[index] = "P" + `${67 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "d"){
        MOVarray[index] = "P" + `${68 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "e"){
        MOVarray[index] = "P" + `${69 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "f"){
        MOVarray[index] = "P" + `${70 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "g"){
        MOVarray[index] = "P" + `${71 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "h"){
        MOVarray[index] = "P" + `${72 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
    }
    if(MOVarray[index][0] == MOVarray[index][0].toUpperCase()){
      if(MOVarray[index][MOVarray[index].length-2] == "a"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${65 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "b"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${66 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "c"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${67 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "d"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${68 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "e"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${69 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "f"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${70 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "g"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${71 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
      if(MOVarray[index][MOVarray[index].length-2] == "h"){
        MOVarray[index] = `${MOVarray[index][0]}` + `${72 - 8*Number(MOVarray[index][MOVarray[index].length-1])}`;
      }
    }
  }
}



function checker(src,dest,order){
  console.log(board[src] + dest);
  if(toMove == "b" && (board[src]==board[src].toUpperCase(board[src]))){
    console.log("Incorrect move");
  }
  else if(toMove == "w" && (board[src]==board[src].toLowerCase(board[src]))){
    console.log("Incorrect move");
  }
  else if(order[step]== `${board[src].toUpperCase(board[src])}` + dest){ //check if the move matches the move on the movelist
    console.log("You chose the correct move");
    ++step;
    board[dest] = `${board[src]}`;
    board[src] = "0"
    initBoard(board);
    if(toMove == "w"){
      toMove = "b"
      document.getElementById("turnDisplay").innerHTML = "BLACK TO MOVE";
    }else{
      toMove = "w"
      document.getElementById("turnDisplay").innerHTML = "WHITE TO MOVE";
    }
    if(step+1>totalStep){

      location.reload();
    }
    else{
      document.getElementById("stepCounter").innerHTML =`Currently on step: ${step+1} / ${MOVarray.length-1}`
    }
  }
  else{
    console.log("Incorrect move");
  }
}

function showFooter(){
  document.getElementById("footer").style.visibility = "visible"
}

//NOT WORKING AT THE MOMENT
function showValidMoves(pos){
  var col = pos%8;
  var row = Math.ceil(pos/8);
  piece = board[pos];
  valmove = new Array;
  //below are all of the valid moves for any chess piece


  //setting colors for the moves:
  if(clicks == 0){
    //PAWN MOVES
    if(piece == "p" && row == 2){ //unmoved black pawn

    }
    else if( piece == "p"){ //moved black pawn

    }
    else if (piece == "P" && row == 7){ //unmoved white pawn

    }
    else if(piece=="P"){  //white pawn

    }

    // ROOK MOVES (move from the piece outward)
    if(piece.toUpperCase(piece) == "R"){

    }

    //Bishop Moves
    if(piece.toUpperCase(piece) == "B"){
      
    }

    //Knight Moves
    if(piece.toLowerCase(piece) == "N"){
      
    }
    
    //Queen Moves
    if(piece.toUpperCase(piece) == "Q"){
      
    }

    //King Moves
    if(piece.toLowerCase(piece) == "K"){
      
    }
  }
}