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
		if len(row) < len(header):
			print("row length mismatch")
		idsToRows[row[0]] = row
		inp = row[5]
		print(row)
		print(inp)

#print(idsToRows)
