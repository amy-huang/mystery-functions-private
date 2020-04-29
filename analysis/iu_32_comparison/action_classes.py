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

		# Add new eval input
		self.EIs[self.currSection].append(evalInput)

	def addQuizQ(self, quizQ: QuizQ):
		# Start new eval input section if necessary
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

	def answerTags(self):
		tags = ""
		for fcn in self.functionAttempts.keys():
			tags += "{}: {}\n".format(fcn, self.functionAttempts[fcn].answerTags())
		return tags

	def didFcn(self, name):
		if name in self.functionAttempts:
			return True
		return False