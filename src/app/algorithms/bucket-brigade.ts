import {Classifier} from './classifier';
import {Message} from './message';

export interface BucketBrigadeCfg {
  readonly k: number;
  readonly lifeTax: number;
  readonly bidTax: number;
  readonly winners: number;
  readonly msgAgeThreshold: number;
}

const DEFAULT_CONFIG = {
  k: 0.1,
  lifeTax: 0.06,
  bidTax: 0.05,
  winners: 1,
  msgAgeThreshold: 3
};

export function bucketBrigadeConfig(cfg: Partial<BucketBrigadeCfg>): BucketBrigadeCfg {
  return Object.assign({}, DEFAULT_CONFIG, cfg);
}

interface BucketBrigadeClassifier {
  classifier: Classifier;
  currentStrength: number;
}

const BBClassifiersComparator =
  (c1: BucketBrigadeClassifier, c2: BucketBrigadeClassifier) => c2.classifier.bid - c1.classifier.bid;

export class BucketBrigade {
  private active: Classifier[] = [];
  private activated: Classifier[] = [];
  private prevActivated: Classifier[] = [];
  private readonly cfg: BucketBrigadeCfg;

  constructor(cfg: BucketBrigadeCfg) {
    this.cfg = {...cfg};
  }

  matchCompete(classifiers: Classifier[], messages: Message[]) {
    this.prevActivated = this.activated.slice();
    this.activated = [];
    this.active = this.findActiveClassifiers(classifiers, messages);
    const {winners, newMessages} = this.getWinners(classifiers);
    this.activated.push(...winners);
    messages.push(...newMessages);// make immutable?
  }

  payCurrentClassifiers(amount: number) {
    this.activated.forEach(c => c.pay(amount));
  }

  payPreviousClassifiers(amount: number) {
    if (this.prevActivated.length === 0) {
      return;
    }
    const toPay = amount / this.prevActivated.length;
    this.active.forEach(c => c.pay(toPay));
  }

  invertedCopy(classifiers: Classifier[]) {
    const classifiersSet: Classifier[] = [];
    for (const c of this.activated) {
      const candidate = c.inverseCopy();
      let existing = classifiersSet.find(cs => Classifier.equal(cs, candidate));
      if (!existing) {
        existing = classifiersSet.find(cs => Classifier.equal(cs, candidate));
        if (!existing) {
          classifiersSet.push(candidate);
          continue;
        }
      }
      existing.pay(existing.strength * 1.01);
    }
    if (classifiersSet.length > 0) {
      classifiers.push(...classifiersSet); // does it have to be mutated?
    }
  }

  private getWinners(classifiers: Classifier[]) {
    const winners = classifiers.slice(0, this.cfg.winners);
    const newMessages: Message[] = [];
    winners.forEach(w => {
      w.payBid(this.cfg.k, this.cfg.bidTax);
      newMessages.push(...w.dumpMessagesAndPay());
    });
    return {winners, newMessages};
  }

  private findActiveClassifiers(classifiers: Classifier[], messages: Message[]) {
    let maxStrength = 0;
    const active: BucketBrigadeClassifier[] = [];
    for (const c of classifiers) {
      c.clearMessages();
      c.payTax(this.cfg.lifeTax);
      maxStrength = this.matchClassifierMessages(messages, c, maxStrength, active);
    }
    this.normalizeClassifiersStrength(active, maxStrength);
    active.sort(BBClassifiersComparator);
    return active.map(c => c.classifier);
  }

  private matchClassifierMessages(messages: Message[], classifier: Classifier, maxStrength: number, active: BucketBrigadeClassifier[]) {
    messages.forEach(message => {
      const temp = classifier.match(message);
      if (!temp) {
        return;
      }
      classifier.addToMessages(temp);
      const a = Math.random() / 5;
      const currentStrength = classifier.strength * (1 + a - 0.1); // ???
      if (currentStrength > maxStrength) {
        maxStrength = currentStrength;
      }
      active.push({classifier, currentStrength});
    });
    return maxStrength;
  }

  private normalizeClassifiersStrength(classifiers: BucketBrigadeClassifier[], maxStrength: number) {
    classifiers.forEach(c => c.currentStrength /= maxStrength);
  }
}
