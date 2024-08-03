This is a progress report. **It will only render if you’re viewing the site locally as an Obsidian vault.**

I’ve finished the general API, more or less, and now I need to work on  implementation-sensitive stuff that I’m less sure about, so this is where I start writing code.

Here is an overview of the different articles and how far along they are. If you’re viewing this in VS code or something, it will just be a block of code. However, if you’re using Obsidian, it will render a table with links and stars.

The maximum is just “doneish” because everything is liable to change. Also, right now it’s probably not written in the best way for newcomers to the library. A lot of the finishing touches will need to wait until some stuff has been implemented.

```dataviewjs
const stageMeaning = [
    "empty",
    "stub",
    "mess",
    "partial",
    "doneish"
]
const rows = dv.pages().map(page => {
    const stage = page.file.tags.find(x => x.startsWith("#stage-"))
    if (!stage) {
        return undefined
    }
    const stageNumber = +stage.replace("#stage-", "")
    console.log(page)
    return {
        folder: "/" + page.file.folder,
        link: page.file.link,
        stage: stageNumber
    }
}).filter(x => !!x).sort(x => x.folder).sort(x => -x.stage).map(obj => {
    const {link, stage, folder} = obj
    const fullStars = "★".repeat(stage)
    const emptyStars = "☆".repeat(4 - stage)
    const allStars = `${fullStars}${emptyStars} (${stageMeaning[stage]})`
    return [folder.trim(), link, allStars]
})

dv.table(["Folder", "File", "Stage"], rows)
```