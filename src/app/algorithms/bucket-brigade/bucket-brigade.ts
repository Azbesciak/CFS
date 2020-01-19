import {Classifier} from '../classifier';
import {Message} from '../message/message';
import {BucketBrigadeCfg} from "./bucket-brigade-cfg";
import {Algorithm} from "../algorithm";


interface BucketBrigadeClassifier {
  classifier: Classifier;
  currentStrength: number;
}

const BBClassifiersComparator =
  (c1: BucketBrigadeClassifier, c2: BucketBrigadeClassifier) => c2.classifier.bid - c1.classifier.bid;

export class BucketBrigade extends Algorithm<BucketBrigadeCfg> {
  private activated: Classifier[] = [];

  constructor(cfg: BucketBrigadeCfg) {
    super(cfg)
  }

  matchCompete(classifiers: Classifier[], messages: Message[]) {
    const active = this.findActiveClassifiers(classifiers, messages);
    const {winners, newMessages} = this.getWinners(active);
    this.activated = winners;
    messages.push(...newMessages);// make immutable?
  }

  payCurrentClassifiers(amount: number) {
    this.activated.forEach(c => c.pay(amount));
  }

  invertedCopy(classifiers: Classifier[]) {
    const classifiersSet: Classifier[] = [];
    for (const c of this.activated) {
      const candidate = c.inverseCopy();
      let existing = classifiers.find(cs => Classifier.equal(cs, candidate));
      if (!existing) {
        existing = classifiersSet.find(cs => Classifier.equal(cs, candidate));
        if (!existing) {
          classifiersSet.push(candidate);
          continue;
        }
      }
      existing.strength = (c.strength * 1.01);
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
