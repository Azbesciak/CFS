import {breed, primitiveArrayEquals, randomArrayMutate, randomArrayOfValues} from './utils';
import {Message} from './message/message';
import {ALPHABET, Alphabet} from './alphabet';
import {IdScheduler} from "./id-scheduler";

export interface ClassifierView {
  id: number;
  condition: string;
  action: string;
  strength: number;
  specifity: number;
  lived: number;
}

export class Classifier {
  private static idScheduler = new IdScheduler();
  private _strength = 1;
  private active = false;
  private _bid: number;
  private _lived = 0;
  private _view: ClassifierView;
  private readonly specifity: number;
  private readonly messages: Message[] = [];

  get view(): ClassifierView {
    if (!this._view)
      this._view = {
        action: this.action.join(""),
        condition: this.condition.join(""),
        id: this.id,
        specifity: +this.specifity.toFixed(4),
        strength: +this._strength.toFixed(4),
        lived: this._lived
      };
    return this._view;
  }

  set strength(v: number) {
    this._strength = v;
    this._view = null;
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
    private action: Alphabet[],
    readonly id = Classifier.classifiersNumber++
  ) {
    this.specifity = Classifier.calculateSpecifity(condition);
  }

  static newInstanceFrom(classifier: Classifier) {
    return new Classifier(classifier.condition.slice(), classifier.action.slice());
  }

  static onReset() {
    this.idScheduler = new IdScheduler();
  }

  static onBreedAccepted() {
    this.idScheduler.requestNew();
  }

  static copy(classifier: Classifier) {
    const newCls = new Classifier(classifier.condition.slice(), classifier.action.slice(), classifier.id);
    newCls._strength = classifier._strength;
    newCls._view = classifier._view;
    newCls._lived = classifier._lived;
    newCls._bid = classifier._bid;
    newCls.active = classifier.active;
    if (classifier.messages.length > 0)
      newCls.messages.push(...classifier.messages);
    return newCls;
  }

  static fromLengths(conditionLen: number, actionLen: number): Classifier {
    const actions = randomArrayOfValues(ALPHABET, actionLen);
    Message.makeAsMessageOfType(actions, Message.OUTPUT_EXTERNAL_TYPE);
    return new Classifier(randomArrayOfValues(ALPHABET, conditionLen), actions);
  }

  static fromString(condition: string, action: string): Classifier {
    const conditionAlphabet = Classifier.validateAlphabetString(condition, "condition");
    const actionAlphabet = Classifier.validateAlphabetString(action, "action");
    return new Classifier(conditionAlphabet, actionAlphabet);
  }

  private static validateAlphabetString(str: string, role: string) {
    const strAlphabet = str.split("");
    if (strAlphabet.some(v => !ALPHABET.includes(v as Alphabet))) {
      throw Error(`Illegal value in ${role}: '${str}', allowed are [${ALPHABET.join(", ")}]`)
    }
    return strAlphabet as Alphabet[];
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
    if (this._view) {
      ++this._view.lived;
    }
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

  private activate(message: Message): Message {
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
    return new Classifier(condition, action, Classifier.idScheduler.next());
  }

  inverseCopy(): Classifier {
    const copy = Classifier.newInstanceFrom(this);
    const lastElementIndex = copy.action.length - 1;
    copy.action[lastElementIndex] = copy.action[lastElementIndex] === Alphabet.One ? Alphabet.Zero : Alphabet.One;
    copy._strength = this._strength + 0.1;
    return copy;
  }
}

