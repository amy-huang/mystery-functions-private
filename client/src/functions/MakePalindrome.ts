class MakePalindrome {
  static inputType(): string {
    return "list of integers, represented by comma separated numbers bookended by square brackets like so: [1,2,3,4,5]";
  }

  static outputType(): string {
    return "list of integers, represented by comma separated numbers bookended by square brackets like so: [1,2,3,4,5]";
  }

  static answerText(): string {
    return "This function transforms any list of items into a palindromic one by changing the second half of it to mirror the first - this way, the output is the same reversed or not.";
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

  static validOutput(input: any): boolean {
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

  static parseInput(input: any): any[] {
    return JSON.parse(input);
  }

  static parseOutput(output: any): any[] {
    return JSON.parse(output);
  }

  static function(items: any[]): any[] {
    var newItems = Array.from(items)
    if (newItems.length < 2) {
      return newItems
    }
    var i = 0
    var j = newItems.length - 1
    while (i < j) {
      newItems[j] = newItems[i]
      i += 1
      j -= 1
    }
    return newItems
  }

  static equivalentOutputs(first: any[], second: any[]): boolean {
    if (first === second) {
      return true
    }
    if (first.length !== second.length) {
      return false
    }
    for (var i = 0; i < first.length; ++i) {
      if (first[i] !== second[i]) return false;
    }
    return true
  }
}

export default MakePalindrome;