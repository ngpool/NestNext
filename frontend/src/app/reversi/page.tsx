"use client";
import React, { useState, useEffect } from "react";

const ReversiGame = () => {
  // ボードのサイズ（8x8）
  const BOARD_SIZE = 8;

  // ゲームの状態
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const [validMoves, setValidMoves] = useState({});
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [flipAnimations, setFlipAnimations] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

  // ゲームの初期化
  useEffect(() => {
    initializeGame();
  }, []);

  // ゲームの初期化関数
  const initializeGame = () => {
    // 空のボードを作成
    const newBoard = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(null));

    // 初期配置（中央の4マス）
    newBoard[3][3] = "white";
    newBoard[3][4] = "black";
    newBoard[4][3] = "black";
    newBoard[4][4] = "white";

    setBoard(newBoard);
    setCurrentPlayer("black");
    setGameOver(false);
    setScores({ black: 2, white: 2 });
    setGameMessage("黒の番です");
    setFlipAnimations([]);
    setLastMove(null);
    setHoverCell(null);

    // 有効な手を計算
    const moves = findValidMoves(newBoard, "black");
    setValidMoves(moves);
  };

  // 有効な手を見つける関数
  const findValidMoves = (board, player) => {
    const opponent = player === "black" ? "white" : "black";
    const moves = {};

    // 各セルを確認
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // 空のセルのみ確認
        if (board[row][col] !== null) continue;

        // 全方向をチェック
        const directions = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];

        let isValidMove = false;
        const flips = [];

        for (const [dx, dy] of directions) {
          let x = row + dx;
          let y = col + dy;
          const toFlip = [];

          // 隣接するセルが相手の石か確認
          if (
            x >= 0 &&
            x < BOARD_SIZE &&
            y >= 0 &&
            y < BOARD_SIZE &&
            board[x][y] === opponent
          ) {
            toFlip.push([x, y]);
            x += dx;
            y += dy;

            // その方向に進み続ける
            while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
              if (board[x][y] === null) break;
              if (board[x][y] === player) {
                isValidMove = true;
                flips.push(...toFlip);
                break;
              }
              toFlip.push([x, y]);
              x += dx;
              y += dy;
            }
          }
        }

        if (isValidMove) {
          moves[`${row},${col}`] = flips;
        }
      }
    }

    return moves;
  };

  // プレイヤーの手を処理する関数
  const handleMove = (row, col) => {
    if (gameOver) return;

    const moveKey = `${row},${col}`;
    if (!validMoves[moveKey]) return;

    // 最後の手を記録
    setLastMove([row, col]);

    // 新しいボードを作成
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;

    // アニメーション用に石をひっくり返すリストをセット
    const flipsWithDelay = validMoves[moveKey].map((pos, index) => ({
      row: pos[0],
      col: pos[1],
      delay: (index + 1) * 100, // 各石に少しずつ遅延をつける
      color: currentPlayer,
    }));

    setFlipAnimations(flipsWithDelay);

    // ボードを更新する前にアニメーションを実行
    setTimeout(() => {
      // 石をひっくり返す
      for (const [flipRow, flipCol] of validMoves[moveKey]) {
        newBoard[flipRow][flipCol] = currentPlayer;
      }

      // ボードを更新
      setBoard(newBoard);

      // スコアを計算
      const newScores = calculateScores(newBoard);
      setScores(newScores);

      // プレイヤーを切り替え
      const nextPlayer = currentPlayer === "black" ? "white" : "black";

      // 次のプレイヤーの有効な手を確認
      const nextMoves = findValidMoves(newBoard, nextPlayer);

      if (Object.keys(nextMoves).length > 0) {
        // 次のプレイヤーが打てる手がある場合
        setCurrentPlayer(nextPlayer);
        setValidMoves(nextMoves);
        setGameMessage(`${nextPlayer === "black" ? "黒" : "白"}の番です`);
      } else {
        // 次のプレイヤーが打てる手がない場合
        const currentPlayerMoves = findValidMoves(newBoard, currentPlayer);

        if (Object.keys(currentPlayerMoves).length > 0) {
          // 現在のプレイヤーがまだ打てる手がある場合、スキップ
          setValidMoves(currentPlayerMoves);
          setGameMessage(
            `${nextPlayer === "black" ? "白" : "黒"}はパスです。${
              currentPlayer === "black" ? "黒" : "白"
            }の番です`
          );
        } else {
          // 両プレイヤーが打てない場合、ゲーム終了
          setGameOver(true);
          setValidMoves({});

          if (newScores.black > newScores.white) {
            setGameMessage("黒の勝ちです！");
          } else if (newScores.white > newScores.black) {
            setGameMessage("白の勝ちです！");
          } else {
            setGameMessage("引き分けです！");
          }
        }
      }

      // アニメーションをクリア
      setFlipAnimations([]);
      // ホバーセルをクリア
      setHoverCell(null);
    }, flipsWithDelay.length * 100 + 300); // すべての石が反転するのを待つ
  };

  // スコアを計算する関数
  const calculateScores = (board) => {
    let black = 0;
    let white = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === "black") black++;
        if (board[row][col] === "white") white++;
      }
    }

    return { black, white };
  };

  // セルの背景色を決定
  const getCellStyle = (row, col) => {
    const isValidMove = validMoves[`${row},${col}`];
    const isLastMove = lastMove && lastMove[0] === row && lastMove[1] === col;
    const isHovered = hoverCell && hoverCell[0] === row && hoverCell[1] === col;

    // 予測表示で反転する石の場合
    const isPredicted =
      hoverCell &&
      validMoves[`${hoverCell[0]},${hoverCell[1]}`] &&
      validMoves[`${hoverCell[0]},${hoverCell[1]}`].some(
        ([r, c]) => r === row && c === col
      );

    let bgColor = "#334155"; // デフォルト色

    if (isHovered) {
      bgColor = "#1e40af"; // ホバー中のセル
    } else if (isPredicted) {
      bgColor = "#3b82f6"; // 反転予測の石
    } else if (isLastMove) {
      bgColor = "#2c5282"; // 最後に置いた石
    } else if (isValidMove) {
      bgColor = "#4a5568"; // 有効な手
    }

    return {
      backgroundColor: bgColor,
      cursor: isValidMove ? "pointer" : "default",
      transition: "background-color 0.3s ease",
    };
  };

  // 石の反転アニメーションが進行中かどうかを確認
  const isFlipping = (row, col) => {
    return flipAnimations.some((anim) => anim.row === row && anim.col === col);
  };

  // アニメーション情報を取得
  const getFlipAnimation = (row, col) => {
    return flipAnimations.find((anim) => anim.row === row && anim.col === col);
  };

  // ホバー状態を処理
  const handleMouseEnter = (row, col) => {
    const moveKey = `${row},${col}`;
    if (validMoves[moveKey]) {
      setHoverCell([row, col]);
    }
  };

  const handleMouseLeave = () => {
    setHoverCell(null);
  };

  // 予測表示で置かれる石かどうか
  const isPredictedPlacement = (row, col) => {
    return hoverCell && hoverCell[0] === row && hoverCell[1] === col;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">リバーシゲーム</h1>

      <div className="mb-4 flex justify-between w-full max-w-md">
        <div
          className={`flex items-center p-2 rounded ${
            currentPlayer === "black" ? "bg-gray-700" : ""
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
          <span className="mr-1">黒:</span>
          <span className="font-bold">{scores.black}</span>
        </div>

        <div>
          <button
            onClick={initializeGame}
            className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
          >
            リセット
          </button>
        </div>

        <div
          className={`flex items-center p-2 rounded ${
            currentPlayer === "white" ? "bg-gray-700" : ""
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white mr-2"></div>
          <span className="mr-1">白:</span>
          <span className="font-bold">{scores.white}</span>
        </div>
      </div>

      <div className="text-lg mb-4 h-6 transition-all duration-300 ease-in-out">
        {gameMessage}
      </div>

      <div className="grid grid-cols-9 gap-px bg-gray-600 p-px rounded overflow-hidden shadow-lg">
        {/* 列ヘッダー */}
        <div className="bg-gray-800 w-8 h-8 flex items-center justify-center"></div>
        {Array(BOARD_SIZE)
          .fill()
          .map((_, i) => (
            <div
              key={`col-${i}`}
              className="bg-gray-800 w-8 h-8 flex items-center justify-center"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}

        {/* ボード */}
        {board.map((row, rowIdx) => (
          <React.Fragment key={`row-${rowIdx}`}>
            {/* 行ヘッダー */}
            <div className="bg-gray-800 w-8 h-8 flex items-center justify-center">
              {rowIdx + 1}
            </div>

            {/* セル */}
            {row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className="w-8 h-8 flex items-center justify-center relative"
                style={getCellStyle(rowIdx, colIdx)}
                onClick={() => handleMove(rowIdx, colIdx)}
                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                onMouseLeave={handleMouseLeave}
              >
                {/* 既存の石または反転中の石 */}
                {(cell || isFlipping(rowIdx, colIdx)) && (
                  <div
                    className={`w-6 h-6 rounded-full shadow-inner transform transition-all duration-300 ease-in-out
                                ${
                                  isFlipping(rowIdx, colIdx)
                                    ? "animate-flip"
                                    : ""
                                }`}
                    style={{
                      backgroundColor: isFlipping(rowIdx, colIdx)
                        ? board[rowIdx][colIdx] ===
                          getFlipAnimation(rowIdx, colIdx).color
                          ? board[rowIdx][colIdx] === "black"
                            ? "white"
                            : "black"
                          : getFlipAnimation(rowIdx, colIdx).color
                        : cell,
                      boxShadow:
                        (isFlipping(rowIdx, colIdx)
                          ? getFlipAnimation(rowIdx, colIdx).color
                          : cell) === "black"
                          ? "inset 1px 1px 2px rgba(255, 255, 255, 0.2), inset -1px -1px 2px rgba(0, 0, 0, 0.5)"
                          : "inset 1px 1px 2px rgba(255, 255, 255, 0.7), inset -1px -1px 2px rgba(0, 0, 0, 0.2)",
                      animationDelay: isFlipping(rowIdx, colIdx)
                        ? `${getFlipAnimation(rowIdx, colIdx).delay}ms`
                        : "0ms",
                      transform: isFlipping(rowIdx, colIdx)
                        ? "rotateY(90deg)"
                        : "rotateY(0deg)",
                      zIndex: 5,
                    }}
                  >
                    {/* ハイライト効果 */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "30%",
                        height: "30%",
                        top: "20%",
                        left: "20%",
                        background:
                          (isFlipping(rowIdx, colIdx)
                            ? getFlipAnimation(rowIdx, colIdx).color
                            : cell) === "black"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.8)",
                        filter: "blur(1px)",
                      }}
                    />
                  </div>
                )}

                {/* 予測表示の石（ホバー時のみ） */}
                {!cell &&
                  (isPredictedPlacement(rowIdx, colIdx) ||
                    (hoverCell &&
                      validMoves[`${hoverCell[0]},${hoverCell[1]}`] &&
                      validMoves[`${hoverCell[0]},${hoverCell[1]}`].some(
                        ([r, c]) => r === rowIdx && c === colIdx
                      ))) && (
                    <div
                      className="w-6 h-6 rounded-full shadow-inner absolute z-0"
                      style={{
                        backgroundColor: isPredictedPlacement(rowIdx, colIdx)
                          ? currentPlayer
                          : currentPlayer === "black"
                          ? "black"
                          : "white",
                        opacity: isPredictedPlacement(rowIdx, colIdx)
                          ? 0.7
                          : 0.5,
                        boxShadow:
                          currentPlayer === "black"
                            ? "inset 1px 1px 2px rgba(255, 255, 255, 0.2), inset -1px -1px 2px rgba(0, 0, 0, 0.5)"
                            : "inset 1px 1px 2px rgba(255, 255, 255, 0.7), inset -1px -1px 2px rgba(0, 0, 0, 0.2)",
                        zIndex: 2,
                        border: isPredictedPlacement(rowIdx, colIdx)
                          ? "none"
                          : "2px dashed yellow",
                      }}
                    >
                      {/* ハイライト効果 */}
                      {isPredictedPlacement(rowIdx, colIdx) && (
                        <div
                          className="absolute rounded-full"
                          style={{
                            width: "30%",
                            height: "30%",
                            top: "20%",
                            left: "20%",
                            background:
                              currentPlayer === "black"
                                ? "rgba(255, 255, 255, 0.2)"
                                : "rgba(255, 255, 255, 0.8)",
                            filter: "blur(1px)",
                          }}
                        />
                      )}
                    </div>
                  )}

                {/* 有効な手の表示 */}
                {validMoves[`${rowIdx},${colIdx}`] && !cell && !hoverCell && (
                  <div className="w-2 h-2 rounded-full bg-gray-400 opacity-60 animate-pulse"></div>
                )}

                {/* 予測表示の数字（何個の石が反転するか） */}
                {isPredictedPlacement(rowIdx, colIdx) &&
                  validMoves[`${rowIdx},${colIdx}`] && (
                    <div className="absolute top-0 right-0 text-xs font-bold bg-yellow-500 text-black rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1 -translate-y-1 z-10">
                      {validMoves[`${rowIdx},${colIdx}`].length}
                    </div>
                  )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* ゲーム説明 */}
      {!gameOver && (
        <div className="mt-4 text-sm text-gray-300 max-w-md text-center">
          <p>有効な手にマウスを合わせると、反転する石が表示されます。</p>
          <p>黄色い数字は反転する石の数です。</p>
        </div>
      )}

      {gameOver && (
        <button
          onClick={initializeGame}
          className="mt-6 px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition transform hover:scale-105 active:scale-95"
        >
          新しいゲームを始める
        </button>
      )}

      <style jsx global>{`
        @keyframes flip {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
        .animate-flip {
          animation: flip 0.6s ease-in-out forwards;
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ReversiGame;
