/** The three trie node types. */
export enum NodeType {
    /** A dummy node that represents a node with all bits 0. */
    Zeroes = 0,
    /** A dummy node that represents a node with all bits 1. */
    Ones = 1,
    /** Some bits are 0 and some are 1. This is a real node. */
    Real = 2
}
/**
 * A breakdown of possible node type combinations.
 *
 * Why This: To make switch statements of `TypeOfA×TypeOfB` more readable. The switch statements are
 * needed to make sure code is mono morphic.
 */
export enum NodeCombo {
    Zeroes_Zeroes = (NodeType.Zeroes << 2) | NodeType.Zeroes,
    Ones_Zeroes = (NodeType.Ones << 2) | NodeType.Zeroes,
    Zeroes_Ones = (NodeType.Zeroes << 2) | NodeType.Ones,
    Ones_Ones = (NodeType.Ones << 2) | NodeType.Ones,
    Real_Zeroes = (NodeType.Real << 2) | NodeType.Zeroes,
    Zeroes_Real = (NodeType.Zeroes << 2) | NodeType.Real,
    Full_One = (NodeType.Real << 2) | NodeType.Ones,
    One_Full = (NodeType.Ones << 2) | NodeType.Real,
    Full_Full = (NodeType.Real << 2) | NodeType.Real
}
/**
 * Indicates which node to return in a binary operation that allows fast return.
 *
 * Why This: This breakdown reduces the amount of duplicate code that needs to be written, while
 * making sure code stays mono morphic.
 */
export enum FastReturn {
    /** No fast return is possible. */
    None = 0,
    /** The left node can be returned. */
    Left = 1,
    /** The right node can be returned. */
    Right = 2
}
/**
 * Given a node type combination bitmap, this computes the FastReturn on an AND operation between
 * the node types.
 *
 * @param ab The node combination bitmap.
 * @returns
 */
export function and_getFastReturn(ab: NodeCombo): FastReturn {
    switch (ab) {
        case NodeCombo.Zeroes_Zeroes:
        case NodeCombo.Zeroes_Ones:
        case NodeCombo.Zeroes_Real:
        case NodeCombo.Ones_Ones:
        case NodeCombo.Full_One:
            return FastReturn.Left;
        case NodeCombo.Ones_Zeroes:
        case NodeCombo.Real_Zeroes:
        case NodeCombo.One_Full:
            return FastReturn.Right;
    }
    return FastReturn.None;
}
/**
 * Given a node type combination bitmap, this computes the FastReturn on an OR operation between the
 * node types.
 *
 * @param ab The node combination bitmap.
 * @returns
 */
export function or_getFastReturn(ab: NodeCombo): FastReturn {
    switch (ab) {
        case NodeCombo.Zeroes_Zeroes:
        case NodeCombo.Ones_Zeroes:
        case NodeCombo.Real_Zeroes:
        case NodeCombo.Ones_Ones:
        case NodeCombo.One_Full:
            return FastReturn.Left;
        case NodeCombo.Zeroes_Ones:
        case NodeCombo.Zeroes_Real:
        case NodeCombo.Full_One:
            return FastReturn.Right;
    }
    return FastReturn.None;
}
export type BitRange = {
    start: number;
    end: number;
};
