class SumParity {
  static nameOf(): String {
    return "parity of sum of numerical elements"
  }

  static inputType(): string {
    return "list of integers, represented by comma separated numbers bookended by square brackets like so: [1,2,3,4,5]";
  }

  static outputType(): string {
    return "integer, represented by a positve or negative number (or 0) that is not fractional"
  }

  static answerText(): string {
    return "This function returns the parity of the sum of the elements of the input list.";
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
    return sum % 2
  }

  static equivalentOutputs(first: number, second: number): boolean {
    return first === second
  }
}

export default SumParity;