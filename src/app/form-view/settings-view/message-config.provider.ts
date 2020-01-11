import {Injectable} from "@angular/core";
import {MessageConfigProvider as ProviderInterface} from "../../algorithms/message/message-config.provider";
import {environment} from "../../../environments/environment";
import {Message} from "../../algorithms/message/message";


@Injectable({
  providedIn: "root"
})
export class MessageConfigProvider implements ProviderInterface {
  private static getLengthInBinary(maxValue: number) {
    return (Math.max(maxValue - 1, 1)).toString(2).length;
  }

  readonly widthCoordLength = MessageConfigProvider.getLengthInBinary(environment.chess.width);
  readonly heightCoordLength = MessageConfigProvider.getLengthInBinary(environment.chess.height);
  readonly messageLength = Message.MESSAGE_PREFIX_LENGTH + this.widthCoordLength + this.heightCoordLength;

}
