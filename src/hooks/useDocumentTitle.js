import { useEffect } from "react";

const useDocumentTitle = title => {
  useEffect(
    () => {
      document.title = "Bulk Inv.  |  " + title;
    },
    [title]
  );
};

export default useDocumentTitle;
