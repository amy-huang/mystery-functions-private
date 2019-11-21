import ListOfInteger from "../types/ListOfInteger";
import Bool from "../types/Bool";

class SumParityBool {
  static description(): string {
    return "SumParityBool"
  }

  static function(items: number[]): boolean {
    var sum = 0
    for (var i = 0; i < items.length; i++) {
      sum += items[i]
    }

    if (Math.abs(sum % 2) == 1) {
      return true
    }

    return false
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

  static outputPlaceHolderText(): string {
    return Bool.placeholderText()
  }

  static inputDescription(): string {
    return ListOfInteger.longDescription()
  }

  static outputDescription(): string {
    return Bool.longDescription()
  }

  static validInput(input: any): boolean {
    return ListOfInteger.valid(input)
  }

  static validOutput(input: any): boolean {
    return Bool.valid(input)
  }

  static parseInput(input: any): any[] {
    return ListOfInteger.parse(input)
  }

  static parseOutput(output: any): boolean {
    return Bool.parse(output);
  }

  static equivalentOutputs(first: any, second: any): boolean {
    return Bool.areEquivalent(first, second)
  }

  static inputDisplayStr(input: number[]): string {
    return ListOfInteger.displayString(input)
  }

  static outputDisplayStr(output: boolean): string {
    return Bool.displayString(output)
  }

  static inputDBStr(input: number[]): string {
    return ListOfInteger.dbString(input)
  }

  static outputDBStr(output: boolean): string {
    return Bool.dbString(output)
  }
}

export default SumParityBool