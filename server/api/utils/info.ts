/* utils for matching fields selected in GraphQL's info arg */

import { FieldNode, GraphQLResolveInfo } from "graphql";

// returns true if passed in info contains only fields in the
// array of fields, and false otherwise
const infoContainsOnlyFields = (info: GraphQLResolveInfo, fields: Array<string>): boolean => {
    return info.fieldNodes.every((fieldNode) =>
        fieldNode.selectionSet.selections.every((selection: FieldNode) => fields.includes(selection.name.value))
    );
};

export { infoContainsOnlyFields };
