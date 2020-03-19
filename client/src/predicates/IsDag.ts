import ConcreteInstParsing from "./ConcreteInstParsing"
import GraphPred from "./GraphPred"

class IsDag extends GraphPred {
  static description(): string {
    return "isDag"
  }

  // Assumed isnt already screened as valid
  static evaluate(rawText: string): boolean {
    var sets = ConcreteInstParsing.setDefs(rawText)
    var nodes = this.makeNodes(sets)
    
    // To check for acyclicity, do a DFS from every node
    // Should never get back to itself
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].cycle()) {
        return false
      }
    }
    
    return true
  }
}
export default IsDag