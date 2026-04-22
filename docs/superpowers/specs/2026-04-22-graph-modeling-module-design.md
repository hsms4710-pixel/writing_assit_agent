# Graph Modeling Module Design

**Date:** 2026-04-22
**Status:** Implemented for V1 graph modeling module on 2026-04-22
**Target:** First sub-project before the full writing / roleplay agent framework

## Summary

Build a reusable graph modeling module for React / Next.js host applications. The module must support generic property-graph modeling, visual editing, storage, and interaction for worldbuilding-style data without hardcoding a writing-only domain model.

The first milestone focuses on a reusable module, not the full agent framework. It must work as a standalone embeddable product surface now and remain reusable for future writing, roleplay, and non-writing projects.

## Goals

- Provide a reusable graph modeling foundation that can be embedded into multiple products.
- Model data as a generic property graph, not a fixed `world -> organization -> person` tree.
- Support deep structural nesting plus cross-structure and cross-region relations.
- Deliver a product-usable editor experience for visual graph creation and maintenance.
- Support local-first persistence with explicit extension points for later remote sync.
- Expose interfaces that a later agent framework can call without redesigning the graph core.

## Non-Goals

- No natural-language graph generation in V1.
- No agent orchestration in V1.
- No real-time multi-user collaboration in V1.
- No backend service requirement in V1.
- No hardcoded writing-specific schema in the engine.

## Scope

V1 includes:

- Graph data modeling
- Schema-driven graph validation
- Template-based graph initialization
- Visual graph editing
- Scene-based layout persistence
- Local persistence
- Remote sync adapter boundary
- React host integration

V1 excludes:

- LLM parsing or graph extraction from text
- Hermes-style user preference evolution
- Writing assistant flows
- Roleplay context management
- Full agent runtime

## Product Shape

The module ships as three packages:

### `@graph/core`

Responsibilities:

- graph store
- node / edge lifecycle
- command pipeline
- undo / redo history
- schema and validation
- template instantiation
- query and traversal helpers
- storage ports
- sync ports

Constraints:

- no React dependency
- generic graph model only
- host-agnostic persistence API

### `@graph/react`

Responsibilities:

- provider
- hooks and selectors
- command dispatch helpers
- host lifecycle bridge
- save / sync status bridge

Constraints:

- thin binding layer over `@graph/core`
- no editor-specific business logic

### `@graph/editor`

Responsibilities:

- primary scene canvas
- container zones
- relation rendering
- inspector panel
- structure navigator
- template picker
- interaction presets

Constraints:

- optional UI package
- hosts may embed the full editor or selected surfaces only

## Core Modeling Decision

The source of truth is a generic property graph.

- Nodes are typed instances with arbitrary schema-defined fields.
- Edges are typed relations with direction, metadata, and validation.
- Structural relationships are represented as a special edge category, not as a hardcoded single-parent tree.

This allows:

- deep containment
- multiple memberships
- cross-region affiliations
- multiple organizational positions for a single person
- reuse outside writing scenarios

## Data Model

### Graph Layer

The graph layer stores business meaning.

Core concepts:

- `Node`
- `Edge`
- `NodeType`
- `EdgeType`
- `Schema`
- `Template`

Expected properties:

- stable ids
- typed metadata
- validation state
- revision / history compatibility

### Structure Edge Class

The engine recognizes a `structure` edge class for relationships such as:

- containment
- location
- composition
- membership

Important constraint:

- structure edges remain edges, not implicit parent pointers

This supports both hierarchy-aware behavior and graph flexibility.

A node may have zero, one, or many structure edges at the same time as allowed by schema rules.

### Scene Layer

The scene layer stores visual projection state separately from graph semantics.

It contains data such as:

- node position
- node size
- node shape preset
- container geometry
- z-order
- collapsed state
- active scene metadata

Reason for separation:

- moving a node on canvas must not silently rewrite business structure
- the same graph can later support multiple scenes or projections
- users can organize visual space meaningfully without corrupting semantic links

Schema defines default visual presentation. Scene data stores per-scene placement and overrides.

## Schema Strategy

The schema is host-defined, with limited user extensibility in V1.

### Developer-Controlled

The host application defines:

- node types
- edge types
- field definitions
- validation rules
- default display styles
- template presets

### User Extension in V1

The end user may extend within bounded limits, such as:

- adding labels
- adding selected custom fields in extension slots explicitly allowed by the host schema
- working from predefined templates

V1 does not include a full end-user schema designer.

## Template Strategy

The module supports template-based graph initialization.

Templates may define:

- starter nodes
- starter edges
- starter scene layout
- default field values

