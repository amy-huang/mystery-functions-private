import csv
import sys
from datetime import *
from action_classes import *
from statistics import *

from Levenshtein import distance
from distance import jaccard
from stringdist import rdlevenshtein, levenshtein

if len(sys.argv) < 2:
    print("Usage: python3 csv_parser.py <csv0> [csv1, csv2, ...]")
    exit(1)

#################################################################
# Making the character mappings for input similarity comparison

# Values seen in inputs, outputs, actual outputs
seenNums = {}
# Mapping seen value to unicode chara
charaMappings = {}
# For where to start mappings
UNICODE_START = 0

def getVals(fcn, isIn, inOrOut):
    valType = None
    if isIn == True:
        valType = in_out_types[fcn][0]
    else: 
        valType = in_out_types[fcn][1]

    # Get vals based on arg count
    if num_inputs[fcn] > 1:
        args = inOrOut.split()
        if isIn == True and len(args) != num_inputs[fcn]:
            # print("error, num args does not match args found")
            # print(fcn)
            # print(args)
            # for 2 inp fcns
            args = inOrOut.split(",")

        vals = []
        for a in args:
            vals += valType.getNums(a)
        return vals

    elif num_inputs[fcn] == 1:
        return valType.getNums(inOrOut)

    else:
        print("error, > 1 args for fcn")

def recordSeenVals(someVals):
    for val in someVals:
        seenNums[val] = True

# Sort seen nums and assign them to characters
def makeCharaMappings():
    sortedKeys = sorted(seenNums.keys())
    # print("num unique charas", len(sortedKeys))
    # print(sortedKeys)
    for i in range(len(sortedKeys)):
        charaMappings[sortedKeys[i]] = chr(i + UNICODE_START)

def inducedDiff(first, second: EvalInput):
    firstNum = int(first.input)
    secondNum = int(second.input)
    return abs(firstNum - secondNum)

def inputDifference(fcn:str, first, second: EvalInput):
    if fcn == "Induced":
        return inducedDiff(first, second)

    inType = in_out_types[fcn][0]
    firstCharas = inType.toCharas(first.input)
    secondCharas = inType.toCharas(second.input)
    return levenshtein(firstCharas, secondCharas)

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
		# return str(val)
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
			# charas += chr(int(n))
			charas += charaMappings[n]
		return charas

class Float:
	@staticmethod
	def getNums(val):
		return [val]

	@staticmethod
	def toCharas(val):
		# return str(val)
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

# Just the names
FCN_NAMES = ["Average", "Median", "SumParityBool", "SumParityInt", "SumBetween", "Induced"]

#################################################################

if __name__ == "__main__":
    # Do initial recording of each subject's traces
    csvs = {}
    idsToSubs = {}
    for CSV_NAME in sys.argv[1:]:
        # Keep track of each subject's data
        csvs[CSV_NAME] = []

        with open(CSV_NAME, newline='') as csvfile:
            rows = csv.reader(csvfile, delimiter=',')
            header = next(rows) # header

            # Current subject we're recording actions for
            subject = None

            for row in rows:
                # See if we need to start a new Subject
                ID = row[0]
                if subject == None:
                    subject = Subject(ID)
                    idsToSubs[ID] = subject
                elif ID != subject.ID:
                    csvs[CSV_NAME].append(subject)
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

                    recordSeenVals(getVals(fcnName, True, inp))
                    recordSeenVals(getVals(fcnName, False, out))

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

                    recordSeenVals(getVals(fcnName, True, inp))
                    recordSeenVals(getVals(fcnName, False, out))
                    recordSeenVals(getVals(fcnName, False, realOut))

                    subject.addQuizQ(fcnName, action)

                elif (actType == "final_answer"):
                    action = FinalAnswer(key, time)
                    guess = row[10]
                    action.setGuess(guess)
                    subject.addFinalAnswer(fcnName, action)
                # else:
                #     print("WARNING: unknown action type")

    # Make character mappings using the characters observed
    makeCharaMappings()

    # Distributions to look at
    COR = "COR"
    MCOR = "MCOR"
    SCOR = "SCOR"
    XCOR = "XCOR"

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



    # Open a csv for each corr rating, then go through subs and write Ls to csv
    for fcn in ["Induced"]:
        distros = DistributionKeeper()
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
                                    print("ID {} fcn {} has no rating".format(ID, fcn))
                                    continue

                                # Consec input diffs to csv
                                evals = idsToSubs[ID].functionAttempts[fcn].allEvals()
                                distros.addNumEvals(rating, len(evals))
                                # if (rating == "COR" or rating == "MCOR") and len(evals) < 5:
                                #     print("Subject {} rating {} only evaluated {} inputs".format(ID, rating, len(evals)))

                                csvfile = csv_dict[rating]
                                line = "{},".format(ID)
                                maxDiff = 0
                                for i in range(1, len(evals)):
                                    diff = inputDifference(fcn, evals[i-1], evals[i])
                                    line += "{},".format(diff) # raw diff

                                    if diff > maxDiff:
                                        maxDiff = diff
                                line += "\n"
                                # csvfile.write(line)
                                distros.addMaxDiff(rating, maxDiff)
                                
                                sub = idsToSubs[ID]
                                acts, EIs, QAs = sub.allFcnActions(fcn)
                                distros.addQuizAttempts(rating, len(QAs.keys()))
                                distros.addEIsBwQAs(rating, sub.ID, sub.getEvalLens(fcn))
        print(distros)
    

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

        # Printing raw traces to terminal
        # for fcn in fcnToTraces:
        #     inType = in_out_types[fcn][0]
        #     # print("{}\n".format(fcn))
        #     csvfile.write("{}\n".format(fcn))

        #     for trace_len in sorted(fcnToTraces[fcn].keys()):
        #         if trace_len == 0:
        #             csvfile.write("0,0,\n") # placeholder for checking num people correctness
        #             continue

        #         traces = fcnToTraces[fcn][trace_len]
        #         sums = [0] * (trace_len - 1)

        #         for trace in traces:
        #             # TEST to see example trace, double check distance measure
        #             # if len(trace) == 13 and fcn == "Induced":
        #             #     print(fcn)
        #             #     for i in range(len(trace)):
        #             #         print(trace[i].input)

        #             # sumJacc = 0
        #             # line = "{},".format(trace_len)
        #             # for i in range(1, len(trace)):
        #             #     diff = inputDifference(fcn, trace[i-1], trace[i])
        #             #     sumJacc += diff
        #             # line += "{},".format(sumJacc/trace_len) # average jaccard dist

        #             # ones = 0
        #             # line = "{},".format(trace_len)
        #             # for i in range(1, len(trace)):
        #             #     diff = inputDifference(fcn, trace[i-1], trace[i])
        #             #     if diff == 1:
        #             #         ones += 1
        #             # line += "{},".format(100 * ones/trace_len) # % of ones

        #             line = "{},".format(trace_len)
        #             for i in range(1, len(trace)):
        #                 diff = inputDifference(fcn, trace[i-1], trace[i])
        #                 line += "{},".format(diff) # raw diff
        #             line += "\n"
        #             csvfile.write(line)



