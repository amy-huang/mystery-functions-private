import ConcreteInstParsing from "./ConcreteInstParsing"
import GraphPred from "./GraphPred"

class IsBipartite extends GraphPred {
  static description(): string {
    return "IsBipartite"
  }

  // Assumed isnt already screened as valid
  static function(rawText: string): boolean {
    var sets = ConcreteInstParsing.setDefs(rawText)
    var nodes = this.makeNodes(sets)
    
    // To check for acyclicity, do a DFS from every node
    // Should never get back to itself
    for (var i = 0; i < nodes.length; i++) {
      // Found disqualifying cycle
      if (nodes[i].oddCycle()) {
        return false
      }
    }
    return true
  }

  static answerText(): string {
    return "if is bipartite graph or, if does NOT have an odd length cycle"
  }
}
export default IsBipartite