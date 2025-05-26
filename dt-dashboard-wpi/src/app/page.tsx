import Home from "@/components/Home";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Index() {
  return (
    <>
      <DefaultLayout title="Jumeau numérique">
        <Home />
      </DefaultLayout>
    </>
  );
}
