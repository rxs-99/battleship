import { NumToArrPipe } from './num-to-arr.pipe';

describe('NumToArrPipe', () => {
  it('create an instance', () => {
    const pipe = new NumToArrPipe();
    expect(pipe).toBeTruthy();
  });
});
