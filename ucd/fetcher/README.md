# UCD Fetcher
This package fetches files from the UCD proper. It exports an index of these files through the `UCD` export, and an object that can fetch those files from the network. 

**Currently, this package is private and shouldn’t be published.**

It currently doesn’t include files from the Unihan database, which is an entirely separate and much larger tarpit.

```typescript
import {UCD, UcdFetcher} from "ucd-fetcher"

// Initialize with a verison number
const fetcher = new UcdFetcher("15.1.0")

// Fetch UnicodeData.txt
console.log(
	await fetcher.fetch(UCD.UnicodeData)
)
```

This is most likely something that should be done before publishing. The files are very large and you shouldn’t make clients fetch them.
