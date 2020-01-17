export class IdScheduler {
  private _currentId = 0;

  constructor(id: number = 0) {
    this._currentId = id;
  }

  static from(id: IdScheduler) {
    return new IdScheduler(id._currentId);
  }

  requestNew() {
    return ++this._currentId;
  }

  next() {
    return this._currentId + 1;
  }
}
