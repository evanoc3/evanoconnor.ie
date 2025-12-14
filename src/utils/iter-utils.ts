export function repeat(n: number): NaturalNumberIterator {
  return new NaturalNumberIterator(n);
}


class NaturalNumberIterator extends Iterator<number, number> {

  private end: number;
  private cur: number;

  public constructor(end: number) {
    super();
    this.cur = 0;
    this.end = end;
  }

  public next(): IteratorResult<number, number> {
    if (this.cur < this.end) {
      return {
        done: false,
        value: this.cur++
      };
    } else {
      return {
        done: true,
        value: this.cur
      };
    }
  }

}
