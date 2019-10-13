class IsPalindrome {
  static inputType(): string {
    return "list of integers";
  }

  static outputType(): string {
    return "boolean";
  }

  static answerText(): string {
    return "This function returns whether or not the given list is palindromic - if reversing the list would yield the same list.";
  }

  static validListInput(input: any, elemEval: Function): boolean {
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
          if (!elemEval(as_list[i])) {
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
}

export default IsPalindrome;