import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileToUmageUrl',
  standalone: true
})
export class FileToUmageUrlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
