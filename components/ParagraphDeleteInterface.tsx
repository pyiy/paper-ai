import { faL } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Swal from "sweetalert2";

// 定义Props类型
interface SweetAlertComponentProps {
  index: number;
  removeReferenceUpdateIndex: (index: number, rmPg: boolean) => void;
}

const ParagraphDeleteButton: React.FC<any> = ({
  index,
  removeReferenceUpdateIndex,
  isRemovePaper = false,
  title = "需要同时删除与文献相关的整个段落吗？",
  text = "根据周围的换行符来判断是否是同一个段落",
}) => {
  //这里传递函数的时候应该把参数先提前弄好 2.7
  const showAlert = async () => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });
    if (result.isConfirmed) {
      if (isRemovePaper) {
        removeReferenceUpdateIndex(index, true);
      } else {
        removeReferenceUpdateIndex();
      }
      // Swal.fire("Deleted!", "Your file has been deleted.", "success");
    } else {
      if (isRemovePaper) removeReferenceUpdateIndex(index, false);
      // Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
    }
  };

  return (
    <button
      className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10 ml-2 group"
      onClick={(e) => {
        e.stopPropagation();
        showAlert();
      }}
      title="Delete Paper"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 transition-transform group-hover:scale-110"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    </button>
  );
};

export default ParagraphDeleteButton;
