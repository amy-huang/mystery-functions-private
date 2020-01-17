import csv
import sys

if len(sys.argv) != 2:
	print("Usage: python3 csv_parser.py <csv name>")
	exit(1)
CSV = sys.argv[1]

"""
Map ids to each row list
configure weighted DL using each input
each fcn type
"""
idsToRows = {}

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

		if len(row) < len(header):
			print("row length mismatch")
		idsToRows[ID] = row
		# print(row)

		print(ID, fcn, actNum, actType, time, inp, out, quizQ, realOut, result, guess)
		print(inp.split())
#print(idsToRows)
