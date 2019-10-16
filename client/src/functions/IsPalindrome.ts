class IsPalindromeInts {
  static nameOf(): String {
    return "is palindrome"
  }

  static inputType(): string {
    return "list of integers, represented by comma separated numbers bookended by square brackets like so: [1,2,3,4,5]";
  }

  static outputType(): string {
    return "boolean, represented by the words 'true' and 'false' without the quotation marks or capitalization";
  }

  static answerText(): string {
    return "This function returns whether or not the given list is palindromic - if reversing the list would yield the same list.";
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
          // Make sure elements are all integers
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

  static validOutput(input: any): boolean {
    var trimmed = input.trim();
    return trimmed === 'true' || trimmed === 'false';
  }

  static parseInput(input: any): any[] {
    return JSON.parse(input);
  }

  static parseOutput(output: any): boolean {
    var as_str = String(output).trim();
    return as_str === 'true';
  }

  static function(items: any[]): boolean {
    if (items.length < 2) {
      return true;
    }
    var start = 0;
    var end = items.length - 1;
    while (start < end) {
      if (items[start] !== items[end]) {
        return false;
      }
      start += 1;
      end -= 1;
    }
    return true;
  }

  static equivalentOutputs(first: boolean, second: boolean): boolean {
    return first === second
  }
}

export default IsPalindromeInts;