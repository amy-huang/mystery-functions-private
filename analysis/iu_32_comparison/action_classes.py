import enum
from typing import *

class Action:
	def __init__(self, key, time):
		self.key = key
		self.time = time

class EvalInput(Action):
	def setInputOutput(self, inp, outp):
		self.input = inp
		self.output = outp

	def __str__(self):
		return "{} -> {}".format(self.input, self.output)

class QuizQ(Action):
	def setQ(self, quizNo, question, given, actual, result):
		self.quizNo = quizNo
		self.question = question
		self.given = given
		self.actual = actual
		self.result = result

	def __str__(self):
		return "QuizAnswer: [{}]	{} -> {}, actual {} {}".format(self.quizNo, self.question, self.given, self.actual, self.result)

class FinalAnswer(Action):
	def setGuess(self, guess):
		self.guess = guess
		self.tags = []

	def __str__(self):
		return "FinalGuess: {}".format(self.guess)

	def addTags(self, tags):
		self.tags += tags

###################################################

class QuizAttempt(Action):
	def __init__(self):
		self.responses = []
		self.answer = ""

	def __str__(self):
		res = ""
		for resp in self.responses:
			res += "	{}\n".format(resp)
		res += "	{}\n".format(self.answer)
		return res

	def setAnswer(self, answer):
		self.answer = answer

	def addQuizQ(self, quizQ):
		self.responses.append(quizQ)

###################################################

class ActionType(enum.Enum):
	EvalInput = 0
	QuizQ = 1
	FinalAnswer = 2

class SectionCounter:
	evalInputNum = 0
	quizAttemptNum = 0

	def nextEvalInputSection(self):
		name = "e" + str(self.evalInputNum)
		self.evalInputNum += 1
		return name

	def nextQuizAttemptSection(self):
		name = "q" + str(self.quizAttemptNum)
		self.quizAttemptNum += 1
		return name	

class FunctionAttempt:
	def __init__(self):
		self.sectionOrder = []
		self.EIs = {} # string name to list of eval inputs
		self.QAs = {} # string name to quiz attempts
		self.sectionType = None
		self.currSection = ""
		self.counter = SectionCounter()
		self.finalAnswer = None
		self.evalSectionLens = []

	def __str__(self):
		res = ""
		for section in self.sectionOrder:
			if section[0] == "e":
				for ei in self.EIs[section]:
					res += "	{}\n".format(ei)
			else:
				res += "{}\n".format(self.QAs[section])
		return res

	def addEvalInput(self, evalInput: EvalInput):
		# Start new eval input section if necessary
		if self.sectionType != ActionType.EvalInput:
			self.sectionType = ActionType.EvalInput
			self.currSection = self.counter.nextEvalInputSection()
			self.sectionOrder.append(self.currSection)
			self.EIs[self.currSection] = []

			self.evalSectionLens.append(0)

		# Add new eval input
		self.EIs[self.currSection].append(evalInput)
		self.evalSectionLens[-1] = self.evalSectionLens[-1] + 1

	def addQuizQ(self, quizQ: QuizQ):
		# Start new section if necessary
		if self.sectionType == ActionType.EvalInput or self.sectionType == None:
			self.sectionType = ActionType.QuizQ
			self.currSection = self.counter.nextQuizAttemptSection()
			self.sectionOrder.append(self.currSection)
			self.QAs[self.currSection] = QuizAttempt()

		# Add new quiz question
		self.sectionType = ActionType.QuizQ # In case was final answer before
		self.QAs[self.currSection].addQuizQ(quizQ)

	def addFinalAnswer(self, finalAnswer: FinalAnswer):
		# Start new eval input section if necessary
		# if self.sectionType == ActionType.EvalInput or self.sectionType == None:
		# 	print("WARNING final answer did not come after a quizQ")
		# 	self.sectionType = ActionType.FinalAnswer
		# 	self.currSection = self.counter.nextQuizAttemptSection()
		# 	self.sectionOrder.append(self.currSection)
		# 	self.QAs[self.currSection] = QuizAttempt()

		# # Add new quiz question
		# self.sectionType = ActionType.FinalAnswer # In case was quiz q before
		# self.QAs[self.currSection].setAnswer(finalAnswer)
		if self.finalAnswer != None:
			print("WARNING: another final answer given for this fcn")
		self.finalAnswer = finalAnswer

	def allEvals(self):
		res = []
		for section in self.sectionOrder:
			if section[0] == "e":
				for ei in self.EIs[section]:
					res.append(ei)
		return res

	def quizAttemptIndices(self):
		currIdx = 0
		res = []
		for section in self.sectionOrder:
			if section[0] == "e":
				currIdx += len(self.EIs[section])
			if section[0] == "q":
				res.append(currIdx)
		return res

	def addAnswerTags(self, tags):
		if self.finalAnswer == None:
			print("no final answer ")
			return
		self.finalAnswer.addTags(tags)

	def answerTags(self):
		if self.finalAnswer != None:
			return self.finalAnswer.tags
		return None

	def allActions(self):
		return self.sectionOrder, self.EIs, self.QAs

###################################################

