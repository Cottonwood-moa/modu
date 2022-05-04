import dynamic from "next/dynamic";
import * as React from "react";
import { Editor as EditorType, EditorProps } from "@toast-ui/react-editor";
import { TuiEditorWithForwardedProps } from "@components/TuiEditorWrapper";
import { AnimatePresence, motion } from "framer-motion";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "@atom/atom";
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
  // valueType?: "markdown" | "html";
  valueType?: "html";
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
  const [imageLoading, setImageLoading] = React.useState(false);
  const isDarkMode = useRecoilValue(darkModeAtom);
  return (
    <>
      <div>
        <EditorWithForwardedRef
          {...props}
          theme={isDarkMode ? "dark" : "light"}
          initialValue={initialValue || "hello react editor world!"}
          previewStyle={previewStyle || "vertical"}
          height={height || "600px"}
          // initialEditType={"wysiwyg"}
          initialEditType={initialEditType || "markdown"}
          useCommandShortcut={useCommandShortcut || true}
          // plugins={[colorSyntax]}
          ref={editorRef}
          // UTF-8로 인코딩 되는 이미지 업로드 방식을
          // cloudflare에 바로 이미지를 저장해주고 반환되는 url을 md에 삽입하는 방식으로 변경
          hooks={{
            addImageBlobHook: async (blob, callback) => {
              setImageLoading(true);
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
              setImageLoading(false);
            },
          }}
          onChange={handleChange}
        />
        <AnimatePresence>
          {imageLoading ? (
            <motion.div
              initial={{ translateX: -200, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              exit={{ translateX: -200, opacity: 0 }}
              className="text-xl font-bold text-[#2ecc71]"
            >
              이미지를 추가하고 있습니다.
            </motion.div>
          ) : (
            <></>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default WysiwygEditor;
