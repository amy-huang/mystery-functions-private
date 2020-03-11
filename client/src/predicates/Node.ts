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

    cycle() {
        for (var i = 0; i < this.to.length; i++) {
            var toNode = this.to[i]
            if (toNode.cycleHelper(this) === true) {
                return true
            }
        }
        return false
    }

    // Returns the empty set if cycle detected, otherwise
    // returns all nodes reachable from this one by DFS
    // including itself
    cycleHelper(origin: Node): boolean {
        if (origin.name === this.name) {
            return true
        }

        for (var i = 0; i < this.to.length; i++) {
            var toNode = this.to[i]
            if (toNode.cycleHelper(origin) === true) {
                return true
            }
        }
        return false
    }
}
export default Node