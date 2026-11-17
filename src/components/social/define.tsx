import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { DataRecord, Field, TemplateDefinition, TemplateProps } from "./types";

/**
 * Registers a template. Each template brings its own typed data shape, the
 * form fields that edit it, sample data and the card component.
 */
export function defineTemplate<T extends DataRecord>(def: {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  fields: Field[];
  defaults: T;
  Component: ComponentType<TemplateProps<T>>;
}): TemplateDefinition {
  const { Component, ...rest } = def;
  return {
    ...rest,
    render: (props) => <Component {...props} data={props.data as T} />,
  };
}
