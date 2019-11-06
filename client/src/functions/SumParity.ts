import ListOfInteger from "./ListOfInteger";
import Integer from "./Integer";
import { List } from "@material-ui/core";

class SumParity {
  static description(): string {
    return "SumParity"
  }

  static function(items: number[]): number {
    var sum = 0
    for (var i = 0; i < items.length; i++) {
      sum += items[i]
    }
    return Math.abs(sum % 2)
  }

  static inputGenerators(): Function[] {
    // return [() => { return [333] }, () => { return [0] }, () => { return [1, 0, 1] }, () => { return [8, 4] }, () => { return [2, 5] }, () => { return [-8, 3] }]
    return [() => { return [333] }, () => { return [-8, 3] }, () => { return [1, 0, 1] }]

  }

  static answerText(): string {
    return "This function returns 1 if the sum of the elements of the input list is odd and 0 if even."
  }

  static inputPlaceHolderText(): string {
    return ListOfInteger.placeholderText()
  }

  static inputDescription(): string {
    return ListOfInteger.longDescription()
  }

  static outputDescription(): string {
    return Integer.longDescription()
  }

  static validInput(input: any): boolean {
    return ListOfInteger.valid(input)
  }

  static validOutput(input: any): boolean {
    return Integer.valid(input)
  }

  static parseInput(input: any): any[] {
    return ListOfInteger.parse(input)
  }

  static parseOutput(output: any): number {
    return Integer.parse(output);
  }

  static equivalentOutputs(first: any, second: any): boolean {
    return Integer.areEquivalent(first, second)
  }

  static inputStr(input: number[]): string {
    return ListOfInteger.asString(input)
  }

  static outputStr(output: number): string {
    return Integer.asString(output)
  }
}

export default SumParity