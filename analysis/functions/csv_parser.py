import csv
import sys
from datetime import *
from action_classes import *
from statistics import *

from Levenshtein import distance, editops
from distance import jaccard
from stringdist import rdlevenshtein, levenshtein

from sklearn.cluster import KMeans
import numpy as np

if len(sys.argv) < 3:
    print("Usage: python3 csv_parser.py <CSV with all database rows> [<Function name 1> ...]")
    exit(1)

#################################################################
# Input Similarity Comparison

# Because we want to consider each integer a single character when
# using Levenshtein distance, we map each integer seen in the data
# to a unique string character. The resulting string for each
# input is then used for calculating distances between inputs.

# To help with mapping integers to characters and inputs to strings,
# the below classes each have a getNums method for extracting a 
# list of integers from the value of that type for the mapping of integers
# to characters, and a toCharas method to turn a value of that type
# into a string based on the mapping made.

class Bool:
	@staticmethod
	def getNums(val):
		if val == "true":
			return "1"
		return ["0"]

	@staticmethod
	def toCharas(val):
		return charaMappings[val]

class Int:
	@staticmethod
	def getNums(val):
		return [val]

	@staticmethod
	def toCharas(val):
		return charaMappings[val]

class ListInt:
	@staticmethod
	def getNums(val):
		nums = val.split()
		return nums

	@staticmethod
	def toCharas(val):
		charas = ""
		nums = val.split()
		for n in nums:
			charas += charaMappings[n]
		return charas

class Float:
	@staticmethod
	def getNums(val):
		return [val]

	@staticmethod
	def toCharas(val):
		return charaMappings[val]

# Function input and output types
in_out_types = {
    "Average": [ListInt, Float],
    "Median": [ListInt, Float],
    "SumParityInt": [ListInt, Int],
    "SumParityBool": [ListInt, Bool],
    "Induced": [Int, Int],
    "EvenlyDividesIntoFirst": [ListInt, Bool],
    "SecondIntoFirstDivisible": [ListInt, Bool],
    "FirstIntoSecondDivisible": [ListInt, Bool],
    "SumBetween": [ListInt, Int],
}

# Number of inputs per function
num_inputs = {
    "Average": 1,
    "Median": 1,
    "SumParityInt": 1,
    "SumParityBool": 1,
    "Induced": 1,
    "EvenlyDividesIntoFirst": 2,
    "FirstIntoSecondDivisible": 2,
    "SecondIntoFirstDivisible": 2,
    "SumBetween": 2,
}

# Keys are all of the integers seen; each value is True
seenNums = {}
# Mapping each seen value to a unicode character
charaMappings = {}

# Given an input or output for a function, 
# figure out what type the value is and get the corresponding
# integer values to return. For single integer, return a list with just itself,
# for lists of integers, return that list of integers, and for 
# booleans return 0 or 1
def getIntVals(fcn, isInput, value):
    valType = None
    # See if the value is a function input or output,
    # and retrieve the right type based on that
    if isInput == True:
        valType = in_out_types[fcn][0]
    else: 
        valType = in_out_types[fcn][1]

    # If there are multiple inputs, get values of each input
    if num_inputs[fcn] > 1:
        args = value.split()
        if isInput == True and len(args) != num_inputs[fcn]:
            # print("error, num args does not match args found")
            args = value.split(",")

        vals = []
        for a in args:
            # Call getNums on each argument to get integer values seen
            vals += valType.getNums(a)
        return vals

    # Only 1 input
    elif num_inputs[fcn] == 1:
        return valType.getNums(value)

    else:
        print("error, invalid number of arguments: {}".format(num_inputs[fcn]))

# Record the given list of integers as seen
def recordSeenInts(seenInts):
    for val in seenInts:
        seenNums[val] = True

# Sort the list of seen integers and assign each to a character
def makeCharaMappings():
    sortedKeys = sorted(seenNums.keys())
    for i in range(len(sortedKeys)):
        charaMappings[sortedKeys[i]] = chr(i)

####################################################################

def inducedDiff(first, second: EvalInput):
    return rdlevenshtein(first.input, second.input)

def inducedEditOps(first, second: EvalInput):
    return editops(first.input, second.input)

def inputEditOps(fcn:str, first, second: EvalInput):
    if fcn == "Induced":
        return inducedEditOps(first, second)

    inType = in_out_types[fcn][0]
    firstCharas = inType.toCharas(first.input)
    secondCharas = inType.toCharas(second.input)
    return editops(firstCharas, secondCharas)

def inputEditOpsFromBlank(inp: EvalInput):
    return editops("", inp.input)

