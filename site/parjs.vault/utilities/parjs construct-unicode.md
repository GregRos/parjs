This script lets you construct a Unicode dataset, storing it directly as binary data in a file. You can then tell `parjs` how to fetch this file to construct the [[unicode]] parser.

```
Usage: parjs construct-unicode [options] <file>

Constructs a custom Unicode dataset, encoding it as a compressed binary file. If no options are specified, the default dataset will be used.

Most Unicode properties are used to process @prop=value character classes. However, the minimal Script and General_Category properties are needed to parse named character classes.

If you want to avoid loading them, you have to specify the --no-minimal option. Note that this will cause runtime errors if you use some of the named character classes.

Arguments:
  file     Where to store the dataset.

Options:
  --no-minimal          Prevents loading the minimal properties.
  --props <props-list>  Comma-separated list of Unicode properties to load.
```