# HelloWrite
HelloWrite is a powerful publishing system. It's similar *in principle* to systems like Jekyll, in that you can use it to do the same things, like host a personal blog or the landing page for an open-source project, but in practice it does things very differently.

## All client-side
HelloWrite is entirely client-side and requires neither a server capable of running server-side frameworks or a publishing step for generating static content.

This also means you don't have to install anything to get it to work, though you probably will need to install a JSX compiler to use JSX.

HelloWrite is written using the SPA model.

## 100% React
HelloWrite uses React under the hood for lightning-fast performance and extensibility. You can embed HelloWrite components inside other React components, and embed external components inside content published by HelloWrite

## Unique publishing model
HelloWrite uses a unique publishing model that lets you combine large amounts of content written in Markdown (or, with plugins, other markup languages) and dynamic components.

For example, you can use HelloWrite to write markdown content and include placeholders that, when rendered using HelloWrite, will contain special components like interactive charts.

Using React allows external dynamic components to influence those interactive charts in real-time.

# Parts

## Markdown Renderer
One of the most important parts of the HelloWrite system is the CommonMark markdown renderer that converts markup to React components.

You can access the markdown processor using `HelloWrite.Markdowner`.

## Special Content Types


### Content Indexes

1. Markdown content

#### Content indexes
HelloWrite doesn't require any server-side processes in order to function, so it can't do things like scan folders 

## Page Types
For simplification purposes, HelloWrite divides pages into several different types.

## Content Index
A content index is a structural representation of a menu.



```











1
```
