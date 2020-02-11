export interface ValueConfig {
  current: number;
  min: number;
  max: number;
  step: number;
}

export interface Config {
  chess: {
    width: number;
    height: number;
  },
  computation: {
    delay: ValueConfig,
    iterative: boolean,
    enableWorker: boolean;
  },
  listThrottleTime: number
}

export function defaultConfig(): Config {
  return {
    chess: {
      width: 8,
      height: 8
    },
    computation: {
      enableWorker: true,
      iterative: true,
      delay: {
        current: 50,
        min: 5,
        max: 1000,
        step: 1
      }
    },
    listThrottleTime: 50
  }
}
