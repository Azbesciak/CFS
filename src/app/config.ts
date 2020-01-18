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
    enableWorker: boolean;
  }
}

export function defaultConfig(): Config {
  return {
    chess: {
      width: 8,
      height: 8
    },
    computation: {
      enableWorker: true,
      delay: {
        current: 50,
        min: 50,
        max: 5000,
        step: 50
      }
    }
  }
}