Templates must be schema-driven so a writing-oriented preset can exist without becoming engine logic.

## Primary View Model

The primary editing surface is a semantic scene canvas, not a tree.

Default mental model for the writing-oriented preset:

- a large plane represents the world or scene
- large circular or zoned containers represent organizations, regions, or other structural areas
- smaller rectangular cards represent people or other instance nodes
- lines represent typed relations

Important constraint:

- this is a view preset, not a hardcoded engine assumption

The engine must allow schema-driven style mapping so other host products can use different visual forms.

## Structure Navigator

Tree or outline views are secondary support views only.

They are used for:

- navigation
- focus
- search
- collapse / expand
- bulk editing assistance

They are not the source model and not the primary user mental model.

## Interaction Model

### Dragging

Dragging must always have value.

It has three possible meanings:

1. Scene meaning
   Persist node placement and user-created spatial organization.
2. Candidate structural meaning
   Entering a container may suggest a membership or containment action.
3. Shortcut modeling meaning
   Dragging can trigger quick actions for common graph edits.

### Drag Into Container

Dragging a node into a container must not silently mutate structure edges.

Instead:

- the scene placement is saved
- the system offers an explicit candidate action
- the user confirms the intended semantic change

Example quick actions:

- join organization
- set primary membership
- keep layout only

This preserves support for multiple memberships and cross-container relations.

### Inspector Authority

The inspector is authoritative for exact semantics.

It must show and edit:

- memberships
- roles
- relation properties
- validation messages
- quick action confirmations

## Command Model

All meaningful edits should become explicit commands.

Examples:

- `MoveNodeInScene`
- `ResizeContainerZone`
- `AddStructureEdge`
- `SetPrimaryMembership`
- `CreateRelationEdge`
- `UpdateNodeFields`

Command pipeline requirements:

- validate
- normalize
- apply
- append to history
- emit subscriptions

This is required for:

- undo / redo
- persistence
- sync preparation
- testability

## Storage and Sync Boundary

The module is local-first with remote-ready extension points.

### Local Adapter Responsibilities

- load graph bundle
- persist snapshot and/or op log
- recover unsynced edits
- restore scene state quickly

### Remote Adapter Responsibilities

- push commands or patches
- fetch remote revisions
- report sync status
- surface revision mismatch information

Important constraint:

- remote sync failures must not block continued local editing

## Performance Target

Design V1 for the medium-large target range:

- roughly 300 to 3000 nodes
- relation-heavy scenes
- thousands of edges possible

The editor must remain usable for browsing and focused editing in this range.

## V1 Editor Surfaces

The first usable editor package should include:

- Scene Canvas
- Inspector Panel
- Structure Navigator
- Template Picker
- Relation Tools
- Status Bar

### Scene Canvas

Required behaviors:

- pan / zoom
- create nodes
- move nodes
- place nodes inside and across containers
- render typed edges
- select and focus nodes

### Inspector Panel

Required behaviors:

- edit fields
- edit memberships
- edit relations
- confirm candidate actions
- show validation errors

### Structure Navigator

Required behaviors:

- search
- focus
- jump to node
- collapse / expand structure projections

## Testing Strategy

### Core Unit Tests

Must cover:

- command behavior
- schema validation
- structure-edge rules
- template expansion
- undo / redo
- snapshot recovery

### Adapter Contract Tests

Must cover:

- local save / load
- sync event contract
- pending change recovery
- revision mismatch handling

### React Integration Tests

Must cover:

- provider lifecycle
- selector updates
- component command dispatch
- host subscription behavior

### Editor Interaction Tests

Must cover:

- drag node
- drag into container
- confirm candidate action
- cancel candidate action
- create typed relation
- edit via inspector

### Performance Checks

Must cover:

- representative graphs in the target size range
- navigation and focused edit responsiveness

## Error Handling

Rules:

- canceling a candidate action keeps scene placement only
- invalid commands fail with explicit validation reasons
- sync failures produce pending/conflict state instead of blocking local work

## Success Criteria

V1 is successful when a React host application can:

- load a schema and template
- visually create and edit a graph
- persist and restore graph plus scene state locally
- expose sync-ready boundaries for later remote integration
- reuse the same core model in later writing / roleplay / agent systems without redesign

## Implementation Implications

The next planning phase should assume:

- package-based decomposition from day one
- command-driven state changes
- graph and scene state stored separately
- support view, not tree-first UX
- writing presets implemented as schema + template examples

## Workspace Note

This workspace is not currently initialized as a git repository, so the spec can be written locally but cannot be committed until the project is placed under git.
