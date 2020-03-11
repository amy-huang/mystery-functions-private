import ConcreteInstParsing from "./ConcreteInstParsing"
import Node from "./Node"
import Bool from "../types/Bool"

class isDag {
  static outputType = Bool

  static description(): string {
    return "isDag"
  }

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
        if (node.cycle() === true) {
          alert("found cycle on node: " + node.name)
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
      // Check for empty set of nodes
      if (nodeNames.length === 1 && nodeNames[0] === "none") {
        return nodes
      }
      // Add node names to map
      nodeNames.forEach((name) => {
          var newNode = new Node(name)
          nodes.set(name, newNode)
      })
    }
    // console.log(nodes)

    // Build node edge relationships
    var edgesTexts = sets.get("edges")
    console.log(edgesTexts)
    if (edgesTexts !== undefined) {
      // Check for empty relation for edges
      if (edgesTexts.length === 1 && edgesTexts[0] === "none") {
        return nodes
      }
      // Add edge relationships to mapped nodes
      for (var j = 0; j < edgesTexts.length; j++) {
        var elems = edgesTexts[j].split("->")
        // console.log(elems)
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

    var nodeNames = sets.get("Node")
    if (nodeNames !== undefined) {
      for (var i = 0; i < nodeNames.length; i++) {
        if (!nodeNames[i].match(/^[A-Za-z0-9]+$/)) {
          alert("invalid node name:" + nodeNames[i])
          // console.log("invalid node name")
          return false
        }
      }
    }

    var edges = sets.get("edges")
    var seenEdges = new Array<Array<string>>()
    if (edges !== undefined && nodeNames !== undefined) {
      for (var j = 0; j < edges.length; j++) {
        if (edges[j] === "none") {
          break
        }

        var elems = edges[j].split("->")
        // Check is a tuple
        if (elems.length != 2) {
          alert("edge is not a tuple:" + edges[j])
          // console.log("not a tuple")
          return false
        }
        // Check if each element is a node
        var firstName = elems[0].trim()
        var secondName = elems[1].trim()
        if (!nodeNames.includes(firstName)) {
          alert("First element in tuple not in Node:" + firstName)
          // console.log("1st node not included in nodes")
          return false
        }
        if (!nodeNames.includes(secondName)) {
          alert("Second element in tuple not in Node:" + secondName)
          // console.log("2nd node not included in nodes")
          return false
        }

        // Check if edge seen before
        if (seenEdges.includes([firstName, secondName])) {
            alert("Edge repeated:" + edges[j])
            // console.log("edge repeated")
            return false
        }
        seenEdges.push([firstName, secondName])
      }
    }

    return true
  }

  static inputDescription(): string {
    return "Node, edges description here"
  }

  static outputDescription(): string {
    return this.outputType.longDescription()
  }

}
export default isDag