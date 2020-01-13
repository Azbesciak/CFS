import {Classifier} from "../algorithms/classifier";
import {GeneticAlgorithmCfg} from "../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../algorithms/bucket-brigade/bucket-brigade-cfg";
import {Pattern} from "../form-view/settings-view/state-tab/pattern";
import {MessageConfigProvider} from "../algorithms/message/message-config.provider";
import {GeneticAlgorithm} from "../algorithms/genetic-algorithm/genetic-algorithm";
import {BucketBrigade} from "../algorithms/bucket-brigade/bucket-brigade";
import {MessageFactory} from "../algorithms/message/message.factory";
import {Matrix, matrix} from "../algorithms/matrix";
import {Alphabet} from "../algorithms/alphabet";
import {Message} from "../algorithms/message/message";

export interface AlgorithmExecutorMessage {
  classifiers?: Classifier[];
  runId?: number;
  running?: boolean;
  gaCfg?: GeneticAlgorithmCfg;
  bbCfg?: BucketBrigadeCfg;
  pattern?: Pattern;
  msgCfg?: MessageConfigProvider;
}


export interface AlgorithmResultUpdate {
  runId: number;
  prediction: Matrix<Alphabet>;
  messages: Message[];
  classifiers: Classifier[];
  accuracy: number;
}


export class AlgorithmExecutor {
  private ga: GeneticAlgorithm = null;
  private bb: BucketBrigade = null;
  private messageCfg: MessageConfigProvider = null;
  private classifiers: Classifier[] = [];
  private runningId = 0;
  private isRunning = false;
  private messageFactory: MessageFactory = null;
  private pattern: Pattern = null;

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly messageConsumer: (mes: AlgorithmResultUpdate) => void
  ) {
  }

  postMessage(message: AlgorithmExecutorMessage) {
    if (message.pattern) {
      this.pattern = message.pattern;
    }
    if (message.msgCfg) {
      this.messageCfg = message.msgCfg;
      this.messageFactory = new MessageFactory(message.msgCfg);
    } else if ((message.gaCfg || message.bbCfg) && !this.messageCfg) {
      throw Error("Message cfg is not set");
    }
    this.assignGACfgIfDefined(message.gaCfg, message.msgCfg);
    this.assignBBCfgIfDefined(message.bbCfg);
    if (message.classifiers instanceof Array) {
      this.classifiers = message.classifiers.map(Classifier.copy);
    }

    if (typeof message.runId === 'number') {
      this.runningId = message.runId;
    }
    if (typeof message.running === 'boolean') {
      this.isRunning = message.running;
      if (message.running) this.run(this.runningId);
    }
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
    setTimeout(() => {
      if (!this.isRunning || this.runningId !== runId) return;
      let classifiers = this.classifiers.slice();
      const messages = [];
      let accuracy = 0;
      const prediction = matrix(this.width, this.height, () => Alphabet.PassThrough);
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          const runMessages = [this.messageFactory.fromCoords(x, y)];
          this.bb.matchCompete(classifiers, runMessages);
          const response = this.getClassifiersAggregatedResponse(runMessages);
          accuracy += this.computeQuality(x, y, response);
          this.ga.execute(classifiers);
          messages.push(...runMessages);
          prediction[x][y] = this.getClassifiersPrediction(response)
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
      this.run(runId);
    }, 50);
  }

  private getClassifiersPrediction(fuzzyResponse: number) {
    if (fuzzyResponse === -1) return Alphabet.PassThrough;
    return fuzzyResponse > 0.5 ? Alphabet.One : Alphabet.Zero;
  }

  private computeQuality(x: number, y: number, fuzzyResponse: number) {
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
}

