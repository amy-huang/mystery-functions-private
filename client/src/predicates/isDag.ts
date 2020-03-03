class isDag {
  static defaultInstance(): string {
    return `inst myInst {
        Node = none
        edges = none
      }`
  }

  static validParse(instance: string): Map<string, Array<string>> {
      var defs = new Map<string, Array<string>>()
      var spaceTokens = instance.trim().split(/\s+/)
      console.log(instance)
      console.log(spaceTokens)
      if (spaceTokens.length < 4) {
        alert("Malformed concrete instance")
        console.log("less than 4 space tokens")
        return defs
      }
      if (spaceTokens[0] !== "inst") {
        alert("Malformed concrete instance")
        console.log("inst keyword missing")
        return defs
      }
      if (spaceTokens[2] !== "{") {
        alert("Malformed concrete instance")
        console.log("no start bracket")
        return defs
      }
      if (spaceTokens[spaceTokens.length - 1] !== "}") {
        alert("Malformed concrete instance")
        console.log("no end bracket")
        return defs
      }

      // Get each line within brackets
      var onBracks = instance.split(/{|}/)
      var lines = onBracks[1].split(/\n|and/)
      var successFul = true
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim()
        if (line === "") {
          continue
        }

        var onEqual = lines[i].split("=")
        if (onEqual.length !== 2) {
          alert("Malformed concrete instance")
          console.log("equal not between 2 strings", onEqual)
          return defs
        }

        // Get set name
        var setName = onEqual[0].trim()
        // if (setName.split(/\s+/).length > 1) {
        //   alert("Malformed concrete instance")
        //   console.log("set name has spaces")
        //   return defs
        // }
        if (!setName.match(/^[A-Za-z0-9]+$/)) {
          alert("Malformed concrete instance - set name should be alphanumeric")
          console.log(setName)
          return defs
        }
        
        // For now only support union operater
        var items = onEqual[1].split("\+")
        console.log("items", items)
        for (var j = 0; j < items.length; j++) {
          var item = items[j].trim()
          if (item === "") {
            alert("Malformed concrete instance")
            console.log("empty item", item)
            return new Map<string, Array<string>>()
          }

          console.log("item", item)
          if (!defs.has(setName)) {
            defs.set(setName, [])
          } 
          var newSet = defs.get(setName)
          if (newSet !== undefined) {
            newSet.push(item)
            defs.set(setName, newSet)
          }
        }
      }
      console.log("final defs", defs)

      return defs
  }

  static parse() {

  }
   
    // A custom parser for concrete instances
    // The predicate for seeing if instance is a Dag
  static pred(): boolean {
    // adds nodes 1 by 1 to graph representation, and
    // sees if any cause a cycle
    return false
  }

}

// class Node {
//     name = ""
//     to = []

//     constructor(name: string) {
//         this.name = name
//     }

//     addDest(n: Node) {
//         this.to.push(n)
//     }

//     dests(): Node[] {
//         return this.to
//     }

//     // Returns the empty set if cycle detected, otherwise
//     // returns all nodes reachable from this one by DFS
//     // including itself
//     dfs(): Set<Node> {
//         var visited = new Set<Node>()
//         visited.add(this)

//         this.to.forEach((n) => {
//             var newlyVisited = n.dfs()
//             if (newlyVisited.has(this)) {
//                 // If cycle detected, empty set returned
//                 return new Set<Node>()
//             }

//             // Get destination and all reachable from it
//             visited += newlyVisited
//         })
//         return visited
//     }
// }
export default isDag