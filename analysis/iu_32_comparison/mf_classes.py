class Subject:
	def __init__(self, ID):
		self.ID = ID
		self.actions = {} # fcns to lists of actions

	def __str__(self):
		res = "Subject {}\n".format(self.ID)
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

	def __str__(self):
		return "FinalGuess: {}".format(self.guess)

#################################################################
"""
getNums(val) returns list of vals considered seen upon encountering this value
toCharas(val) turns val to character based on mapping given
"""

class Bool:
	def getNums(val):
		if val == "true":
			return "1"
		return ["0"]

	def toCharas(val):
		return mappings[val]

class Int:
	def getNums(val):
		return [val]

	def toCharas(val, mappings):
		# return str(val)
		return mappings[val]

class ListInt:
	def getNums(val):
		nums = val.split()
		return nums

	def toCharas(val, mappings):
		charas = ""
		nums = val.split()
		for n in nums:
			# charas += chr(int(n))
			charas += mappings[n]
		return charas

class Float:
	def getNums(val):
		return [val]

	def toCharas(val, mappings):
		# return str(val)
		return mappings[val]