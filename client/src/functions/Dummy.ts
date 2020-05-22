import Integer from "../types/Integer";

class Dummy {
  static numArgs = 1

  static inputType = Integer
  static outputType = Integer

  static description(): string {
    return "Dummy"
  }

  static function(num: number): number {
    return Math.abs(num) + 1
  }

  static inputGenerators(): Function[] {
    return [() => { return 31 }, () => { return 0 }, () => { return -44 }]
  }

  static answerText(): string {
    return "Given a number x, this function returns |x| + 1"
  }

  static inputPlaceHolderText(): string {
    return this.inputType.placeholderText()
  }

  static outputPlaceHolderText(): string {
    return this.outputType.placeholderText()
  }

  static inputDescription(): string {
    return this.inputType.longDescription()
  }

  static outputDescription(): string {
    return this.outputType.longDescription()
  }

  static validInput(input: any): boolean {
    return this.inputType.valid(input)
  }

  /* Should not have to touch functions below here! */

  static validOutput(input: any): boolean {
    return this.outputType.valid(input)
  }

  static parseInput(input: any): number {
    return this.inputType.parse(input)
  }

  static parseOutput(output: any): number {
    return this.outputType.parse(output);
  }

  static equivalentInputs(first: any, second: any): boolean {
    return this.inputType.areEquivalent(first, second)
  }

  static equivalentOutputs(first: any, second: any): boolean {
    return this.outputType.areEquivalent(first, second)
  }

  static inputDisplayStr(input: number): string {
    return this.inputType.displayString(input)
  }

  static outputDisplayStr(output: number): string {
    return this.outputType.displayString(output)
  }

  static inputDBStr(input: number): string {
    return this.inputType.dbString(input)
  }

  static outputDBStr(output: number): string {
    return this.outputType.dbString(output)
  }
}

export default Dummy