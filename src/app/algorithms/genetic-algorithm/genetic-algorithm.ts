import {Classifier} from '../classifier';
import {GeneticAlgorithmCfg} from "./genetic-algorithm-cfg";
import {Algorithm} from "../algorithm";
import {MessageConfigProvider} from "../message/message-config.provider";

const GAClassifiersComparator = (a: Classifier, b: Classifier) => b.strength - a.strength;

export class GeneticAlgorithm extends Algorithm<GeneticAlgorithmCfg> {
  private readonly messageLength: number;

  constructor(cfg: GeneticAlgorithmCfg, messageConfig: MessageConfigProvider) {
    super(cfg);
    this.messageLength = messageConfig.messageLength;
  }

  execute(classifiers: Classifier[]) {
    classifiers.sort(GAClassifiersComparator);
    let outNo = this.removeClassifiersWithToLowStrength(classifiers);
    const afterBreed = this.breed(classifiers, 1);
    if (afterBreed.length > 0)
      classifiers.push(...afterBreed);
    this.mutateClassifiers(classifiers);
    this.makeAsExternalOutput(classifiers, outNo);
  }

  private makeAsExternalOutput(classifiers: Classifier[], outNo: number) {
    const maxOutNo = Math.floor(classifiers.length * this.cfg.outPercentage);
    for (let i = classifiers.length - 1; i >= 0 && outNo < maxOutNo; i--) {
      const classifier = classifiers[i];
      if (classifier.isOutput()) {
        continue
      }
      classifier.asOutput();
      ++outNo;
    }
  }

  private mutateClassifiers(classifiers: Classifier[]) {
    for (let i = Math.floor(classifiers.length * this.cfg.elitism); i < classifiers.length; i++) {
      if (Math.random() < this.cfg.mutationProbability)
        classifiers[i].mutate(this.cfg.classifierMutationProbability);
    }
  }

  private removeClassifiersWithToLowStrength(classifiers: Classifier[]) {
    let outNo = 0;
    for (let i = classifiers.length - 1; i >= 0 && classifiers.length > 2; i--) {
      const classifier = classifiers[i];
      classifier.newEpoch();
      if (classifier.strength < this.cfg.strengthThreshold) {
        classifiers.splice(i, 1);
      } else if (classifier.isOutput()) {
        ++outNo;
      }
    }
    return outNo;
  }

  private breed(classifiers: Classifier[], toBKilled: number) {
    const breed: Classifier[] = [];
    let kb = 0;
    if (classifiers.length < 2) {
      return breed;
    }
    let first: Classifier = classifiers[0];
    let second: Classifier;
    for (let i = 1; i < classifiers.length && kb < toBKilled && classifiers.length < this.cfg.maxClassifiers; i++) {
      second = classifiers[i];
      let j = 0;
      let candidate: Classifier;
      do {
        candidate = first.breed(second);
        if (++j > 100) {
          if (i >= classifiers.length - 1) {
            // probably could be different - in original code 8/8... fixed, without variable
            candidate = Classifier.fromLengths(this.messageLength, this.messageLength);
            continue;
          }
          first = second;
          second = classifiers[++i];
        }
      } while (
        classifiers.find(c => Classifier.equal(c, candidate)) ||
        breed.find(c => Classifier.equal(c, candidate))
        );
      if (candidate) {
        Classifier.onBreedAccepted();
        breed.push(candidate);
        first = second;
        ++kb;
      }
    }
    return breed;
  }

}

