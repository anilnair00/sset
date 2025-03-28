import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateCut' })
export class TranslateCutPipe implements PipeTransform {
  transform(value: string, index: number): string {
    const cutIndex = index;
    return value.split('|')[cutIndex];
  }
}
