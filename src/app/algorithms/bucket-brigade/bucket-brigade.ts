import {Classifier} from '../classifier';
import {Message} from '../message/message';
import {BucketBrigadeCfg} from "./bucket-brigade-cfg";
import {Algorithm} from "../algorithm";


const BBClassifiersComparator = (c1: Classifier, c2: Classifier) => c2.maxBidAmount - c1.maxBidAmount;

export class BucketBrigade extends Algorithm<BucketBrigadeCfg> {
  private activated: Classifier[] = [];

  constructor(cfg: BucketBrigadeCfg) {
    super(cfg)
  }

  /**
   * - Matches classifiers with given messages
   * - finds winners depending on their limit (this one mutates algorithm state)
   * - returns upgraded message list
   * @param classifiers classifiers to match
   * @param messages messages with coordinates for classifiers
   */
  matchCompete(classifiers: Classifier[], messages: Message[]): Message[] {
    const active = this.findActiveClassifiers(classifiers, messages);
    const {winners, newMessages} = this.getWinners(active);
    this.activated = winners;
    return newMessages.length === 0 ? messages.slice() : [...messages, ...newMessages];
  }

  /**
   * Pays recent algorithm iteration winners passed amount
   * @param amount value to pay
   */
  payCurrentClassifiers(amount: number) {
    this.activated.forEach(c => c.pay(amount));
  }

  /**
   * Adds to passed classifiers (mutation) new one with inverted last bit if such does not exist in passed list.
   * Otherwise existing classifier's strength is increased.
   * @param classifiers list of classifiers to expand
   */
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
    const active: Classifier[] = [];
    for (const c of classifiers) {
      c.clearMessages();
      c.payTax(this.cfg.lifeTax);
      this.matchClassifierMessages(messages, c, active);
    }
    active.sort(BBClassifiersComparator);
    return active;
  }

  private matchClassifierMessages(messages: Message[], classifier: Classifier, active: Classifier[]) {
    messages.forEach(message => {
      const temp = classifier.match(message);
      if (!temp) {
        return;
      }
      active.push(classifier);
    });
  }
}
