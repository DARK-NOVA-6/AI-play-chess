var board = null
var $board = $('#myBoard')
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var player = 'w'
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
var squareClass = 'square-55d63'
var selectedSquare = null
var url = 'http://172.25.1.141:3200/predict'
var model_name = 'tune'


 function callAjax(fen){
    turn = !(player == 'w')
    var return_first = function () {
      var tmp = null;
      $.ajax({
          'async': true,
          'type': "POST",
          'global': true,
          'url': url,
          'data':  { 'fen': fen, 'player': turn, 'model': model_name},
          'success': function (data) {
              callback(data)
          }
      });
      return tmp;
      }();
    return return_first
}

function callback(result){
    console.log(result);
    $('#think').css('visibility','hidden')
    from = result.substring(0, 2)
    to = result.substring(2, 4)
    newMove = from + to
    game.move({from:from, to:to, promotion:'q'})
    board.position(game.fen())
    removeHighlights()
    addHighlights(from, to)
    updateStatus()
}

function makeMove() {
    console.log('hello');
    $('#think').css('visibility','visible')
    fen = game.fen()
    callAjax(fen)
}

function removeGreySquares (flag) {
  if(flag)
    $('#myBoard .square-55d63').css('background', '')
  
  else if(selectedSquare === null)
    $('#myBoard .square-55d63').css('background', '')
  
}

function greySquare (square, flag) {
    var $square = $('#myBoard .square-' + square)
  
    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey
    }
    if(flag)
      $square.css('background', background)
    else if(selectedSquare === null)
      $square.css('background', background)
}
  

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1) || 
        (game.turn() !== player)) {
        return false
    }
}

function removeHighlights () {
    $board.find('.' + squareClass)
      .removeClass('highlight')
}
  
function addHighlights(source, target){
    $board.find('.square-' + source).addClass('highlight')
    $board.find('.square-' + target).addClass('highlight')
}

function onDrop (source, target) {
    removeGreySquares()

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
    updateStatus()
    removeHighlights()
    addHighlights(source, target)
    selectedSquare = null
    removeGreySquares(true)
    $board.find('.selected').removeClass('selected')
    if(game.game_over()) return
    window.setTimeout(makeMove,200)
}

function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    })
  
    // exit if there are no moves available for this square
    if (moves.length === 0) return
  
    // highlight the square they moused over
    if(player !== game.turn()) return
    greySquare(square)
  
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}
function onMouseoutSquare (square, piece) {
    removeGreySquares()
}
  

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  showNotation: true,
  position: 'start',
  orientation: 'white',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
}

board = Chessboard('myBoard', config)
updateStatus()


// Show the color selection popup when the page is loaded
$(document).ready(function() {
  $('#colorSelectPopup').css('display' , 'block')
});

// Event listener for the toggle button to choose the color
$('#toggleColorBtn').on('click', function () {
  $('#colorSelectPopup').css('display' , 'block')
});

$('#restartBtn').on('click', function () {
  board = Chessboard('myBoard', config)
  game.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

  if (player === 'b') {
    window.setTimeout(makeMove, 250)
  }
  updateStatus();
});

// Event listener for the "Start Game" button in the popup
$('#startGameBtn').on('click', function () {
  board = Chessboard('myBoard', config)
  game.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  if (player === 'b') {
    window.setTimeout(makeMove, 250)
  }
  updateStatus();
  $('#colorSelectPopup').css('display','none')
  $board.find('.' + squareClass).mousedown((e) => onSquareClick(e))
});

// Event listener for the "Start Game" button in the popup
$('#cancelGameBtn').on('click', function () {
  $('#colorSelectPopup').css('display','none')
});


function onSquareClick(e) {
  var square = e.currentTarget.getAttribute('data-square')

  if (selectedSquare === null) {
    if($(e.currentTarget).children().length > 0 && 
       $(e.currentTarget).find('img').data('piece').substring(0 , 1) === player){
        // If no square is currently selected, mark this square as the selected square
        selectedSquare = square
        $board.find('.square-' + square).addClass('selected')
        greySquare(selectedSquare, true)
    }
  } else {

    // If a square is already selected, try to make the move
    var move = game.move({
      from: selectedSquare,
      to: square,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // Check if the move is legal
    if (move !== null) {
      // If the move is legal, update the board and reset the selected square
      board.position(game.fen())
      removeHighlights()
      addHighlights(selectedSquare, square)
      removeGreySquares(true)
      $board.find('.selected').removeClass('selected')
      selectedSquare = null
      if(game.game_over()) return
      window.setTimeout(makeMove, 200)
    }else {
      selectedSquare = null
      removeGreySquares(true)
      $board.find('.selected').removeClass('selected')
    }

    // Remove the selected class from all squares

    // Update the status after the move attempt (whether it was legal or not)
    updateStatus();
  }
}


$(document).ready(()=>{
  
  $(function() {
    $('.color')
    .find('input[type=radio]')
    .change(function(e) {
          $('#btnradioblackl').removeClass('btn-lg')
          $('#btnradiowhitel').removeClass('btn-lg')
          $('#btnradioblackl').removeClass('btn-sm')
          $('#btnradiowhitel').removeClass('btn-sm')

          if(this.id == 'btnradioblack'){
            $('#btnradioblackl').addClass('btn-lg')
            $('#btnradiowhitel').addClass('btn-sm')
            player = 'b'
            config.orientation = 'black'
          }
          else{
            $('#btnradiowhitel').addClass('btn-lg')
            $('#btnradioblackl').addClass('btn-sm')
            player = 'w'
          config.orientation = 'white'
          }
      });
      
      $('.model_name')
      .find('input[type=radio]')
      .change(function(e) {
        if(this.id == 'btnradio1')
          model_name = 'no_tune'
        else if(this.id == 'btnradio2')
          model_name = 'tune'
        else if(this.id == 'btnradio3')
          model_name = 'freeze'
        else 
          model_name = 'tree'
        console.log(model_name);
      });
  });

  $('#btnradiowhite').prop('checked', true)
  $('#btnradio4').prop('checked', true)
  $('#btnradiowhitel').addClass('btn-lg')
  $('#btnradioblackl').addClass('btn-sm')
})