class Subject:
	def __init__(self, ID):
		self.ID = ID
		self.functionAttempts = {} # Map fcn names to the section

	def __str__(self):
		res = "Subject {}\n".format(self.ID)
		for fcn in self.functionAttempts:
			res += "{}\n".format(fcn)
			res += "{}\n".format(self.functionAttempts[fcn])
		return res

	def addEvalInput(self, fcnName: str, evalInput: EvalInput):
		if fcnName not in self.functionAttempts:
			self.functionAttempts[fcnName] = FunctionAttempt()
		self.functionAttempts[fcnName].addEvalInput(evalInput)

	def addQuizQ(self, fcnName: str, quizQ: QuizQ):
		if fcnName not in self.functionAttempts:
			self.functionAttempts[fcnName] = FunctionAttempt()
		self.functionAttempts[fcnName].addQuizQ(quizQ)

	def addFinalAnswer(self, fcnName: str, finalAnswer: FinalAnswer):
		if fcnName not in self.functionAttempts:
			self.functionAttempts[fcnName] = FunctionAttempt()
		self.functionAttempts[fcnName].addFinalAnswer(finalAnswer)

	def addAnswerTags(self, fcnName: str, tags):
		self.functionAttempts[fcnName].addAnswerTags(tags)

	def getAnswerTags(self, fcnName: str):
		if fcnName in self.functionAttempts:
			return self.functionAttempts[fcnName].answerTags()
		return None

	def printAnswerTags(self):
		tags = ""
		for fcn in self.functionAttempts.keys():
			tags += "{}: {}\n".format(fcn, self.functionAttempts[fcn].answerTags())
		return tags

	def didFcn(self, name):
		if name in self.functionAttempts:
			return True
		return False

	def allFcnActions(self, name):
		if name in self.functionAttempts:
			return self.functionAttempts[name].allActions()
		return None, None, None

	def getEvalLens(self, fcn):
		if fcn in self.functionAttempts:
			return self.functionAttempts[fcn].evalSectionLens
		return None

#################################################################################

class Distributions:
	def __init__(self, ID):
		self.ID = ID
		self.traceLens = {}
		self.quizAttempts = {}
		self.EIsbetweenQAs = {}
		self.highestInputDiff = {}

	def __str__(self):
		res = "Distributions for {}\n".format(self.ID)

		# res += ("Num of inputs evaluated\n")
		# for i in range(sorted(self.traceLens.keys())[-1] + 1):
		# 	if i in self.traceLens:
		# 		res += "{}, {},\n".format(i, self.traceLens[i])
		# 	else:
		# 		res += "{}, {},\n".format(i, 0)

		res += ("Highest input diffs\n")
		for i in range(sorted(self.highestInputDiff.keys())[-1] + 1):
			if i in self.highestInputDiff:
				res += "	{}, {},\n".format(i, self.highestInputDiff[i])
				
		res += ("# quiz attempts\n")
		# Report average # quiz attempts, and % over 1
		sum = 0
		multipleAttempts = 0
		numSubs = 0
		for k in sorted(self.quizAttempts.keys()):
			curr = self.quizAttempts[k]
			sum += curr
			numSubs += 1
			if curr > 1:
				multipleAttempts += 1
			res += "	{}, {},\n".format(k, curr)
		res += "Average {} % multiple attempts {}\n".format(sum/numSubs, (100 * multipleAttempts)/numSubs)

		res += ("Inputs evaluated between quiz attempts\n")
		for k in sorted(self.EIsbetweenQAs.keys()):
			res += "	{}, {},\n".format(k, self.EIsbetweenQAs[k])

		return res

	def addNumEvals(self, numEvals):
		if numEvals not in self.traceLens:
			self.traceLens[numEvals] = 0
		self.traceLens[numEvals] = self.traceLens[numEvals] + 1
		# print("Added to trace len of {} frequency {} \n".format(numEvals, self.traceLens[numEvals]))

	def addQuizAttempts(self, attempts):
		if attempts not in self.quizAttempts:
			self.quizAttempts[attempts] = 0
		self.quizAttempts[attempts] = self.quizAttempts[attempts] + 1

	def addMaxDiff(self, diff):
		if diff not in self.highestInputDiff:
			self.highestInputDiff[diff] = 0
		self.highestInputDiff[diff] = self.highestInputDiff[diff] + 1

	def addEIsBwQAs(self, ID: str, evalLens):
		if ID in self.EIsbetweenQAs:
			print("WARNING: EI section lengths being re-assigned")
		self.EIsbetweenQAs[ID] = evalLens

class DistributionKeeper:
	def __init__(self):
		self.ratingsToDistros = {}
		self.ratingsToDistros["COR"] = Distributions("COR")
		self.ratingsToDistros["MCOR"] = Distributions("MCOR")
		self.ratingsToDistros["SCOR"] = Distributions("SCOR")
		self.ratingsToDistros["XCOR"] = Distributions("XCOR")

	def __str__(self):
		res = ""
		for rating in sorted(self.ratingsToDistros):
			res += "Rating {} distributions:\n".format(rating)
			res += str(self.ratingsToDistros[rating])
		return res
	
	def addNumEvals(self, rating, numEvals):
		if rating not in self.ratingsToDistros:
			self.ratingsToDistros[rating] = Distributions(rating)
		self.ratingsToDistros[rating].addNumEvals(numEvals)

	def addQuizAttempts(self, rating, attempts):
		if rating not in self.ratingsToDistros:
			self.ratingsToDistros[rating] = Distributions(rating)
		self.ratingsToDistros[rating].addQuizAttempts(attempts)

	def addMaxDiff(self, rating, diff):
		if rating not in self.ratingsToDistros:
			self.ratingsToDistros[rating] = Distributions(rating)
		self.ratingsToDistros[rating].addMaxDiff(diff)

	def addEIsBwQAs(self, rating, ID: str, evalLens):
		if rating not in self.ratingsToDistros:
			self.ratingsToDistros[rating] = Distributions(rating)
		self.ratingsToDistros[rating].addEIsBwQAs(ID, evalLens)