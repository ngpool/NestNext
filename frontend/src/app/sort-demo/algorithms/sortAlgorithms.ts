// ソートアルゴリズムの型定義
export type SortFunction = (arr: number[]) => Generator<number[], void, unknown>;

// バブルソート
export function* bubbleSort(arr: number[]): Generator<number[], void, unknown> {
  const numbers = [...arr];
  const len = numbers.length;
  
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (numbers[j] > numbers[j + 1]) {
        [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
        yield [...numbers];
      }
    }
  }
}

// クイックソート
export function* quickSort(arr: number[]): Generator<number[], void, unknown> {
  const numbers = [...arr];
  
  function* quickSortHelper(low: number, high: number): Generator<number[], void, unknown> {
    if (low < high) {
      const pivot = numbers[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        if (numbers[j] <= pivot) {
          i++;
          [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
          yield [...numbers];
        }
      }
      
      [numbers[i + 1], numbers[high]] = [numbers[high], numbers[i + 1]];
      yield [...numbers];
      
      yield* quickSortHelper(low, i);
      yield* quickSortHelper(i + 2, high);
    }
  }
  
  yield* quickSortHelper(0, numbers.length - 1);
}

// 選択ソート
export function* selectionSort(arr: number[]): Generator<number[], void, unknown> {
  const numbers = [...arr];
  const len = numbers.length;
  
  for (let i = 0; i < len - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < len; j++) {
      if (numbers[j] < numbers[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [numbers[i], numbers[minIdx]] = [numbers[minIdx], numbers[i]];
      yield [...numbers];
    }
  }
}

// 挿入ソート
export function* insertionSort(arr: number[]): Generator<number[], void, unknown> {
  const numbers = [...arr];
  const len = numbers.length;
  
  for (let i = 1; i < len; i++) {
    const key = numbers[i];
    let j = i - 1;
    while (j >= 0 && numbers[j] > key) {
      numbers[j + 1] = numbers[j];
      j--;
      yield [...numbers];
    }
    numbers[j + 1] = key;
    yield [...numbers];
  }
}