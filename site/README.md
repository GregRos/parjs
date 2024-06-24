This is a lot of the documentation for v2. I haven’t actually written any code outside of various experiments that I haven’t pushed. 

You can view it as a specification of sorts. It’s a bit weird to write documentation first, but I find that’s what works best for me with a big project like this.
# Structure
I’m going to reuse a structure I’ve used for previous projects. The result will be a static site published using [Obsidian](https://obsidian.md/). All site files are found in the `/site` folder where `/` is the repository root.

To work on the site:
- Open the repository root using VS Code
- Go to the `site` subfolder and run `yarn watch`
- Open `/site/parjs.vault` with Obsidian. The `site` package is configured to compile stuff into this folder.

I’m going to keep the compiled files in git to make the experience smoother, so you can just open `parjs.vault` with Obsidian right away if you like.

## Obsidian
The Obsidian vault includes lots of plugins and a custom theme derived from [Royal Velvet](https://github.com/caro401/royal-velvet). There is also stuff written as code that needs Obsidian to be rendered, such as the list of WIP files. 

Here is how it looks like on my machine.
![[Obsidian.png]]
