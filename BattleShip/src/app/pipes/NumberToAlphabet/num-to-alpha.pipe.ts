import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numToAlpha'
})
export class NumToAlphaPipe implements PipeTransform {

  transform(value: number): string {
    let alphabet: string[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    
    return alphabet[value-1];
  }

}
