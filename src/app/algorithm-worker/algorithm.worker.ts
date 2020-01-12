/// <reference lib="webworker" />

import {GeneticAlgorithm} from "../algorithms/genetic-algorithm/genetic-algorithm";
import {MessageConfigProvider} from "../algorithms/message/message-config.provider";
import {BucketBrigade} from "../algorithms/bucket-brigade/bucket-brigade";
import {Classifier} from "../algorithms/classifier";
import {BucketBrigadeCfg} from "../algorithms/bucket-brigade/bucket-brigade-cfg";
import {GeneticAlgorithmCfg} from "../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {environment} from "../../environments/environment";
import {MessageFactory} from "../algorithms/message/message.factory";
import {Message} from "../algorithms/message/message";
import {Alphabet} from "../algorithms/alphabet";
import {Pattern} from "../form-view/settings-view/state-tab/pattern";
import {matrix} from "../algorithms/matrix";

let _ga: GeneticAlgorithm = null;
let _bb: BucketBrigade = null;
let _messageCfg: MessageConfigProvider = null;
let _classifiers: Classifier[] = [];
let _runningId = 0;
let _isRunning = false;
const {width, height} = environment.chess;
let _messageFactory: MessageFactory = null;
let _pattern: Pattern = null;

addEventListener('message', ({data: {gaCfg, bbCfg, msgCfg, classifiers, running, runId, pattern}}) => {
  if (pattern) {
    _pattern = pattern;
  }
  if (msgCfg) {
    _messageCfg = msgCfg;
    _messageFactory = new MessageFactory(msgCfg);
  } else if ((gaCfg || bbCfg) && !_messageCfg) {
    throw Error("Message cfg is not set");
  }
  assignGACfgIfDefined(gaCfg, msgCfg);
  assignBBCfgIfDefined(bbCfg);
  if (classifiers instanceof Array) {
    _classifiers = classifiers.map(Classifier.copy);
  }

  if (typeof runId === 'number') {
    _runningId = runId;
  }
  if (typeof running === 'boolean') {
      _isRunning = running;
    if (running) run(_runningId);
  }
});

function assignGACfgIfDefined(gaCfg: GeneticAlgorithmCfg, msgCfg: MessageConfigProvider) {
  if (gaCfg) {
    if (_ga) {
      _ga.update(gaCfg);
    } else {
      _ga = new GeneticAlgorithm(gaCfg, msgCfg);
    }
  }
}

function assignBBCfgIfDefined(bbCfg: BucketBrigadeCfg) {
  if (bbCfg) {
    if (_bb) {
      _bb.update(bbCfg)
    } else {
      _bb = new BucketBrigade(bbCfg);
    }
  }
}


function run(runId: number) {
  setTimeout(() => {
    if (!_isRunning || _runningId !== runId) return;
    let classifiers = _classifiers.slice();
    const messages = [];
    let accuracy = 0;
    const prediction = matrix(width, height, () => Alphabet.PassThrough);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const runMessages = [_messageFactory.fromCoords(x, y)];
        _bb.matchCompete(classifiers, runMessages);
        const response = getClassifiersAggregatedResponse(runMessages);
        accuracy += computeQuality(x, y, response);
        _ga.execute(classifiers);
        messages.push(...runMessages);
        prediction[x][y] = getClassifiersPrediction(response)
      }
    }
    _classifiers = classifiers;
    const message = {
      runId,
      prediction,
      classifiers,
      messages,
      accuracy: accuracy / (width * height)
    };
    postMessage(message);
    run(runId);
  }, 50);
}

function getClassifiersPrediction(fuzzyResponse: number) {
  if (fuzzyResponse === -1) return Alphabet.PassThrough;
  return fuzzyResponse > 0.5 ? Alphabet.One : Alphabet.Zero;
}

function computeQuality(x: number, y: number, fuzzyResponse: number) {
  if (fuzzyResponse === -1) return 0;
  return _pattern.value[x][y] === Alphabet.Zero ? (1-fuzzyResponse) : fuzzyResponse;
}

function getClassifiersAggregatedResponse(messages: Message[]) {
  let ret = 0;
  let totalOutputMessages = 0;
  messages.forEach(m => {
    const message = m.value;
    if (Message.isMessageOfType(message, Message.OUTPUT_EXTERNAL_TYPE)) {
      const lastCharacter = message[message.length - 1];
      ret += getAlphabetValue(lastCharacter);
      totalOutputMessages++;
    }
  });
  if (totalOutputMessages === 0) return -1;
  if (ret < 0) return -1;
  return ret / totalOutputMessages;
}

function getAlphabetValue(value: Alphabet) {
  if (value === Alphabet.One) return 1;
  if (value === Alphabet.Zero) return 0;
  return -1;
}
