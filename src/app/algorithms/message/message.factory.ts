import {Alphabet} from "../alphabet";
import {MessageConfigProvider} from "./message-config.provider";
import {Message} from "./message";

export class MessageFactory {
    constructor(private config: MessageConfigProvider) {
    }

    private numberToBinary(value: number, targetLength: number): Alphabet[] {
        const word = value.toString(2).split('') as Alphabet[];
        while (word.length < targetLength) {
            word.unshift(Alphabet.Zero);
        }
        return word;
    }

    fromCoords(x: number, y: number) {
        const xBinary = this.numberToBinary(x, this.config.widthCoordLength);
        const yBinary = this.numberToBinary(y, this.config.heightCoordLength);
        return new Message([...Message.INPUT_EXTERNAL_TYPE, ...xBinary, ...yBinary]);
    }
}
