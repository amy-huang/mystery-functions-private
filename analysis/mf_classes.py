class Subject:
	def __init__(self, ID):
		self.ID = ID
		self.actions = {} # fcns to lists of actions

	def __str__(self):
		res = ""
		res += "Subject {}\n".format(self.ID)
		for fcn in self.actions:
			res += "	{}\n".format(fcn)
			for a in self.actions[fcn]:
				res += "		"
				res += str(a)
				res += "\n"
		return res

	def addAction(self, fcn, action):
		if fcn not in self.actions:
			self.actions[fcn] = []
		self.actions[fcn].append(action)


class Action:
	def __init__(self, key, time):
		self.key = key
		self.time = time

# sorted with the ID, and which function
# 
class EvalInput(Action):
	def setInputOutput(self, inp, outp):
		self.input = inp
		self.output = outp

	def __str__(self):
		res = ""
		res += self.input
		res += self.output
		return res

class QuizQ(Action):
	def setQ(self, quizNo, question, given, actual, result):
		self.quizNo = quizNo
		self.question = question
		self.given = given
		self.actual = actual
		self.result = result

	def __str__(self):
		res = ""
		res += self.quizNo
		res += self.result
		return res

class FinalAnswer(Action):
	def setGuess(self, guess):
		self.guess = guess

	def __str__(self):
		res = ""
		res += self.guess
		return res

# def readInt(read: str):
# 	###
# def Float(read: str):
# 	##
# def readListInt(read: str):
# 	##
# def readBool(read: str):
# 	##