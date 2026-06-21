import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  overrides: Partial<ToolInvocation> & { args?: Record<string, unknown> }
): ToolInvocation {
  return {
    toolCallId: "call_1",
    toolName: "str_replace_editor",
    state: "call",
    args: {},
    ...overrides,
  } as ToolInvocation;
}

test("shows 'Creating' label for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ args: { command: "create", path: "/App.jsx" } })}
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        args: { command: "str_replace", path: "/components/Button.tsx" },
      })}
    />
  );
  expect(screen.getByText("Editing /components/Button.tsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        args: { command: "insert", path: "/some/file.tsx" },
      })}
    />
  );
  expect(screen.getByText("Editing /some/file.tsx")).toBeDefined();
});

test("shows 'Viewing' label for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        args: { command: "view", path: "/some/file.tsx" },
      })}
    />
  );
  expect(screen.getByText("Viewing /some/file.tsx")).toBeDefined();
});

test("shows 'Undoing edit to' label for str_replace_editor undo_edit command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        args: { command: "undo_edit", path: "/some/file.tsx" },
      })}
    />
  );
  expect(screen.getByText("Undoing edit to /some/file.tsx")).toBeDefined();
});

test("shows raw tool name for unknown tools", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ toolName: "file_manager", args: {} })}
    />
  );
  expect(screen.getByText("file_manager")).toBeDefined();
});

test("shows spinner when tool call is in progress", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        state: "call",
        args: { command: "create", path: "/App.jsx" },
      })}
    />
  );
  expect(screen.getByTestId("spinner")).toBeDefined();
  expect(screen.queryByTestId("status-dot")).toBeNull();
});

test("shows green dot when tool call is complete", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        state: "result",
        result: "OK",
        args: { command: "create", path: "/App.jsx" },
      } as Partial<ToolInvocation>)}
    />
  );
  expect(screen.getByTestId("status-dot")).toBeDefined();
  expect(screen.queryByTestId("spinner")).toBeNull();
});
