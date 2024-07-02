---
aliases:
  - custom parser
  - custom parsers
---

#stage-0 %%Needs to be an article about building a custom parser. Probably need to implement most of the library before writing this! %%
Parjs tries to make it as easy as possible to write a custom parser, and gives you the same tools it uses to do so. 

# Interfaces
Parjs parser objects (`Parjsers`) have two interfaces they need to fulfill.
1. The **internal interface**, which includes the `apply`