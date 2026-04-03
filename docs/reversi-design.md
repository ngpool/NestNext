# reversi（オセロゲーム）設計

対象ファイル: `frontend/src/app/reversi/page.tsx`

## 1. 目的

- 8x8 のオセロをブラウザ上で実装する
- 合法手のハイライト
- 石を反転させる簡易アニメーション
- 同一端末内でプレイヤー交代・パス・ゲーム終了まで完結

## 2. 状態（State）

### 2.1 盤面

- `BOARD_SIZE = 8`
- `Board = (Stone | null)[][]`
- `Stone = "black" | "white"`

盤面要素:

- `null`: 空
- `"black"` / `"white"`: 石

### 2.2 現在プレイヤー

- `"black"` / `"white"`

### 2.3 合法手（有効手）

- `ValidMoves = Record<string, Position[]>`
- `key = "<row>,<col>"`
- `Position = [row, col]`
- 値は「置いたときに反転する座標の一覧」

## 3. 合法手計算（findValidMoves）

入力:

- `board: Board`
- `player: Stone`（着手側）

処理方針:

1. 各セル `(row, col)` を走査（空セルだけ対象）
2. 8方向 `directions` を用意
3. 各方向について:
   - 隣のセルが相手石なら、同方向に進めるだけ進行
   - `player` の石に到達したら「反転が成立」とみなす
   - 反転座標を `flips` に蓄積
4. 成立したセルは `moves["<row>,<col>"] = flips`

戻り値:

- 置ける座標群と反転座標群

## 4. 手の処理（handleMove）

入力:

- `row: number`
- `col: number`

処理方針:

1. ゲーム終了なら何もしない
2. `validMoves["<row>,<col>"]` が存在しないなら無視
3. 最後の手として `lastMove = [row, col]` を記録
4. 盤面コピーを作成し、反転アニメーション情報 `flipAnimations` を生成
   - `flipAnimations`: `{ row, col, delay, color }[]`
   - delay は index から算出（簡易同期）
5. `setTimeout` でアニメ完了後に:
   - `validMoves[moveKey]` にある座標を `currentPlayer` に置換
   - `calculateScores()` でスコア更新
   - 次手の合法手を `findValidMoves()` で再計算
   - 次手が無ければパス、それも無ければゲーム終了
6. `flipAnimations` と `hoverCell` をクリア

## 5. 表示ロジック（レンダリング）

- 合法手: `validMoves["row,col"]` が存在するセルに対してスタイルを変更
- ホバー予測:
  - `hoverCell` がある場合、当該座標の `validMoves` を参照して予測表示
- 反転中:
  - `flipAnimations` に含まれるセルは `isFlipping()` が true になり、
    `backgroundColor` / `animationDelay` / `transform` を適用

## 6. 永続化・通信

- 現状はサーバ通信なし（完全にクライアント state）
- 将来的に対戦/同期が必要なら WebSocket やサーバ側ゲームロジック化が候補

