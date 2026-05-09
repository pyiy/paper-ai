"use client";
import dynamic from "next/dynamic";
import ReduxProvider from "@/app/store/ReduxProvider";
import LoadingIndicator from "@/components/LoadingIndicator"; // 确保路径正确
// import QEditor from "@/components/QuillEditor";

// 动态导入 QuillEditor 组件，禁用 SSR，这里不可以用use client, 因为即使使用这个编译指令，仍然会在服务器上先上一遍，弄一个基础框架出来，这个时候就会报错  2026.5.9
const QEditor = dynamic(() => import("@/components/QuillEditor"), {
  ssr: false,
  loading: () => <LoadingIndicator />,
});
export default function QuillWrapper({ lng }: { lng: string }) {
  return (
    <ReduxProvider>
      <QEditor lng={lng} />
    </ReduxProvider>
  );
}
