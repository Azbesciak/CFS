import {Classifier, ClassifierModel} from "../algorithms/classifier";
import {GeneticAlgorithmCfg} from "../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../algorithms/bucket-brigade/bucket-brigade-cfg";
import {Pattern} from "../state-view/pattern";
import {MessageConfigProvider} from "../algorithms/message/message-config.provider";
import {GeneticAlgorithm} from "../algorithms/genetic-algorithm/genetic-algorithm";
import {BucketBrigade} from "../algorithms/bucket-brigade/bucket-brigade";
import {MessageFactory} from "../algorithms/message/message.factory";
import {Matrix, matrix} from "../algorithms/matrix";
import {Alphabet} from "../algorithms/alphabet";
import {Message} from "../algorithms/message/message";

export interface AlgorithmExecutorMessage {
  classifiersNumber?: number;
  newClassifier?: ClassifierModel;
  reset?: boolean;
  running?: boolean;
  gaCfg?: GeneticAlgorithmCfg;
  bbCfg?: BucketBrigadeCfg;
  pattern?: Pattern;
  msgCfg?: MessageConfigProvider;
  computationDelay?: number;
}

export interface ClassifiersUpdate {
  classifiers: Classifier[];
}

export interface AlgorithmResultUpdate extends ClassifiersUpdate {
  runId: number;
  prediction: Matrix<Prediction>;
  messages: Message[];
  accuracy: number;
}

export interface Prediction {
  result: Alphabet;
  accuracy: number;
}

export function initialPrediction(): Prediction {
  return {
    result: Alphabet.PassThrough,
    accuracy: 0
  }
}

