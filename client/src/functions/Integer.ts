class Integer {
  static shortDescription() {
    return "list of integers"
  }

  static longDescription() {
    return "list of integers, represented by square brackets, and any numbers contained as comma separated digits: [1,2,3,4,5]"
  }

  static valid(output: any): boolean {
    var parsed
    try {
      parsed = JSON.parse(output)
    } catch {
      return false
    }
    return this.asIntEvaluator(parsed)
  }

  private static asIntEvaluator(item: any) {
    if (Number.isInteger(item)) {
      return true;
    }
    return false;
  }

  static parse(input: any): number {
    var parsed
    try {
      parsed = parseInt(input)
    } catch {
      return 0
    }
    return parsed
  }

  static areEquivalent(first: any, second: any): boolean {
    return this.parse(first) === this.parse(second)
  }

  static asString(member: number): string {
    return member.toString()
  }
}

export default Integer