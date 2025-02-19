interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div>
      {/* <CanvasTitlePanel /> */}
      <div className="md:mx-8 max-w-[1200px] lg:mx-auto">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
