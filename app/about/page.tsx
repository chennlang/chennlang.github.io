import Comments from "@/components/comments";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* 个人信息头部 */}
        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="w-48 h-48 relative mb-4 md:mb-0 md:mr-8">
            <img
              src="https://avatars.githubusercontent.com/u/41711206?v=4"
              alt="个人头像"
              className="rounded-full object-cover block w-full"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white">
              前端开发工程师
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              做自己的追风者
            </p>
          </div>
        </div>

        {/* 技术栈 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            技术栈
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "React",
              "Vue",
              "TypeScript",
              "Next.js",
              "Nuxt.js",
              "Node",
              "Tailwind CSS",
              "JavaScript",
              "HTML/CSS",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center dark:text-gray-200"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* 个人简介 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            关于我
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            作为一名前端开发工程师，我专注于构建高性能、可访问性强的 Web 应用。
            我热衷于学习新技术，并将其应用到实际项目中。在工作中，我注重代码质量和用户体验，
            善于与团队协作，共同打造优秀的产品。
          </p>
        </section>

        {/* 工作经历 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            工作经历
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold dark:text-white">
                高级前端开发工程师
              </h3>
              <p className="text-gray-600 dark:text-gray-400">2018 - 至今</p>
              <p className="text-gray-700 dark:text-gray-300">
                负责公司核心产品的前端开发，优化用户体验，提升应用性能
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-5">
        <Comments />
      </div>
    </div>
  );
}
