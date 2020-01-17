import csv
import sys

if len(sys.argv) != 2:
	print("Usage: python3 csv_parser.py <csv name>")
	exit(1)
CSV = sys.argv[1]

TEST_ID = "eadelacr"
UNICODE_START = 257
NUM_CHARS_MAX = 300 # exact num is 239

"""
Map ids to each row list
configure weighted DL using each input
each fcn type
"""
idsToRows = {}
seenNums = {}
inputs = {}
charaMappings = {}

# empty list is empty string,
# which DL can use
def numsToCharas(nums):
	result = ""
	for num in nums.split():
		result += charaMappings[num]
	return result

def recordSeenVals(inp, out, realOut):
	for num in inp.split():
			seenNums[num] = True

	for num in out.split():
		seenNums[num] = True

	for num in realOut.split():
		seenNums[num] = True

def makeCharaMappings():
	sortedKeys = sorted(seenNums.keys())
	for i in range(len(sortedKeys)):
		charaMappings[sortedKeys[i]] = chr(i + UNICODE_START)

with open(CSV, newline='') as csvfile:
	rows = csv.reader(csvfile, delimiter=',')
	header = next(rows) # header
	for row in rows:
		ID = row[0]
		fcn = row[1]
		actNum = row[2]
		actType = row[3]
		time = row[4]
		inp = row[5]
		out = row[6]
		quizQ = row[7]
		realOut = row[8]
		result = row[9]
		guess = row[10]

		if actType == "eval_input":
			idsToRows[ID] = row
		recordSeenVals(inp, out, realOut)

makeCharaMappings()

for p in idsToRows:
	inp = idsToRows[p][5]
	# print(idsToRows)
	print("======")
	# print(inp)
	asChara = numsToCharas(inp)
	print(asChara)
	# for c in asChara:
	# 	print("'" + str(ord(c)) + "'")

# print("nums seen: ", len(seenNums.keys()))
