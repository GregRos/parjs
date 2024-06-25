Compatibility with v1 can be added using the import `parjs/compatibility`. This import contains the following, all of which are deprecated on release.

# v1 equivalents
All parsers and combinators from v1 mapped to their v2 counterparts. So `stringLen` maps to [[read]] and `manySepBy` to [[many#sepBy]].

# [[oldParse]]
The import makes the [[oldParse]] method visible on [[parser]] instances. It translates the v2 [[result]] and [[signal]] system to an equivalent v1 result.