def opsToNum(ops):
    if len(ops) == 0:
        return 0

    num = ""
    for op in ops:
        if op[0] == "insert":
            num += "1"
        if op[0] == "delete":
            num += "2"
        if op[0] == "replace":
            num += "3"
        num += str(op[1])
        num += str(op[2])
    return int(num)

def inputDifference(fcn:str, first, second: EvalInput):
    if fcn == "Induced":
        return inducedDiff(first, second)

    inType = in_out_types[fcn][0]
    firstCharas = inType.toCharas(first.input)
    secondCharas = inType.toCharas(second.input)
    return rdlevenshtein(firstCharas, secondCharas)



# Just the names
FCN_NAMES = ["Average", "Median", "SumParityBool", "SumParityInt", "SumBetween", "Induced"]

#################################################################

if __name__ == "__main__":
    # Do initial recording of each subject's traces
    idsToSubs = {}
    idsToAnonIds = {}
    with open("all_rows_anonymized.csv", "x") as anon:
        with open(sys.argv[1], newline='') as csvfile:
            rows = csv.reader(csvfile, delimiter=',')
            header = next(rows) # header
            print(header)
            anon.write(",".join(header) + "\n")

            # Current subject we're recording actions for
            subject = None

            for row in rows:
                # See if we need to start a new Subject
                ID = row[0]
                if subject == None:
                    subject = Subject(ID)
                    idsToSubs[ID] = subject
                elif ID != subject.ID:
                    subject = Subject(ID)
                    idsToSubs[ID] = subject

                fcnName = row[1]
                key = row[2]
                time = row[4]
                actType = row[3]
                action = None

                inType = in_out_types[fcnName]
                outType = in_out_types[fcnName]

                # Record specific action taken
                if (actType == "eval_input"):
                    action = EvalInput(key, time)
                    inp = row[5]
                    out = row[6]
                    action.setInputOutput(inp, out)

                    recordSeenInts(getIntVals(fcnName, True, inp))
                    recordSeenInts(getIntVals(fcnName, False, out))

                    subject.addEvalInput(fcnName, action)

                elif (actType == "quiz_answer"):
                    action = QuizQ(key, time)
                    quizQ = row[7]
                    inp = row[5]
                    out = row[6]
                    realOut = row[8]
                    result = row[9]

                    display = "✗"
                    if (result == "true"):
                        display = "✓"

                    action.setQ(quizQ, inp, out, realOut, display)

                    recordSeenInts(getIntVals(fcnName, True, inp))
                    recordSeenInts(getIntVals(fcnName, False, out))
                    recordSeenInts(getIntVals(fcnName, False, realOut))

                    subject.addQuizQ(fcnName, action)

                elif (actType == "final_answer"):
                    action = FinalAnswer(key, time)
                    guess = row[10]
                    action.setGuess(guess)
                    subject.addFinalAnswer(fcnName, action)
                # else:
                #     print("WARNING: unknown action type")

                # Get anon ID and write row to anon csv
                if ID not in idsToAnonIds:
                    newID = len(idsToAnonIds)
                    idsToAnonIds[ID] = newID
                anonID = idsToAnonIds[ID]
                row[0] = str(anonID)
                newRow = ",".join(row) + "\n"
                anon.write(newRow)

    for ID in idsToAnonIds:
        print("{}, {}".format(ID, idsToAnonIds[ID]))

    # Make character mappings using the characters observed
    makeCharaMappings()

    # Distributions to look at
    COR = "COR"
    MCOR = "MCOR"
    SCOR = "SCOR"
    XCOR = "XCOR"

    # ID to subject source
    subSource = {}

    # Answer ratings, ID to "fcn score"
    answerRatings = {}

    # Subject to list of comprehensiveness labels they got
    compRatings = {}
    allAnswerRatings = {}

    # Get fine grained tags 
    for whichFile in ["32", "IU"]:
        for fcn in FCN_NAMES:
            with open("answer_labels/{} fine grained labels - {}.csv".format(whichFile, fcn), newline='') as csvfile:
                rows = csv.reader(csvfile, delimiter=',')
                header = next(rows) # header

                for row in rows:
                    ID = row[0]
                    answer = row[1]
                    tags = []
                    for i in range(2, len(row)):
                        enteredTags = row[i].split()
                        for tag in enteredTags:
                            if tag != '':
                                tags.append(tag)

                    if ID not in idsToSubs:
                        print("WARNING: this ID has no subject", ID)
                        continue
                    if idsToSubs[ID] == None:
                        print("WARNING: this ID has None subject", ID)
                        continue
                    if idsToSubs[ID].didFcn(fcn):
                        idsToSubs[ID].addAnswerTags(fcn, tags)

                    subSource[ID] = whichFile

                    if "{}_{}".format(whichFile, ID) not in answerRatings:
                        answerRatings["{}_{}".format(whichFile, ID)] = []

                    rating = 0
                    if "COR" in tags:
                        rating = 4
                    elif "MCOR" in tags:
                        rating = 3
                    elif "SCOR" in tags:
                        rating = 2
                    elif "XCOR" in tags:
                        rating = 1

                    if ID not in compRatings:
                        compRatings[ID] = {}
                    if "NONS" in tags:
                        compRatings[ID][fcn] = "NONS"
                    elif "IDK" in tags:
                        compRatings[ID][fcn] = "IDK"
                    elif "NORM" in tags:
                        compRatings[ID][fcn] = "NORM"
                    else:
                        # compRatings[ID][fcn] = ""
                        print("Warning: {} does not have comprehensiveness rating for {}".format(ID, fcn))

                    # total comps/cors
                    if ID not in allAnswerRatings:
                        allAnswerRatings[ID] = {}
                    allAnswerRatings[ID][fcn] = rating

                    if rating == 0:
                        continue
                    answerRatings["{}_{}".format(whichFile, ID)].append("{} {}".format(fcn, rating))

    BrownComps = FcnSubDivider()
    IUComps = FcnSubDivider()
    compRatingLists = {}
    for ID in idsToSubs:
        if ID not in compRatings or ID not in allAnswerRatings:
            continue
        compRatingLists[ID] = []
        sub = idsToSubs[ID]
        # compRatingLists[ID] = [compRatings[name] for name in sub.fcnNames()]
        # print(sub.fcnNames())
        for fcn in sub.fcnNames():
            # print(fcn)
            if fcn in compRatings[ID]:
                if subSource[ID] == "IU":
                    IUComps.addCompRating(ID, fcn, compRatings[ID][fcn])
                    IUComps.addCorRating(ID, fcn, allAnswerRatings[ID][fcn])
                else:
                    BrownComps.addCompRating(ID, fcn, compRatings[ID][fcn])
                    BrownComps.addCorRating(ID, fcn, allAnswerRatings[ID][fcn])


    print("IU", IUComps)
    print("Brown", BrownComps)

    # for arID in answerRatings:
    #     print(arID)
    #     print("{}, {}, {}".format(arID.split("_")[0], arID.split("_")[1], len(answerRatings[arID])))    

    # Map fcn to correctness to tag frequencies. uh oh this calls for another class!!!
    # Then we can look at each fcn's things
    tagsByRating = TagsByFcn()

    # fcn to list of diff IDs
    diffsIDs = {} 
    # fcn to list of diff lists
    diffsLists = {}

    allIDs = []
    allLists = []

    # ID and fcn to ops vector
    numOps = {}
    # ID to num op trace
    editOps = {}
    # ID to average len of same op sequence size 2 and up
    stretchLens = {}
    # from this, get line graph, avg/med, frequency

    # ops frequency, list ops to num
    opsFreq = {}

    # stretch lens of op groups
    groupLens = {}

    # freq of higher/lower relationships - previous one vs. next one
    trendDicts = { "lower": { "lower": 0, "same": 0, "higher": 0 }, "same": { "lower": 0, "same": 0, "higher": 0 }, "higher": { "lower": 0, "same": 0, "higher": 0 } }

    # Open a csv for each corr rating, then go through subs and write Ls to csv
    distros = DistributionKeeper()
    for fcn in sys.argv[2:]:
        with open("COR_Ls.csv", "w") as COR_CSV:
            with open("MCOR_Ls.csv", "w") as MCOR_CSV:
                with open("SCOR_Ls.csv", "w") as SCOR_CSV:
                    with open("XCOR_Ls.csv", "w") as XCOR_CSV:
                        csv_dict = {}
                        csv_dict["COR"] = COR_CSV
                        csv_dict["MCOR"] = MCOR_CSV
                        csv_dict["SCOR"] = SCOR_CSV
                        csv_dict["XCOR"] = XCOR_CSV

                        for ID in idsToSubs.keys():
                            # Get correctness tag for answer
                            rating = None
                            tags = idsToSubs[ID].getAnswerTags(fcn)
                            if tags != None:
                                if "COR" in tags:
                                    rating = "COR"
                                elif "MCOR" in tags:
                                    rating = "MCOR"
                                elif "SCOR" in tags:
                                    rating = "SCOR"
                                elif "XCOR" in tags:
                                    rating = "XCOR"
                                else:
                                    # print("ID {} fcn {} has no rating".format(ID, fcn))
                                    continue

                                tagsByRating.addTags(fcn, tags)

                                # Consec input diffs to csv
                                evals = idsToSubs[ID].functionAttempts[fcn].allEvals()
                                distros.addNumEvals(rating, len(evals))

                                csvfile = csv_dict[rating]
                                # stretchLens = "{},".format(ID)
                                maxDiff = 0
                                diffsArray = []
                                ID_FCN = "{}_{}".format(ID, fcn)
                                numOps[ID_FCN] = []

                                currOps = ""
                                currLen = 0
                                editOps[ID_FCN] = []

                                for i in range(0, len(evals)):
                                    # edit ops
                                    ops = inputEditOps(fcn, evals[i-1], evals[i])
                                    # editOps[idfcn].append(opsToNum(ops)) # encoding actual ops
                                    if i == 0:
                                        ops = inputEditOpsFromBlank(evals[i])

                                    numOps[ID_FCN].append(len(ops))
                                    
                                    # Look at average length of same op sequences
                                    currOpsList = []
                                    for op in ops:
                                        currOpsList.append(op[0])
                                    nextOps = " ".join(sorted(currOpsList))

                                    # Next group of operations is the same as current streak
                                    if nextOps == currOps:
                                        currLen += 1
                                    else:
                                        # If no change in input, count as part of streak, keep currOps same
                                        if len(nextOps) == 0:
                                            currLen += 1
                                        else:
                                            # Change in ops means streak just ended
                                            if len(currOps) > 0:
                                                if not ID_FCN in stretchLens:
                                                    stretchLens[ID_FCN] = []
                                                stretchLens[ID_FCN].append(currLen)
                                                editOps[ID_FCN].append(currOps)

                                                if currOps not in groupLens:
                                                    groupLens[currOps] = []
                                                groupLens[currOps].append(currLen)
                                                # print("{} change in op {} to {}".format(ID_FCN, currOps, nextOps))
                                                if nextOps not in opsFreq:
                                                    opsFreq[nextOps] = []
                                                opsFreq[nextOps].append(currLen)

                                            # Start new streak
                                            currOps = nextOps
                                            currLen = 1

                                    # Edit distance for writing to csv
                                    # diff = inputDifference(fcn, evals[i-1], evals[i])
                                    # diffsArray.append(diff)
                                    # line += "{},".format(diff) # raw diff

                                    # if diff > maxDiff:
                                    #     maxDiff = diff

                                # If a stretch went all the way to the end, make sure to record if max
                                if len(currOps) > 0:
                                    if not ID_FCN in stretchLens:
                                        stretchLens[ID_FCN] = []
                                    stretchLens[ID_FCN].append(currLen)
                                    editOps[ID_FCN].append(currOps)

                                    if currOps not in groupLens:
                                        groupLens[currOps] = []
                                    groupLens[currOps].append(currLen)
                                    # print("{} end trace w streak {}".format(ID_FCN, currOps))

                                    if nextOps not in opsFreq:
                                        opsFreq[nextOps] = []
                                    opsFreq[nextOps].append(currLen)

                                # Writing edit distance to csv
                                # line += "\n"
                                # csvfile.write(line)
                                distros.addMaxDiff(rating, maxDiff)

                                # Add to list of all diff traces for this fcn
                                allIDs.append("{}_{}".format(ID, fcn))
                                allLists.append(diffsArray)
                                
                                sub = idsToSubs[ID]
                                acts, EIs, QAs = sub.allFcnActions(fcn)

                                if subSource[ID] == "32":
                                    distros.addQuizAttempts(rating, len(QAs.keys()))
                                    distros.addEIsBwQAs(rating, ID_FCN, sub.getEvalLens(fcn))
        # Per function printouts
        
        # print(distros.firstStretchStats())

        # Print edit ops
        # for ID in editOps:
        #     line = "{}, ".format(ID)
        #     for ops in editOps[ID]:
        #         line += "{}, ".format(ops)
        #     print(line)

    # print(distros.EIsBwQAs())
    # # print(distros.highestDiffs())
    # print(distros.numEvals())
    # print(distros.quizAttempts())

    # # Consecutive input difference clustering
    # maxConsecLen = 0
    # for t in allLists:
    #     if len(t) > maxConsecLen:
    #         maxConsecLen = len(t)
    # # Fill with 0s
    # filled = []
    # for trace in allLists:
    #     newTrace = []
    #     for val in trace:
    #         newTrace.append(val)
    #     while len(newTrace) < maxConsecLen:
    #         newTrace.append(0)
    #     filled.append(newTrace)

    # # Across all printouts
    # print("Ratings across all fcns done")
    # for ID in idsToSubs:
    #     sub = idsToSubs[ID]
    #     if ID not in subSource:
    #         continue
    #     if len(sub.answerTagsByOrder()) == 0:
    #         continue
    #     line = "{}, {}, ".format(subSource[ID], ID)
    #     for rating in sub.answerTagsByOrder():
    #         line += "{}, ".format(rating)
    #     totalScore = sum(sub.answerTagsByOrder())
    #     print(line)



    print("Ratings across all fcns done")
    allRatings = { "32": { "Average": { 4: 0, 3: 0, 2: 0, 1: 0}, "Median": { 4: 0, 3: 0, 2: 0, 1: 0}, "SumParityBool": { 4: 0, 3: 0, 2: 0, 1: 0}, "SumParityInt": { 4: 0, 3: 0, 2: 0, 1: 0}, "SumBetween": { 4: 0, 3: 0, 2: 0, 1: 0}, "Induced": { 4: 0, 3: 0, 2: 0, 1: 0} }, "IU": { "Average": { 4: 0, 3: 0, 2: 0, 1: 0}, "Median": { 4: 0, 3: 0, 2: 0, 1: 0}, "SumParityBool": { 4: 0, 3: 0, 2: 0, 1: 0}, "SumParityInt": { 4: 0, 3: 0, 2: 0, 1: 0}, "SumBetween": { 4: 0, 3: 0, 2: 0, 1: 0}, "Induced": { 4: 0, 3: 0, 2: 0, 1: 0} }}
    for ID in idsToSubs:
        sub = idsToSubs[ID]
        fcns = sub.fcnNames()
        for f in fcns:
            rating = sub.fcnScore(f)
            if rating > 0:
                # print("{}, {}, {}, {}".format(subSource[ID], ID, f, rating))
                allRatings[subSource[ID]][f][rating] += 1

    for which in allRatings:
        for fcn in allRatings[which]:
            line = "{}, {}, ".format(which, fcn)
            for rating in range(1, 5):
                line += "{}, ".format(allRatings[which][fcn][rating])
            print(line)

    #     sub.EIs
    # EIsBwQAs

    # avg lens per stretch of each operation group
    # for opsGroup in sorted(groupLens.keys()):
    #     print("{}, {}, {}".format(opsGroup, len(groupLens[opsGroup]), sum(groupLens[opsGroup])/ len(groupLens[opsGroup])))

    # duds32 = 0
    # dudsIU = 0
    # for stretchID in stretchLens:
    #     ID = stretchID.split("_")[0]
    #     trace = stretchLens[stretchID]
    #     if len(trace) < 2:
    #         if subSource[ID] == "32":
    #             duds32 += 1
    #         elif subSource[ID] == "IU":
    #             dudsIU += 1
    # print("duds 32 {}".format(duds32))
    # print("duds IU {}".format(dudsIU))

    # averiage deviation from average change in op chain length
    # chainLenDiffs = []
    # chainLenDiffFromAvgs = []
    # allChainLens = []
    # for eoID in stretchLens:
    #     for sl in stretchLens[eoID]:
    #         allChainLens.append(sl)
    # chainLenAvg = sum(allChainLens)/len(allChainLens)
    # print("chain len avg {}".format(chainLenAvg))
    # for eoID in stretchLens:
    #     lensTrace = stretchLens[eoID]
    #     for i in range(0, len(lensTrace)):
    #         if i > 0:
    #             diff = abs(lensTrace[i-1] - lensTrace[i])
    #             chainLenDiffs.append(diff)
    #             if eoID == "mghani1_Median":
    #                 print("{} idx {} diff bw lenths is {}".format(eoID, i, diff))
    #         diffFromAvg = abs(lensTrace[i] - chainLenAvg)
    #         chainLenDiffFromAvgs.append(diffFromAvg)
    #         if eoID == "mghani1_Median":
    #             print("{} idx {} diff from avg is {}".format(eoID, i, diffFromAvg))
    # avgDiffFromAvg = sum(chainLenDiffFromAvgs)/len(chainLenDiffFromAvgs)
    # avgConsecDiff = sum(chainLenDiffs)/len(chainLenDiffs)
    # print("Avg chain length diff from average: {} Avg diff bw consec chain lengths {}".format(avgDiffFromAvg, avgConsecDiff))

    magnDicts = { "lower": { "lower": [], "same": [], "higher": [] }, "same": { "lower": [], "same": [], "higher": [] }, "higher": { "lower": [], "same": [], "higher": [] } }
    trendDicts = { "lower": { "lower": 0, "same": 0, "higher": 0 }, "same": { "lower": 0, "same": 0, "higher": 0 }, "higher": { "lower": 0, "same": 0, "higher": 0 } }
    adjacentAreOnes = 0
    totalPoints = 0
    pointLens = [] 
    totalOpsDiff = []
    avgSetDiff = []
    for stretchID in stretchLens:
        ID = stretchID.split("_")[0]
        trace = stretchLens[stretchID]
        # print(stretchID, trace)
        for i in range(0, len(trace)):
            # Current point is > 1
            if trace[i] > 1:
                isSpikePoint = False
                # First point
                if i == 0:
                    # If exists next point
                    if len(trace) > 1:
                        totalPoints += 1
                        # If next point is 1
                        if trace[i+1] == 1:
                            adjacentAreOnes += 1
                            pointLens.append(trace[i])

                            currOps = editOps[stretchID][i].split()
                            nextOps = editOps[stretchID][i+1].split()
                            avgNumOpDiff = abs(len(currOps) - len(nextOps))
                            totalOpsDiff.append(avgNumOpDiff)

                            currSet = set(editOps[stretchID][i].split())
                            nextSet = set(editOps[stretchID][i+1].split())
                            maxSetDiff = max(len(currSet - nextSet) , len(nextSet - currSet))
                            avgSetDiff.append(maxSetDiff)
                elif i == len(trace) - 1:
                   # If exists prev point
                    if len(trace) > 1:
                        totalPoints += 1
                        # If prev point is 1
                        if trace[i-1] == 1:
                            adjacentAreOnes += 1 
                            pointLens.append(trace[i])

                            currOps = editOps[stretchID][i].split()
                            prevOps = editOps[stretchID][i-1].split()
                            avgNumOpDiff = abs(len(currOps) - len(prevOps))
                            totalOpsDiff.append(avgNumOpDiff)

                            prevSet = set(editOps[stretchID][i-1].split())
                            currSet = set(editOps[stretchID][i].split())
                            maxSetDiff = max(len(currSet - prevSet) , len(prevSet - currSet))
                            avgSetDiff.append(maxSetDiff)
                else:
                    totalPoints += 1
                    if trace[i-1] == 1 and trace[i+1] == 1:
                        adjacentAreOnes += 1
                        pointLens.append(trace[i])

                        currOps = editOps[stretchID][i].split()
                        prevOps = editOps[stretchID][i-1].split()
                        nextOps = editOps[stretchID][i+1].split()
                        avgNumOpDiff = abs(len(currOps) - len(prevOps))
                        avgNumOpDiff = abs(len(currOps) - len(nextOps))
                        avgNumOpDiff = avgNumOpDiff / 2
                        totalOpsDiff.append(avgNumOpDiff)

                        prevSet = set(editOps[stretchID][i-1].split())
                        currSet = set(editOps[stretchID][i].split())
                        nextSet = set(editOps[stretchID][i+1].split())
                        maxSetDiff = max(len(currSet - prevSet) , len(prevSet - currSet))
                        maxSetDiff += max(len(currSet - nextSet) , len(prevSet - nextSet))
                        maxSetDiff = maxSetDiff / 2
                        avgSetDiff.append(maxSetDiff)

            if i + 1 < len(trace):
                prevNum = trace[i-1]
                nextNum = trace[i+1]
                currNum = trace[i]
                # print(currNum, prevNum, nextNum)

                prevDict = {}
                dictName = ""
                if prevNum < currNum:
                    dictName = "lower"
                elif prevNum == currNum:
                    dictName = "same"
                elif prevNum > currNum:
                    dictName = "higher"
                prevDict = trendDicts[dictName]
                magD = magnDicts[dictName]

                if nextNum < currNum:
                    prevDict["lower"] += 1
                    magD["lower"].append(currNum - nextNum)
                    # print("{} length at index {} is {}. prev is {} \({}\) next is {} ({})".format(stretchID, i, currNum, prevNum, dictName, nextNum, "lower"))
                elif nextNum == currNum:
                    prevDict["same"] += 1
                    # print("{} length at index {} is {}. prev is {} \({}\) next is {} ({})".format(stretchID, i, currNum, prevNum, dictName, nextNum, "same"))
                elif nextNum > currNum:
                    prevDict["higher"] += 1
                    magD["same"].append(nextNum - currNum)
                    # print("{} length at index {} is {}. prev is {} \({}\) next is {} ({})".format(stretchID, i, currNum, prevNum, dictName, nextNum, "higher"))

    print("adjacent 1s", adjacentAreOnes)
    print("total points", totalPoints)
    print("average point lens", sum(pointLens)/len(pointLens))
    print("average diff in total num ops", sum(totalOpsDiff)/len(totalOpsDiff))
    print("average ops set diff", sum(avgSetDiff)/len(avgSetDiff))

    # probabilities for spikiness
    # totals = { "lower": 0, "same": 0, "higher": 0 }
    # for dictName in sorted(trendDicts.keys()):
    #     currDict = trendDicts[dictName]
    #     magnD = magnDicts[dictName]
    #     for nextRel in sorted(currDict.keys()):
    #         if len(magnD[nextRel]) > 0:
    #             print("{} {} {}".format(dictName, nextRel, sum(magnD[nextRel])/len(magnD[nextRel])))
    #         totals[dictName] += currDict[nextRel]
    #     print("last data point was {}, total next points is {}".format(dictName, totals[dictName]))

    # for dictName in sorted(trendDicts.keys()):
    #     currDict = trendDicts[dictName]
    #     for nextRel in sorted(currDict.keys()):
    #         print("last data point was {}, next data point is {}: freq is {}, likelihood is {}".format(dictName, nextRel, currDict[nextRel], (100 * currDict[nextRel])/totals[dictName]))

    # BrespondentsPerFcn = { }
    # IUrespondentsPerFcn = { }
    # allResps = { "32": {}, "IU": {} }
    # for combID in stretchLens:
    #     ID = combID.split("_")[0]
    #     FCN = combID.split("_")[1]

    #     respDict = {}
    #     if subSource[ID] == "32":
    #         respDict = BrespondentsPerFcn
    #     else:
    #         respDict = IUrespondentsPerFcn

    #     if FCN not in respDict:
    #         respDict[FCN] = []
    #     respDict[FCN].append(ID)
    #     if ID not in allResps[subSource[ID]]:
    #         allResps[subSource[ID]][ID] = 1
    # for fcn in BrespondentsPerFcn:
    #     print("{}, {}, {},".format("32", fcn, len(BrespondentsPerFcn[fcn])))
    # for fcn in IUrespondentsPerFcn:
    #     print("{}, {}, {},".format("IU", fcn, len(IUrespondentsPerFcn[fcn])))
    # print("{}, {}".format("32", len(allResps["32"])))
    # print("{}, {}".format("IU", len(allResps["IU"])))

    # # Most common ops between consecutive input evals
    # print("How many operation chains use these operations, and average lengths")
    # for ops in sorted(opsFreq.keys()):
    #     chainLens = opsFreq[ops]
    #     numChains = len(chainLens)
    #     print("{}, {}, {}".format(ops, numChains, chainLens[floor(numChains / 2)]))

    # Stretch len stats
    with open("sameOps.csv", "x") as SAMEOPS:
        with open("sameOpStats.csv", "x") as SAMEOPSTATS:
            for ID_FCN in stretchLens:
                ID = ID_FCN.split("_")[0]
                FCN = ID_FCN.split("_")[1]

                lentrace = ""
                score = idsToSubs[ID].ratingsByFcn()[FCN]
                avg = 0
                median = 0
                if len(stretchLens[ID_FCN]) > 0:
                    avg = sum(stretchLens[ID_FCN]) / len(stretchLens[ID_FCN])
                    median = sorted(stretchLens[ID_FCN])[floor(len(stretchLens[ID_FCN]) / 2)]

                    lentrace += "{}, {}, {}, {}, {}, ".format(subSource[ID], len(editOps[ID_FCN]), FCN, score, ID)

                    # Trace of stretch lengths
                    lenDistro = {}
                    for sl in stretchLens[ID_FCN]:
                        if sl not in lenDistro:
                            lenDistro[sl] = 0
                        lenDistro[sl] += 1
                        lentrace += "{}, ".format(sl)

                    # Terminal printout of same ops stretch length distros
                    # termPrint = "{}, ".format(ID_FCN)
                    # for sl in range(sorted(lenDistro.keys())[-1] + 1):
                    #     if sl not in lenDistro:
                    #         termPrint += "0, "
                    #     else:
                    #         termPrint += "{}, ".format(lenDistro[sl])

                    alleditOps = "{}, {}, {}, {}, {}, ".format(subSource[ID], len(editOps[ID_FCN]), FCN, score, ID)
                    for opGroup in editOps[ID_FCN]:
                        alleditOps += "{}, ".format(opGroup)
                    alleditOps += "\n"
                    SAMEOPS.write(alleditOps)

                # # Add actual trace of ops
                # for op in editOps[ID]:
                #     line += "{}, ".format(op)
                lentrace += "\n"
                SAMEOPSTATS.write(lentrace)

    

    # # Consecutive edit ops vector clustering
    # maxConsecLen = 0
    # allLists = []
    # for user in numOps:
    #     trace = numOps[user]
    #     if len(trace) > maxConsecLen:
    #         maxConsecLen = len(trace)
    #     allLists.append(numOps[user])
        
    # # Fill with 0s
    # filled = []
    # for l in allLists:
    #     newTrace = []
    #     for num in l:
    #         newTrace.append(num)
    #     while len(newTrace) < maxConsecLen:
    #         newTrace.append(0)
    #     filled.append(newTrace)

    # toCluster = np.array(filled)
    # print("WSS vals for {}".format("".join(sys.argv[2:])))
    # # Try a bunch of values for k, and record WSS for each to choose a final result
    # for k in range(1, 11):
    #     kmeans = KMeans(n_clusters = k).fit(toCluster)
    #     centroids = kmeans.cluster_centers_
    #     pred_clusters = kmeans.predict(toCluster)
    #     curr_sse = 0

    #     # Write result to CSV
    #     clusterIdxs = {}
    #     for i in range(len(kmeans.labels_)):
    #         if kmeans.labels_[i] not in clusterIdxs:
    #             clusterIdxs[kmeans.labels_[i]] = []
    #         clusterIdxs[kmeans.labels_[i]].append(i)

    #     csv_name = "{}_k{}.csv".format("".join(sys.argv[2:]), k)
    #     with open(csv_name, "w") as CSVFILE:
    #         for label in sorted(clusterIdxs.keys()):
    #             CSVFILE.write("Cluster {},\n".format(label))
    #             for idx in clusterIdxs[label]:
    #                 ID = allIDs[idx]
    #                 line = "{}, ".format(ID)
    #                 trace = allLists[idx]
    #                 for val in trace:
    #                     line += "{}, ".format(val)
    #                 line += "\n"
    #                 CSVFILE.write(line)
        
    #     # calculate square of Euclidean distance of each point from its cluster center and add to current WSS
    #     for i in range(len(toCluster)):
    #         curr_center = centroids[pred_clusters[i]]
    #         curr_sse += (toCluster[i, 0] - curr_center[0]) ** 2 + (toCluster[i, 1] - curr_center[1]) ** 2
        
    #     print("{}, {},".format(k, curr_sse))

    # print(tagsByRating)

    # print("Function distros")
    # posToFcnTotals = {}
    # for pos in range(5):
    #     posToFcnTotals[pos] = {}
    #     for fcn in FCN_NAMES:
    #         posToFcnTotals[pos][fcn] = 0
    # for ID in idsToSubs:
    #     sub = idsToSubs[ID]
    #     distro = sub.getFcnDistro()
    #     for pos in range(len(distro)):
    #         if pos in posToFcnTotals:
    #             fcn = distro[pos]
    #             if fcn in posToFcnTotals[pos]:
    #                 posToFcnTotals[pos][fcn] = posToFcnTotals[pos][fcn] + 1
    # for pos in range(5):
    #     line = "{}, ".format(pos)
    #     for fcn in FCN_NAMES:
    #         line += "{}, ".format(posToFcnTotals[pos][fcn])
    #     print(line)

    # with open("all_Ls.csv", "x") as csvfile:
    #     # Map each fcn to map of eval inputs length to list of traces from subjects
    #     # fcnToTraces = {} 
    #     for sub in idsToSubs.keys():
    #         idsToFcnTraces[sub.ID] = {}

    #         # print("{}\n\n".format(sub))
    #         # TODO: now look at input similarity and also proportions of sections by
    #         # looping over the subjects - for each subject and fcn, what is 
    #         # consec similarity look like - graphs?
    #         for fcn in sub.functionAttempts:
    #             evals = sub.functionAttempts[fcn].allEvals()

    #             # highestDiff = 0
    #             # highestDiffIdx = 0
    #             # for i in range(1, len(evals)):
    #             #     diff = inputDifference(fcn, evals[i-1], evals[i])
    #             #     if diff > highestDiff:
    #             #         highestDiff = diff
    #             #         highestDiffIdx = i-1
    #             # quizzesAttempted = 0
    #             # for idx in sub.functionAttempts[fcn].quizAttemptIndices():
    #             #     if highestDiffIdx > idx:
    #             #         quizzesAttempted += 1
    #             # csvfile.write(fcn + ", " + str(quizzesAttempted) + ",\n")

    #             # if fcn not in fcnToTraces:
    #             #     fcnToTraces[fcn] = {}
    #             # if len(evals) not in fcnToTraces[fcn]:
    #             #     fcnToTraces[fcn][len(evals)] = []
    #             # fcnToTraces[fcn][len(evals)].append(evals)

    #             idsToFcnTraces[sub.ID][fcn] = evals




