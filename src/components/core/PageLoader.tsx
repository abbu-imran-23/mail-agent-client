import { Spinner } from "../ui/spinner";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background">
      <Spinner className="size-10 text-secondary" />
      <p className="text-md text-muted-foreground">Loading Agent Lab...</p>
    </div>
  );
};

export default PageLoader;
