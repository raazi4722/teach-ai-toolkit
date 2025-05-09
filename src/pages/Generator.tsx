
import AppLayout from "@/components/layout/AppLayout";
import GeneratorForm from "@/components/generator/GeneratorForm";

const Generator = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Content Generator</h1>
        <GeneratorForm />
      </div>
    </AppLayout>
  );
};

export default Generator;
