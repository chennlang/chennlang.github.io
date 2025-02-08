import { redirect } from "next/navigation";

const Home = () => {
  // 重定向到 /page/1
  redirect("/page/1");
};

export default Home;
