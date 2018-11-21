import { Reflection, ReflectionKind } from "typedoc/dist/lib/models/reflections/abstract";
import { Component, ConverterComponent } from "typedoc/dist/lib/converter/components";
import { Converter } from "typedoc/dist/lib/converter/converter";
import { Context } from "typedoc/dist/lib/converter/context";
import { CommentPlugin } from "typedoc/dist/lib/converter/plugins/CommentPlugin";
import { ContainerReflection } from "typedoc/dist/lib/models/reflections/container";
import _ = require("lodash");
import {Es6} from "../lib/common/common";
import regexFlags = Es6.regexFlags;

@Component({ name: "test" })
export class TestPlugin extends ConverterComponent {
	/** List of module reflections which are models to rename */

	initialize() {
		this.listenTo(this.owner, {
			[Converter.EVENT_BEGIN]: this._onBegin,
			[Converter.EVENT_CREATE_DECLARATION]: this._onDeclaration,
			[Converter.EVENT_RESOLVE_BEGIN]: this._onBeginResolve,
		});
	}

	/**
	 * Triggered when the converter begins converting a project.
	 *
	 * @param context  The context object describing the current state the converter is in.
	 */
	private _onBegin(context: Context) {

	}

	/**
	 * Triggered when the converter has created a declaration reflection.
	 *
	 * @param context  The context object describing the current state the converter is in.
	 * @param reflection  The reflection that is currently processed.
	 * @param node  The node that is currently processed if available.
	 */
	private _onDeclaration(context: Context, reflection: Reflection, node?) {
		if (reflection.kindOf(ReflectionKind.ExternalModule)) {
			let x = 1
		}

		if (reflection.comment) {
			CommentPlugin.removeTags(reflection.comment, "module");
			CommentPlugin.removeTags(reflection.comment, "preferred");
		}
	}

	/**
	 * Triggered when the converter begins resolving a project.
	 *
	 * @param context  The context object describing the current state the converter is in.
	 */
	private _onBeginResolve(context: Context) {
		let projRefs = [].slice.call(context.project.reflections);
		let refsArray: Reflection[] = Object.keys(projRefs).reduce((m, k) => {
			m.push(projRefs[k]);
			return m;
		}, []);


	}
}
