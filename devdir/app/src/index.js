import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
      return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                key={i}
            />;
    }
  
    render() {
      const boradSquares = [[0,1,2],[3,4,5],[6,7,8]];
      return (
        <div>
          {
            boradSquares.map((rowSquares, i)=> {
              return(
                <div className="board-row" key={i}>
                  {
                    rowSquares.map((square)=>{
                      return(
                        this.renderSquare(square)
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length -1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O'
      this.setState({
        history: history.concat([{
          squares: squares,
          col: (i % 3) +1,
          row: Math.floor(i/3) + 1,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
  
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const decs = move ?
          `Go to move #${move} (col: ${step.col}, row:${step.row})`:
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              { move === this.state.stepNumber ? <strong>{decs}</strong> : decs }
            </button>
          </li>
        );
      });

      let status;
      if(winner){
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O'); 
      }

      const orderButton = `ASC <-> DES`;

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick ={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button>{orderButton}</button></div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  