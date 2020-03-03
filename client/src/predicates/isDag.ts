import ConcreteInstParsing from "./ConcreteInstParsing"
import Node from "./Node"

class isDag {
  static defaultInstance(): string {
    return `inst myInst {
        Node = none
        edges = none
      }`
  }

  // Assumed isnt already screened as valid
  static evaluate(rawText: string): boolean {
    var sets = ConcreteInstParsing.setDefs(rawText)
    var nodes = this.makeNodes(sets)
    
    // To check for acyclicity, do a DFS from every node
    // Should never get back to itself
    var keys = nodes.keys()
    var nextNode = keys.next()
    while (!nextNode.done) {
      var node = nodes.get(nextNode.value)
      if (node !== undefined) {
        var visited = node.dfs()
        if (visited.has(node)) {
          // Cycle found
          return false
        }
      }
      nextNode = keys.next()
    }
    
    return true
  }

  static makeNodes(sets: Map<string, Array<string>>): Map<string, Node> {
    var nodes = new Map<string, Node>()

    // Get nodes and map them 
    var nodeNames = sets.get("Node")
    if (nodeNames !== undefined) {
      nodeNames.forEach((name) => {
          var newNode = new Node(name)
          nodes.set(name, newNode)
      })
    }

    // Build node edge relationships
    var edgesTexts = sets.get("edges")
    var edges = []
    if (edgesTexts !== undefined) {
      for (var j = 0; j < edgesTexts.length; j++) {
        var elems = edgesTexts[j].split("->")
        var fromName = elems[0].trim()
        var toName = elems[1].trim()
        
        var fromNode = nodes.get(fromName)
        var toNode = nodes.get(fromName)
        if (fromNode !== undefined && toNode !== undefined ) {
          fromNode.addDest(toNode)
          toNode.addSrc(fromNode)
        }
      }
    }

    return nodes
  }

  // Checks if concrete inst specified is valid
  static validInst(rawText: string): boolean {
    var sets = ConcreteInstParsing.setDefs(rawText)
    if (!this.predSpecificValid(sets)) {
      return false
    }
    return true
  }

  static predSpecificValid(sets: Map<string, Array<string>>): boolean {
    if (!sets.has("edges") || !sets.has("Node")) {
      alert("Concrete instance doesn't specify one of required sets")
      return false
    }
    if (sets.size > 2) {
      alert("Concrete instance specifies extra set")
      return false
    }

    var nodes = sets.get("Node")
    if (nodes !== undefined) {
      for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].match(/^[A-Za-z0-9]+$/)) {
          console.log("invalid node name")
          return false
        }
      }
    }

    var edges = sets.get("edges")
    if (edges !== undefined && nodes !== undefined) {
      for (var j = 0; j < edges.length; j++) {
        var elems = edges[j].split("->")
        // Check is a tuple
        if (elems.length != 2) {
          console.log("not a tuple")
          return false
        }
        // Check if each element is a node
        if (!nodes.includes(elems[0].trim())) {
          console.log("1st node not included in nodes")
          return false
        }
        if (!nodes.includes(elems[1].trim())) {
          console.log("2nd node not included in nodes")
          return false
        }
      }
    }

    return true
  }
   
    // A custom parser for concrete instances
    // The predicate for seeing if instance is a Dag
  static pred(): boolean {
    // adds nodes 1 by 1 to graph representation, and
    // sees if any cause a cycle
    return false
  }

}
export default isDag