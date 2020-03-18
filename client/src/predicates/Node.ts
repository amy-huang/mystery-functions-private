class Node {
    name = ""
    to = new Array<Node>()
    from = new Array<Node>()

    constructor(name: string) {
        this.name = name
    }

    printout(): string {
        var print = this.name + "\n"
        print += "  to:\n" 
        for (var i = 0; i < this.to.length; i++) {
            print += "  " + this.to[i].name + "\n"
        }
        print += "  from:\n" 
        for (var i = 0; i < this.from.length; i++) {
            print += "  " + this.from[i].name + "\n"
        }
        return print
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
        console.log("doing cycle")
        console.log(this.printout())
        for (var i = 0; i < this.to.length; i++) {
            var toNode = this.to[i]
            if (toNode.cycleHelper(this) === true) {
                console.log(toNode.name, "cycle found")
                return true
            }
        }
        return false
    }

    // Returns the empty set if cycle detected, otherwise
    // returns all nodes reachable from this one by DFS
    // including itself
    cycleHelper(origin: Node): boolean {
        console.log("doing cycle helper")
        console.log(this.printout())
        if (origin.name === this.name) {
            return true
        }

        for (var i = 0; i < this.to.length; i++) {
            var toNode = this.to[i]
            if (toNode.cycleHelper(origin) === true) {
                console.log(toNode.name, "cycle found")
                return true
            }
        }
        return false
    }
}
export default Node