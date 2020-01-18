import {defaultConfig} from "../app/config";

export const environment = {
  production: true,
  ...defaultConfig()
};
