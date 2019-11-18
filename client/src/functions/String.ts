import { string } from "prop-types";


// TODO: see if special characters breaks the DB entering - special charas like with [], punctuation, etc.

class String {
  static shortDescription() {
    return "string"
  }

  static longDescription() {
    return "string, represented by text surrounded by double quotes, like so: \"Hello world.s\""
  }

  static placeholderText(): string {
    return "\"\""
  }

  static valid(output: any): boolean {
    var parsed
    try {
      parsed = JSON.parse(output)
    } catch {
      return false
    }
    return typeof parsed === "string"
  }

  static parse(input: any): string {
    var parsed
    try {
      parsed = JSON.parse(input)
    } catch {
      return ""
    }
    return parsed
  }

  static areEquivalent(first: any, second: any): boolean {
    return this.parse(first) === this.parse(second)
  }

  static displayString(member: string): string {
    return member
  }

  static dbString(member: string): string {
    return member
  }
}

export default String