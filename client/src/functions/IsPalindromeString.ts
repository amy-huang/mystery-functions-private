import Str from "../types/Str"
import Bool from "../types/Bool"

class IsPalindromeString {
  static description(): string {
    return "IsPalindromeString"
  }

  static function(items: string): boolean {
    var firstEnd = 0
    var secondEnd = items.length - 1

    while (firstEnd < secondEnd) {
      if (items[firstEnd] !== items[secondEnd]) {
        return false
      }
      firstEnd++
      secondEnd--
    }

    return true
  }

  static inputGenerators(): Function[] {
    return [() => { return [333] }, () => { return [0, 0] }, () => { return [9, 9, 8] }]
  }

  static answerText(): string {
    return "This function returns whether or not the input string is palindromic - if the reverse would not be different from the original.";
  }

  static inputPlaceHolderText(): string {
    return Str.placeholderText()
  }

  static outputPlaceHolderText(): string {
    return Bool.placeholderText()
  }

  static inputDescription(): string {
    return Str.longDescription()
  }

  static outputDescription(): string {
    return Bool.longDescription()
  }

  static validInput(input: any): boolean {
    return Str.valid(input)
  }

  static validOutput(out: any): boolean {
    return Bool.valid(out)
  }

  static parseInput(input: any): string {
    return Str.parse(input)
  }

  static parseOutput(output: any): boolean {
    return Bool.parse(output);
  }

  static equivalentOutputs(first: any, second: any): boolean {
    return Bool.areEquivalent(first, second)
  }

  static inputDisplayStr(input: string): string {
    return Str.displayString(input)
  }

  static outputDisplayStr(output: boolean): string {
    return Bool.displayString(output)
  }

  static inputDBStr(input: string): string {
    return Str.dbString(input)
  }

  static outputDBStr(output: boolean): string {
    return Bool.dbString(output)
  }
}

export default IsPalindromeString