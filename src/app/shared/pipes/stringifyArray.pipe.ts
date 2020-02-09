import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "stringifyarray"
})
export class StringifyArray implements PipeTransform {
  transform(value: any, args: any): any {
    if (value.length > 0) {
      const arr = value.map(res => res.name);
      return arr.toString();
    }
    return "";
  }
}
