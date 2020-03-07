class ConcreteInstParsing {
    // Checks if inst declaration is correct, though doesn't check
    // for validity of the items within each set, just set names


    static setDefs(instance: string): Map<string, Array<string>> {
        var defs = new Map<string, Array<string>>()
        var spaceTokens = instance.trim().split(/\s+/)
        if (spaceTokens.length < 4) {
          alert("Malformed concrete instance")
          // console.log("less than 4 space tokens")
          return defs
        }
        if (spaceTokens[0] !== "inst") {
          alert("Malformed concrete instance")
          // console.log("inst keyword missing")
          return defs
        }
        if (spaceTokens[2] !== "{") {
          alert("Malformed concrete instance")
          console.log("no start bracket")
          return defs
        }
        if (spaceTokens[spaceTokens.length - 1] !== "}") {
          alert("Malformed concrete instance")
          // console.log("no end bracket")
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
            // console.log("equal not between 2 strings", onEqual)
            return new Map<string, Array<string>>()
          }
  
          // Get set name
          var setName = onEqual[0].trim()
          if (!setName.match(/^[A-Za-z0-9]+$/)) {
            alert("Malformed concrete instance - set name should be alphanumeric")
            // console.log(setName)
            return new Map<string, Array<string>>()
          }
          // Setname already exists
          if (defs.has(setName)) {
            alert("Malformed concrete instance - repeated set name")
            // console.log(setName)
            return new Map<string, Array<string>>()
          }
          
          // For now only support union operater
          var items = onEqual[1].split("\+")
          // console.log("items", items)
          for (var j = 0; j < items.length; j++) {
            var item = items[j].trim()
            if (item === "") {
              alert("Malformed concrete instance")
              // console.log("empty item", item)
              return new Map<string, Array<string>>()
            }
  
            // console.log("item", item)
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
        // console.log("final defs", defs)
  
        return defs
    }
}

export default ConcreteInstParsing