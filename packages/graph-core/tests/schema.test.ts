import { describe, expect, it } from "vitest";
import { createSchemaValidator, type GraphSchema } from "../src";

const schema: GraphSchema = {
  nodeTypes: {
    person: {
      label: "Person",
      style: { shape: "card" },
      fields: {
        name: { kind: "string", required: true }
      },
      customFieldSlots: {
        notes: { kind: "string" }
      }
    },
    organization: {
      label: "Organization",
      style: { shape: "zone" },
      fields: {
        name: { kind: "string", required: true }
      }
    }
  },
  edgeTypes: {
    membership: {
      label: "Membership",
      class: "structure",
      directed: true,
      sourceTypes: ["person"],
      targetTypes: ["organization"]
    }
  }
};

describe("createSchemaValidator", () => {
  it("accepts declared fields and approved extension slots", () => {
    const validator = createSchemaValidator(schema);

    expect(() =>
      validator.validateNode({
        id: "person:1",
        type: "person",
        fields: { name: "Ada" },
        extensions: { notes: "Lead strategist" }
      })
    ).not.toThrow();
  });

  it("rejects extension values outside declared slots", () => {
    const validator = createSchemaValidator(schema);

    expect(() =>
      validator.validateNode({
        id: "person:1",
        type: "person",
        fields: { name: "Ada" },
        extensions: { hidden: "forbidden" }
      })
    ).toThrowError('Extension field "hidden" is not allowed for node type "person"');
  });

  it("rejects structure edges with incompatible source and target types", () => {
    const validator = createSchemaValidator(schema);

    expect(() =>
      validator.validateEdge(
        {
          id: "edge:1",
          type: "membership",
          source: "organization:1",
          target: "person:1"
        },
        {
          "organization:1": { id: "organization:1", type: "organization", fields: { name: "Guild" } },
          "person:1": { id: "person:1", type: "person", fields: { name: "Ada" } }
        }
      )
    ).toThrowError('Edge type "membership" does not allow organization -> person');
  });
});
