/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/display-name */
import React from "react";
import { Editor, EditorProps } from "@toast-ui/react-editor";

export interface TuiEditorWithForwardedProps extends EditorProps {
  forwardedRef?: React.MutableRefObject<Editor>;
}
export default (props: TuiEditorWithForwardedProps) => (
  <Editor {...props} ref={props.forwardedRef} />
);
