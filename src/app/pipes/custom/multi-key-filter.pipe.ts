import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiKeyFilter'
})
export class MultiKeyFilterPipe implements PipeTransform {
  transform(items: any[], keys: string[], term: string): any[] {
    if (!items || !keys || !term) {
      return items;
    }

    term = term.toLowerCase();
    return items.filter(item => {
      return keys.some(key => {
        const value = this.getValue(item, key);
        return value !== null && this.stripHtmlTags(value.toString()).toLowerCase().includes(term);
      });
    });
  }

  private getValue(item: any, key: string): any {
    const nestedKeys = key.split('.');
    let value = item;
    for (const nestedKey of nestedKeys) {
      if (!value || !value.hasOwnProperty(nestedKey)) {
        return null;
      }
      value = value[nestedKey];
    }
    return value;
  }

  private stripHtmlTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
}
