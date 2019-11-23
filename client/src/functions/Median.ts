import ListOfInteger from "../types/ListOfInteger";
import Integer from "../types/Integer";
import { List } from "@material-ui/core";

class Median {
  static numArgs = 1

  static description(): string {
    return "Median"
  }

  static function(items: number[]): number {
    var sorted = JSON.parse(JSON.stringify(items))
    sorted.sort(function (a: number, b: number) { return a - b })
    console.log(sorted)
    var elem = 0
    var middle = Math.floor(items.length / 2)

    if (sorted.length % 2 == 0) {
      elem = (sorted[middle - 1] + sorted[middle]) / 2
    } else {
      elem = sorted[middle]
    }

    console.log(typeof sorted[middle], sorted[middle])
    return elem
  }

  static inputGenerators(): Function[] {
    return [() => { return [333] }, () => { return [-8, 3] }, () => { return [1, 0, 1] }]

  }

  static answerText(): string {
    return "This function returns the median of the input list of numbers."
  }

  static inputPlaceHolderText(): string {
    return ListOfInteger.placeholderText()
  }

  static outputPlaceHolderText(): string {
    return Integer.placeholderText()
  }

  static inputDescription(): string {
    return ListOfInteger.longDescription()
  }

  static outputDescription(): string {
    return Integer.longDescription()
  }

  static validInput(input: any): boolean {
    var as_list;
    try {
      // Parse string as a list, with brackets required
      if (input.trim()[0] !== "[") {
        console.log("no starting bracket")
        return false;
      }
      as_list = JSON.parse(input);
      if (as_list.length > 0) {
        return ListOfInteger.valid(input)
      } else {
        return false
      }
    } catch (e) {
      console.log("error: ", e)
      return false;
    }
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

  static inputDisplayStr(input: number[]): string {
    return ListOfInteger.displayString(input)
  }

  static outputDisplayStr(output: number): string {
    return Integer.displayString(output)
  }

  static inputDBStr(input: number[]): string {
    return ListOfInteger.dbString(input)
  }

  static outputDBStr(output: number): string {
    return Integer.dbString(output)
  }
}

export default Median