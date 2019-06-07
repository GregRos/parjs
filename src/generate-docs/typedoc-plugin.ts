import {Component, ConverterComponent} from "typedoc/dist/lib/converter/components";
import {Converter} from "typedoc/dist/lib/converter/converter";
import {Context} from "typedoc/dist/lib/converter/context";
import {CommentPlugin} from "typedoc/dist/lib/converter/plugins/CommentPlugin";
import * as _ from "lodash";

@Component({name: "parjs-customization"})
export class ParjsCustomizationPlugin extends ConverterComponent {
    initialize() {
        this.listenTo(this.owner, {
            [Converter.EVENT_RESOLVE_BEGIN]: this._onBeginResolve,
        });
    }


    private _onBeginResolve(context: Context) {
        let arr = _.map(context.project.reflections, x => x);
        arr.forEach(x => {
            let remove = false;
            if (x.name.includes("stringLen")) {
                let a = 1;
            }
            if (x.flags.isExternal) {
                x.flags.isExternal = false;
            }
            remove = x.flags.isExported === false || x.flags.isPrivate === true;
            if (remove) {
                CommentPlugin.removeReflection(context.project, x);
            }
        });


    }
}
