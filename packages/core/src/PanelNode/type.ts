export interface IPanelJSON {
  id: string;
  page: string;
  data?: unknown;
}

export interface IPanel {
  id: string;
  height: number;
  width: number;
  left: number;
  top: number;
  parentId: string;
  page: string;
  selected: boolean;
  data?: unknown;
}
