import dynamic from "next/dynamic";
import * as React from "react";
import { Editor as EditorType, EditorProps } from "@toast-ui/react-editor";
import { TuiEditorWithForwardedProps } from "@components/TuiEditorWrapper";
import useMutation from "@libs/client/useMutation";
// import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

interface EditorPropsWithHandlers extends EditorProps {
  onChange?(value: string): void;
}

const Editor = dynamic<TuiEditorWithForwardedProps>(
  () => import("./TuiEditorWrapper"),
  { ssr: false }
);

// eslint-disable-next-line react/display-name
const EditorWithForwardedRef = React.forwardRef<
  EditorType | undefined,
  EditorPropsWithHandlers
>((props, ref) => (
  <Editor {...props} forwardedRef={ref as React.MutableRefObject<EditorType>} />
));

interface Props extends EditorProps {
  onChange(value: string): void;
  valueType?: "markdown" | "html";
}

const WysiwygEditor: React.FC<Props> = (props) => {
  const {
    initialValue,
    previewStyle,
    height,
    initialEditType,
    useCommandShortcut,
    plugins,
  } = props;

  const editorRef = React.useRef<EditorType>();
  const handleChange = React.useCallback(() => {
    if (!editorRef.current) {
      return;
    }

    const instance = editorRef.current.getInstance();
    const valueType = props.valueType || "markdown";

    props.onChange(
      valueType === "markdown" ? instance.getMarkdown() : instance.getHTML()
    );
  }, [props, editorRef]);

  return (
    <div>
      <EditorWithForwardedRef
        {...props}
        initialValue={initialValue || "hello react editor world!"}
        previewStyle={previewStyle || "vertical"}
        height={height || "600px"}
        initialEditType={initialEditType || "markdown"}
        useCommandShortcut={useCommandShortcut || true}
        // plugins={[colorSyntax]}
        ref={editorRef}
        // UTF-8로 인코딩 되는 이미지 업로드 방식을
        // cloudflare에 바로 이미지를 저장해주고 반환되는 url을 md에 삽입하는 방식으로 변경
        hooks={{
          addImageBlobHook: async (blob, callback) => {
            const { uploadURL } = await (await fetch(`/api/files`)).json();
            const form = new FormData();
            form.append("file", blob);
            const {
              result: { id },
            } = await (
              await fetch(uploadURL, {
                method: "POST",
                body: form,
              })
            ).json();
            callback(
              `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${id}/public`
            );
          },
        }}
        onChange={handleChange}
      />
    </div>
  );
};

export default WysiwygEditor;
