export abstract class Algorithm<T> {
  protected readonly cfg: T;
  protected constructor(cfg: T) {
    this.cfg = {...cfg}
  }

  update(cfg: Partial<T>) {
    Object.assign(this.cfg, cfg);
  }
}
