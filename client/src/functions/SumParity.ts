class SumParity {
  static description(): string {
    return "SumParity"
  }

  static inputPlaceHolderText(): string {
    return "[]"
  }

  static inputType(): string {
    return "list of integers, represented by square brackets, and any numbers contained as comma separated digits: [1,2,3,4,5]";
  }

  static outputType(): string {
    return "integer, represented by a positve or negative number (or 0) that is not fractional"
  }

  static answerText(): string {
    return "This function returns 1 if the sum of the elements of the input list is odd and 0 if even.";
  }

  private static asIntEvaluator(item: any) {
    if (Number.isInteger(item)) {
      return true;
    }
    return false;
  }

  static validInput(input: any): boolean {
    var as_list;
    try {
      // Parse string as a list, with brackets required
      if (input.trim()[0] !== "[") {
        return false;
      }
      as_list = JSON.parse(input);
      if (as_list.length > 0) {
        for (var i = 0; i < as_list.length; i++) {
          // Make sure item types are same as passed in param
          if (!this.asIntEvaluator(as_list[i])) {
            return false;
          }
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  static validOutput(output: any): boolean {
    var parsed
    try {
      parsed = JSON.parse(output)
    } catch {
      return false
    }
    return this.asIntEvaluator(parsed)
  }

  static parseInput(input: any): any[] {
    return JSON.parse(input);
  }

  static parseOutput(output: any): number {
    return JSON.parse(output)
  }

  static function(items: number[]): number {
    var sum = 0
    for (var i = 0; i < items.length; i++) {
      sum += items[i]
    }
    return Math.abs(sum % 2)
  }

  static equivalentOutputs(first: number, second: number): boolean {
    return first === second
  }
}

export default SumParity;