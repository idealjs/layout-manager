import type { IPanelJSON } from "../PanelNode";
import type PanelNode from "../PanelNode";
import type LayoutNode from ".";
import type { LAYOUT_DIRECTION, LayoutNodeActionType, MASK_PART } from "./enum";

export interface ILayoutJSON {
  id: string;
  direction: LAYOUT_DIRECTION;
  primaryOffset: number;
  secondaryOffset: number;
  layouts: ILayoutJSON[];
  panels: IPanelJSON[];
}

export interface ILayout {
  id: string;
  height: number;
  width: number;
  left: number;
  top: number;
  primaryOffset: number;
  secondaryOffset: number;
  parentId: string | undefined;
  children: string[];
  direction: LAYOUT_DIRECTION | null;
}

export type AddPanelData = {
  panelNode: PanelNode;
  mask: MASK_PART;
  target: string | LayoutNode;
};

export type MovePanelData = {
  search: string;
  target: string | LayoutNode;
  mask: MASK_PART;
};

export type MoveSplitterData = {
  primary: string;
  secondary: string;
  offset: number;
};

export type RemovePanelData = {
  search: string;
};

export type SelectTabData = {
  search: string;
};

export interface ISplitter {
  id: string;
  height: number;
  width: number;
  left: number;
  top: number;

  primaryId: string;
  secondaryId: string;
  parentId: string;
}

export interface IRule {
  part: MASK_PART;
  max: number;
  limitLevel?: number;
}

export type ActionPayload =
  | AddPanelData
  | MovePanelData
  | MoveSplitterData
  | RemovePanelData
  | SelectTabData;

export type AddPanelAction = {
  type: LayoutNodeActionType.ADD_PANEL;
  payload: AddPanelData;
};

export type MovePanelAction = {
  type: LayoutNodeActionType.MOVE_PANEL;
  payload: MovePanelData;
};

export type MoveSplitterAction = {
  type: LayoutNodeActionType.MOVE_SPLITTER;
  payload: MoveSplitterData;
};

export type RemovePanelAction = {
  type: LayoutNodeActionType.REMOVE_PANEL;
  payload: RemovePanelData;
};

export type SelectTabAction = {
  type: LayoutNodeActionType.SELECT_TAB;
  payload: SelectTabData;
};

export type RecursivePartialWithRequired<T, K extends keyof T> = Pick<T, K> & {
  [P in keyof Omit<T, K>]?: T[P] extends (infer U)[]
    ? U extends T
      ? RecursivePartialWithRequired<U, K>[]
      : U[]
    : T[P] extends T
    ? RecursivePartialWithRequired<T[P], K>
    : T[P];
};

export type RecursivePartialPanelJSON<T> = {
  [P in keyof T]: T[P] extends IPanelJSON[]
    ? Partial<IPanelJSON>[]
    : RecursivePartialPanelJSON<T[P]>;
};
