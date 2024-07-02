The [[safeParse]] method applies a parser on an input and returns a [[result]] object describing how parsing finished. 

Unlike [[parse]], [[safeParse]] doesn’t throw exceptions for inputs that fail to parse. Instead, the failure is reflected in the [[result]] object.