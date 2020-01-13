/// <reference lib="webworker" />

import {environment} from "../../environments/environment";
import {AlgorithmExecutor} from "./algorithm.executor";

const worker = new AlgorithmExecutor(
  environment.chess.width,
  environment.chess.height,
    m => postMessage(m)
);

addEventListener('message', ({data}) => worker.postMessage(data));
