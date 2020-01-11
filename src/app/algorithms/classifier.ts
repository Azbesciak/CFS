import {breed, primitiveArrayEquals, randomArrayMutate, randomArrayOfValues} from './utils';
import {Message} from './message/message';
import {ALPHABET, Alphabet} from './alphabet';

export interface ClassifierView {
  index: number;
  condition: string;
  action: string;
  strength: number;
  specifity: number;
}

export class Classifier {
  static classifiersNumber: number;
  private _strength = 1;
  private active = false;
  private readonly specifity: number;
  private readonly messages: Message[] = [];
  readonly classifierIndex = Classifier.classifiersNumber++;
  private _bid: number;
  private _lived = 0;
  private _view: ClassifierView;

  get view(): ClassifierView {
    if (!this._view)
      this._view = {
        action: this.action.join(""),
        condition: this.condition.join(""),
        index: this.classifierIndex,
        specifity: this.specifity,
        strength: this._strength
      };
    return this._view;
  }

  get strength() {
    return this._strength;
  }

  get bid() {
    return this._strength * this.specifity;
  }

  get bidAmount() {
    return this._bid;
  }

  private constructor(
    private condition: Alphabet[],
    private action: Alphabet[]
  ) {
    this.specifity = Classifier.calculateSpecifity(condition);
  }

  static fromLengths(conditionLen: number, actionLen: number): Classifier {
    let actions = randomArrayOfValues(ALPHABET, actionLen);
    Message.makeAsMessageOfType(actions, Message.INPUT_INTERNAL_TYPE);
    return new Classifier(randomArrayOfValues(ALPHABET, conditionLen), actions);
  }

  static equal(c1: Classifier, c2: Classifier): boolean {
    if (c1 === c2 || !c1 && !c2) {
      return true;
    }
    if (!c1 || !c2) {
      return false;
    }
    return c1 instanceof Classifier &&
      c2 instanceof Classifier &&
      primitiveArrayEquals(c1.action, c2.action) &&
      primitiveArrayEquals(c1.condition, c2.condition);
  }

  private static calculateSpecifity(condition: Alphabet[]): number {
    let counter = 0;
    for (const c of condition) {
      if (c === Alphabet.PassThrough) {
        ++counter;
      }
    }
    return (condition.length - counter) / condition.length;
  }

  newEpoch() {
    ++this._lived;
  }


  payBid(k: number, tax: number): number {
    this._bid = this.bid * k;
    // this._strength -= this._bid;
    // this._strength -= this._strength * tax
    return this._bid;
  }

  pay(amount: number) {
    this._strength += amount;
    this._view = null;
  }

  payTax(life: number) {
    this._strength -= this._strength * life;
    this._view = null;
  }

  activate(message: Message): Message {
    const result = this.action.slice();
    for (let i = 0; i < result.length; i++) {
      if (result[i] === Alphabet.PassThrough) {
        result[i] = message.value[i];
      }
    }
    return new Message(result, this);
  }

  addToMessages(message: Message) {
    this.messages.push(message);
  }

  isOutput() {
    return Message.isMessageOfType(this.action, Message.OUTPUT_EXTERNAL_TYPE);
  }

  asOutput() {
    Message.makeAsMessageOfType(this.action, Message.OUTPUT_EXTERNAL_TYPE);
  }

  clearMessages() {
    this.messages.length = 0;
  }

  match(message: Message): Message {
    if (message.size !== this.condition.length) {
      return;
    }

    for (let i = 0; i < this.condition.length; i++) {
      const value = this.condition[i];
      if (value === Alphabet.PassThrough) {
        continue;
      }
      if (value !== message.value[i]) {
        this.active = false;
        return;
      }
    }
    message.use();
    this.active = true;
    return this.activate(message);
  }

  dumpMessagesAndPay(): Message[] {
    this.messages.forEach(m => m.classifier && (m.classifier._strength += this.bidAmount / this.messages.length));
    return this.messages;
  }

  mutate(mutationProbability: number) {
    randomArrayMutate(this.condition, ALPHABET, mutationProbability);
    randomArrayMutate(this.action, ALPHABET, mutationProbability);
  }

  breed(classifier: Classifier): Classifier {
    const condition = breed(this.condition, classifier.condition);
    const action = breed(this.action, classifier.action);
    --Classifier.classifiersNumber;
    return new Classifier(condition, action);
  }

  inverseCopy(): Classifier {
    const copy = this.copy();
    const lastElementIndex = copy.action.length - 1;
    copy.action[lastElementIndex] = copy.action[lastElementIndex] === Alphabet.One ? Alphabet.Zero : Alphabet.One;
    copy._strength = this._strength + 0.1;
    return copy;
  }

  copy() {
    return new Classifier(this.condition.slice(), this.action.slice());
  }
}

