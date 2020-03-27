import ConcreteInstParsing from "./ConcreteInstParsing"
import Node from "./Node"
import Bool from "../types/Bool"

class GraphPred {
  numArgs = 1

  static makeNodes(sets: Map<string, Array<string>>): Array<Node> {
    var nodes = new Map<string, Node>()
    var nodeList = Array<Node>()

    // Get nodes and map them 
    var nodeNames = sets.get("Node")
    if (nodeNames !== undefined) {
      // Check for empty set of nodes
      if (nodeNames.length === 1 && nodeNames[0] === "none") {
        return nodeList
      }
      // Add node names to map
      nodeNames.forEach((name) => {
          var newNode = new Node(name)
          nodes.set(name, newNode)
          nodeList.push(newNode)
      })
    }

    // Build node edge relationships
    var edgesTexts = sets.get("edges")
    if (edgesTexts !== undefined) {
      // Check for empty relation for edges
      if (edgesTexts.length === 1 && edgesTexts[0] === "none") {
        return nodeList
      }
      // Add edge relationships to mapped nodes
      for (var j = 0; j < edgesTexts.length; j++) {
        var elems = edgesTexts[j].split("->")
        // console.log(elems)
        var fromName = elems[0].trim()
        var toName = elems[1].trim()
        
        var fromNode = nodes.get(fromName)
        var toNode = nodes.get(toName)
        if (fromNode !== undefined && toNode !== undefined ) {
          fromNode.addDest(toNode)
          toNode.addSrc(fromNode)
        } 
      }
    }

    nodes.forEach((node) => {
      console.log(node.printout())
    })
    return nodeList
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
    return Bool.longDescription()
  }

  static parseOutput(out: any): boolean {
    return Bool.parse(out)
  }

  static validOutput(out: any): boolean {
    return Bool.valid(out)
  }

  static equivalentOutputs(first: any, second: any): boolean {
    return Bool.areEquivalent(first, second)
  }

  static inputPlaceHolderText(): string {
    return `inst myInst {
  Node = none
  edges = none
  }`
  }

  static outputPlaceHolderText(): string {
    return Bool.placeholderText()
  }

  // strings for instances and booleans shouldn't need changing
  static inputDBStr(input: any): string {
    return input.toString()
  }
  static outputDBStr(output: any): string {
    return output.toString()
  }
  static inputDisplayStr(input: any): string {
    return input.toString()
  }
  static outputDisplayStr(output: any): string {
    return output.toString()
  }
}
export default GraphPred