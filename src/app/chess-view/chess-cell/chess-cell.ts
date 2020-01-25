import {Alphabet} from '../../algorithms/alphabet';

export interface ChessCell {
  id: number;
  originalValue: Alphabet;
  predictedValue: Alphabet;
  accuracy: number;
}

