import { IncomingMessage } from "http";

export default interface IRequest extends IncomingMessage {
  body: {
    query: String;
  };
  token: string;
}
