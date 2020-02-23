class isDag {
  defaultInstance(): string {
    return `inst hey {
        Node = Node1 + Node2
        edges = Node1 -> Node2
      }`
  }

  parse(instance: string) {
      // convert instance to nodes
  }
   
    // A custom parser for concrete instances
    // The predicate for seeing if instance is a Dag
  pred(): boolean {
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