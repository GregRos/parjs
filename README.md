# HtmlReactRenderer
This is a module used for parsing HTML content and rendering it using React intrinsic elements and components.

It can be used to embed React components inside Markdown content, among other things, by processing embedded HTML blocks.

## How it works

The renderer processes your HTML content recursively, replacing regular HTML tags with corresponding intrinsic JSX elements and replacing special custom tags with React components.

You initialize the renderer with a collection of known name-component pairs. Each key in the object denotes the name of a component and each value either a component class or a string. A string value means that the custom tag will be mapped to an instrinsic JSX element with the specified name.

Here is an example:

	let knownComponents = {
		example : ExampleComponent,
		other : OtherComponent
	}

### Matching tags to component names

If the renderer finds a tag beginning with `cm-`, it will remove that prefix and try to match the remaining name with one of the known components.

Failure causes it to be emitted as a custom tag with the same name and a warning attribute.

### Specifying props

Props are passed as attribute values. For example, the following HTML tag will be rendered as a React component and the attribute values will be used as props

	<cm-example stringProp="string" numberProp=".1" arrayProp="[1, 2]" objProp="{a:'b'}"/>

Attribute values are parsed before being sent as props, so even though the attribute values are strings, HtmlReactRenderer will convert them into different types before sending them onwards.

1. Values that are valid ECMAScript 6 numbers are converted to numeric form, except for legacy octal syntax and similar.

2. The strings `true`, `false`, `null`, `undefined`, `NaN`, and similar are converted to their respective values.

3. Content that begins with `{` or `[` is parsed as a JavaScript array or object. The parsing is done using the `loose-json` module, which understands such things as `{a : 'b'}` so you can construct simple objects more naturally. Syntax errors in this mode throw an exception rather than fail silently.

4. Anything that isn't recognized as one of the above modes is taken as a string.

5. Beginning the value with a `@` character will parse the value verbatim as a string, with that character ignored. So if you want to start a string with that character, you have to escape it (e.g. `@@gmail` will be rendered `@gmail`).

### Specifying children

HTML blocks are parsed recursively, with children being parsed before their parents. So for example the following HTML:

	<div>
		<div>
			Hi
		</div>
	</div>

Will be parsed into an equivalent shadow DOM, with the inner `div` element being the child of the outer one.

You can also pass custom components as children of other custom components. This is one alternative to passing arguments as complex props.

### {![Embed]}


	<cm-parent prop="hi">
		<cm-child index="0"/>
		<cm-child index="1"/>
	</cm-parent>

### Customizing

#### Tag comprehension

The `cm-` prefix can be overriden by supplying a custom `nameResolver` when initializing the renderer, so you can have your own custom way of resolving tags.

The custom resolver should convert a tag name into a component name. If the tag name has no component name (e.g. in the default case, it doesn't smart with `cm-`) `null` should be returned.).

It is recommended that your name resolver use names with dashes because these distinguish custom tags from standard ones.

#### Parsing prop values
You can configure the renderer with your own prop value parser which can support additional values. The name of the prop is also supplied, and although it isn't used by the default parser, your custom implementation could do it.

It is strongly recommended that you keep complex processing logic out of the value parser and into the component itself.