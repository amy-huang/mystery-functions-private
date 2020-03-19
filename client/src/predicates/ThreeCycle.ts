import ConcreteInstParsing from "./ConcreteInstParsing"
import GraphPred from "./GraphPred"

class ThreeCycle extends GraphPred {
  static description(): string {
    return "ThreeCycle"
  }

  // Assumed isnt already screened as valid
  static evaluate(rawText: string): boolean {
    var sets = ConcreteInstParsing.setDefs(rawText)
    var nodes = this.makeNodes(sets)
    
    // To check for acyclicity, do a DFS from every node
    // Should never get back to itself
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].threeCycle()) {
        return false
      }
    }
    
    return true
  }
}
export default ThreeCycle