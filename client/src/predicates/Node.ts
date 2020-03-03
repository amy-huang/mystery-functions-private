class Node {
    name = ""
    to = new Array<Node>()
    from = new Array<Node>()

    constructor(name: string) {
        this.name = name
    }

    addDest(n: Node) {
        this.to.push(n)
    }

    addSrc(n: Node) {
        this.from.push(n)
    }

    dests(): Node[] {
        return this.to
    }

    srcs(): Node[] {
        return this.from
    }

    // Returns the empty set if cycle detected, otherwise
    // returns all nodes reachable from this one by DFS
    // including itself
    dfs(): Set<Node> {
        var visited = new Set<Node>()
        visited.add(this)

        this.to.forEach((n) => {
            var newlyVisited = n.dfs()
            if (newlyVisited.has(this)) {
                // If cycle detected, empty set returned
                return new Set<Node>()
            }

            // Get destination and all reachable from it
            newlyVisited.forEach(visited.add, visited)
        })
        return visited
    }
}
export default Node