import { ReactElement } from "react";

const PostTemplate = ({ children }: { children: ReactElement }) => {
  return (
    <div className="max-w-[950px] mx-4 lg:mx-auto bg-white p-8 mt-5">
      {children}
    </div>
  );
};

export default PostTemplate;
