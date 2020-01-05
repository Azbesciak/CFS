import {Alphabet, Classifier} from './classifier';

const COORD_LEN = 3;
export type MessageType = [Alphabet, Alphabet];

export class Message {
  static readonly OUTPUT_INTERNAL_TYPE: MessageType = [Alphabet.Zero, Alphabet.One];
  static readonly INPUT_INTERNAL_TYPE: MessageType = [Alphabet.One, Alphabet.One];
  static readonly OUTPUT_EXTERNAL_TYPE: MessageType = [Alphabet.Zero, Alphabet.Zero];
  static readonly INPUT_EXTERNAL_TYPE: MessageType = [Alphabet.One, Alphabet.Zero];
  static readonly MESSAGE_LENGTH = 8;
  private _wasUsed = false;

  constructor(readonly value: Alphabet[], readonly classifier?: Classifier) {
  }

  get size() {
    return this.value.length;
  }

  static isMessageOfType(message: Alphabet[], type: MessageType): boolean {
    return message[0] === type[0] && message[1] === type[1];
  }

  static makeAsMessageOfType(message: Alphabet[], type: MessageType) {
    message[0] = type[0];
    message[1] = type[1];
  }


  get wasUsed() {
    return this._wasUsed;
  }

  private static numberToBinary(value: number): Alphabet[] {
    const word = value.toString(2).split('') as Alphabet[];
    while (word.length < COORD_LEN) {
      word.unshift(Alphabet.Zero);
    }
    return word;
  }

  static fromCoords(x: number, y: number) {
    const xBinary = Message.numberToBinary(x);
    const yBinary = Message.numberToBinary(y);
    return new Message([...Message.INPUT_EXTERNAL_TYPE, ...xBinary, ...yBinary]);
  }

  use() {
    this._wasUsed = true;
  }
}
