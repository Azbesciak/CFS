import {Classifier} from '../classifier';
import {Alphabet} from '../alphabet';

export type MessageType = [Alphabet, Alphabet];

export class Message {
  static readonly OUTPUT_INTERNAL_TYPE: MessageType = [Alphabet.Zero, Alphabet.One];
  static readonly INPUT_INTERNAL_TYPE: MessageType = [Alphabet.One, Alphabet.One];
  static readonly OUTPUT_EXTERNAL_TYPE: MessageType = [Alphabet.Zero, Alphabet.Zero];
  static readonly INPUT_EXTERNAL_TYPE: MessageType = [Alphabet.One, Alphabet.Zero];
  static readonly MESSAGE_PREFIX_LENGTH = 2;
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

  use() {
    this._wasUsed = true;
  }
}
