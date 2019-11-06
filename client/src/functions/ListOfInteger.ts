import { string } from "prop-types";

class ListOfInteger {
  static shortDescription(): string {
    return "list of integers"
  }

  static longDescription(): string {
    return "list of integers, represented by square brackets, and any numbers contained as comma separated digits: [1,2,3,4,5]"
  }

  static placeholderText(): string {
    return "[]"
  }

  static valid(input: any): boolean {
    var as_list;
    try {
      // Parse string as a list, with brackets required
      if (input.trim()[0] !== "[") {
        return false;
      }
      as_list = JSON.parse(input);
      if (as_list.length > 0) {
        for (var i = 0; i < as_list.length; i++) {
          // Make sure items are integers
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

  private static asIntEvaluator(item: any) {
    if (Number.isInteger(item)) {
      return true;
    }
    return false;
  }

  static parse(input: any): number[] {
    return JSON.parse(input);
  }

  static areEquivalent(first: any[], second: any[]): boolean {
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

  static asString(nums: number[]): string {
    var as_str = "["
    for (var i = 0; i < nums.length; i++) {
      if (as_str.length > 1) {
        as_str += ","
      }
      // Assuming that each member of the list has a toString method
      as_str += nums[i].toString()
    }
    as_str += "]"
    return as_str
  }
}

export default ListOfInteger