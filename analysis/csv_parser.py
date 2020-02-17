import csv
import sys
from Levenshtein import *
from datetime import *
from mf_classes import *
from statistics import *

if len(sys.argv) != 2:
    print("Usage: python3 csv_parser.py <csv name>")
    exit(1)
CSV = sys.argv[1]

TEST_ID = "eadelacr"
UNICODE_START = 0

# Values seen in inputs, outputs, actual outputs
seenNums = []
# Mapping seen value to unicode chara
charaMappings = {}

# Mapping functions to their input and output types
# fcn name -> [in type, outtype]
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

# Sequential input similarity analysis
subjects = {} # ID to Subject
inputs_per_fcn = {}    # fcn -> ID -> list of inputs eval'd before 1st quiz attempt

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
            print("error, num args does not match args found")
            print(fcn)
            print(args)

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
        seenNums.append(val)

# Sort seen nums and assign them to characters
def makeCharaMappings():
    sortedKeys = sorted(seenNums)
    for i in range(len(sortedKeys)):
        charaMappings[sortedKeys[i]] = chr(i + UNICODE_START)


#########################################################################

with open(CSV, newline='') as csvfile:
    rows = csv.reader(csvfile, delimiter=',')
    header = next(rows) # header

    # Current subject we're recording actions for
    subject = None

    for row in rows:
        # See if we need to start a new Subject
        ID = row[0]
        if subject == None:
            subject = Subject(ID)
        elif ID != subject.ID:
            subjects[subject.ID] = subject
            subject = Subject(ID)

        fcn = row[1]
        if fcn not in subject.actions:
            subject.actions[fcn] = []

        key = row[2]
        time = row[4]
        actType = row[3]
        action = None

        inType = in_out_types[fcn]
        outType = in_out_types[fcn]

        # Record specific action taken
        if (actType == "eval_input"):
            action = EvalInput(key, time)
            inp = row[5]
            out = row[6]
            action.setInputOutput(inp, out)

            recordSeenVals(getVals(fcn, True, inp))
            recordSeenVals(getVals(fcn, False, out))

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

            recordSeenVals(getVals(fcn, True, inp))
            recordSeenVals(getVals(fcn, False, out))
            recordSeenVals(getVals(fcn, False, realOut))

        elif (actType == "final_answer"):
            action = FinalAnswer(key, time)
            guess = row[10]
            action.setGuess(guess)
        else:
            print("unknown action type")

        subject.addAction(fcn, action)

        # Record the numerical values seen so we can map them
        # to characters in unicode range

makeCharaMappings()
# print(charaMappings)
# print(len(charaMappings.keys()))

# For each person's function session, look at 
# differences between eval input until next subject

diffs = {
    "Average": {},
    "Median": {},
    "SumParityInt": {},
    "SumParityBool": {},
    "Induced": {},
    "EvenlyDividesIntoFirst": {},
    "SecondIntoFirstDivisible": {},
    "FirstIntoSecondDivisible": {},
    "SumBetween": {},
}

correct_ids = {
    "Average": ["vidhawan", "2000375187", "jocorr", "loralee", "emsipes", "marghend", "sinschwa", "krbuen", "andhell", "sujprak", "jjandrad", "ctrierwi", "sbknepp", "Jonesham", "cjlatty" ]
}

traces = {
	"Average": {
		True: {},
		False: {},
	}
}

for ID in subjects:
    fcn_names = ["Average", "Median", "SumParityInt", "SumParityBool", "Induced", "EvenlyDividesIntoFirst", "SumBetween"]
    for fcn in fcn_names:
        if fcn not in subjects[ID].actions:
            continue

        lastAsNums = None
        lastIn = None

        # print(fcn)
        local_diffs = {}

        for i in range(len(subjects[ID].actions[fcn])):
            act = subjects[ID].actions[fcn][i]

            if type(act) == EvalInput:
                inType = in_out_types[fcn][0]

                inCharas = inType.toCharas(act.input, charaMappings)
                # compare with the last input eval'd, if existent
                if lastIn == None:
                    lastAsNums = act.input
                    lastIn = inCharas
                    continue
                d = distance(lastIn, inCharas)
                local_diffs[i] = d

                if fcn in correct_ids:
                    correct = False
                    if ID in correct_ids[fcn]:
                        correct = True
                    if ID not in traces[fcn][correct]:
                        traces[fcn][correct][ID] = []
                    traces[fcn][correct][ID].append(d)                        

                lastIn = inCharas
                lastAsNums = act.input

            elif type(act) == QuizQ or type(act) == FinalAnswer:
                traceLen = len(local_diffs.keys())
                if traceLen not in diffs[fcn]:
                    diffs[fcn][traceLen] = {}
                    for i in range(1, traceLen+1):
                        diffs[fcn][traceLen][i] = []

                for i in local_diffs:
                    diffs[fcn][traceLen][i].append(local_diffs[i])

                break
            else:
                print("unknown action type")

# print("median differences between subsequent inputs by length of trace")
# for fcn in diffs:
#     print(fcn)
#     for tLen in sorted(diffs[fcn].keys()):
#         distr = "length {} : ".format(tLen)
#         for i in range(1, tLen+1):
#             distr += str(median(diffs[fcn][tLen][i])) + " "
#         print(distr)

for fcn in traces:
    print("Correct traces")
    for ID in traces[fcn][True]:
        print(traces[fcn][True][ID])
    print("Incorrect traces")
    for ID in traces[fcn][False]:
        print(traces[fcn][False][ID])