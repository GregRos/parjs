import { GraphBuilder } from "./construct/create-graph.js";
import "./setup/logging.js";
const gb = new GraphBuilder();

export const unicodeGraph = await gb.load(false);