export class AlgorithmExecutor {
  private ga: GeneticAlgorithm = null;
  private bb: BucketBrigade = null;
  private expectedClassifiersNumber = 0;
  private messageCfg: MessageConfigProvider = null;
  private classifiers: Classifier[] = [];
  private runningId = 0;
  private isRunning = false;
  private messageFactory: MessageFactory = null;
  private pattern: Pattern = null;
  private computationDelay: number = 50;
  private step: number = this.computationDelay;
  private recentInvocation: number;
  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly messageConsumer: (mes: AlgorithmResultUpdate | ClassifiersUpdate) => void
  ) {
  }

  postMessage(message: AlgorithmExecutorMessage) {
    if (typeof message.computationDelay === "number") {
      this.computationDelay = message.computationDelay;
    }
    if (message.pattern) {
      this.pattern = message.pattern;
    }
    if (message.msgCfg) {
      this.messageCfg = message.msgCfg;
      this.messageFactory = new MessageFactory(message.msgCfg);
    } else if ((message.gaCfg || message.bbCfg) && !this.messageCfg) {
      throw Error("Message cfg is not set");
    }
    this.assignGACfgIfDefined(message.gaCfg, this.messageCfg);
    this.assignBBCfgIfDefined(message.bbCfg);
    if (typeof message.classifiersNumber === "number") {
      this.updateClassifiersNumber(message.classifiersNumber);
    }
    if (message.reset) {
      this.reset();
    }
    if (message.newClassifier) {
      this.addNewClassifier(message.newClassifier);
    }
    if (typeof message.running === "boolean") {
      this.isRunning = message.running;
      if (message.running) this.fireComputation();
    }
  }

  private fireComputation() {
    this.recentInvocation = new Date().getTime();
    this.run(++this.runningId);
  }

  private updateClassifiersNumber(newNumber: number) {
    this.expectedClassifiersNumber = newNumber;
    if (this.classifiers.length === newNumber) return;
    const currentClassifiers = this.classifiers.slice();
    if (currentClassifiers.length > newNumber) {
      currentClassifiers.length = newNumber;
    } else {
      while (currentClassifiers.length < newNumber) {
        currentClassifiers.push(this.messageFactory.random());
      }
    }
    this.classifiers = currentClassifiers;
    this.messageConsumer({classifiers: this.classifiers})
  }

  private reset() {
    Classifier.onReset();
    this.classifiers = Array.from(
      {length: this.expectedClassifiersNumber},
      () => this.messageFactory.random()
    );
    this.messageConsumer({
      classifiers: this.classifiers,
      prediction: this.initialPrediction(),
      accuracy: 0,
      runId: this.runningId,
      messages: []
    })
  }

  private assignGACfgIfDefined(gaCfg: GeneticAlgorithmCfg, msgCfg: MessageConfigProvider) {
    if (gaCfg) {
      if (this.ga) {
        this.ga.update(gaCfg);
      } else {
        this.ga = new GeneticAlgorithm(gaCfg, msgCfg);
      }
    }
  }

  private assignBBCfgIfDefined(bbCfg: BucketBrigadeCfg) {
    if (bbCfg) {
      if (this.bb) {
        this.bb.update(bbCfg)
      } else {
        this.bb = new BucketBrigade(bbCfg);
      }
    }
  }

  private run(runId: number) {
    const interval = setInterval(() => {
      if (!this.isRunning || this.runningId !== runId) {
        clearInterval(interval);
        return;
      }
      const currentTime = new Date().getTime();
      if (currentTime - this.recentInvocation >= this.computationDelay) {
        this.recentInvocation = currentTime;
        this.compute(runId);
      }
    }, this.step);
  }

  private compute(runId: number) {
    let classifiers = this.classifiers.slice();
    const messages = [];
    let accuracy = 0;
    const prediction = this.initialPrediction();
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const pred = prediction[x][y];
        const newMessages = this.bb.matchCompete(classifiers, [this.messageFactory.fromCoords(x, y)]);
        const response = this.getClassifiersAggregatedResponse(newMessages);
        pred.accuracy = this.computeAccuracy(x, y, response);
        accuracy += pred.accuracy;
        if (pred.accuracy === 0 && response !== -1) {
          this.bb.invertedCopy(classifiers);
        }
        this.bb.payCurrentClassifiers(pred.accuracy);
        this.ga.execute(classifiers);
        messages.push(...newMessages);
        pred.result = this.getClassifiersPrediction(response);
      }
    }
    this.classifiers = classifiers;
    const message = {
      runId,
      prediction,
      classifiers,
      messages,
      accuracy: accuracy / (this.width * this.height)
    };
    this.messageConsumer(message);
  }

  private initialPrediction() {
    return matrix(this.width, this.height, initialPrediction);
  }

  private getClassifiersPrediction(fuzzyResponse: number) {
    if (fuzzyResponse === -1) return Alphabet.PassThrough;
    return fuzzyResponse > 0.5 ? Alphabet.One : Alphabet.Zero;
  }

  private computeAccuracy(x: number, y: number, fuzzyResponse: number) {
    if (fuzzyResponse === -1) return 0;
    return this.pattern.value[x][y] === Alphabet.Zero ? (1 - fuzzyResponse) : fuzzyResponse;
  }

  private getClassifiersAggregatedResponse(messages: Message[]) {
    let ret = 0;
    let totalOutputMessages = 0;
    messages.forEach(m => {
      const message = m.value;
      if (Message.isMessageOfType(message, Message.OUTPUT_EXTERNAL_TYPE)) {
        const lastCharacter = message[message.length - 1];
        ret += this.getAlphabetValue(lastCharacter);
        totalOutputMessages++;
      }
    });
    if (totalOutputMessages === 0) return -1;
    if (ret < 0) return -1;
    return ret / totalOutputMessages;
  }

  private getAlphabetValue(value: Alphabet) {
    if (value === Alphabet.One) return 1;
    if (value === Alphabet.Zero) return 0;
    return -1;
  }

  private addNewClassifier(newClassifier: ClassifierModel) {
    this.classifiers.push(Classifier.newInstanceFrom(newClassifier));
    this.messageConsumer({classifiers: this.classifiers});
  }
}

