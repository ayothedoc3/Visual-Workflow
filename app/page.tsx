import Link from "next/link";
import { Workflow, Library, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-8 px-8">
        <div className="text-center">
          <h1 className="text-5xl font-semibold mb-4">
            Visual Workflow Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Rapidly assemble business process workflows by selecting pre-built templates.
            Create SOPs, playbooks, and process documentation that can be easily shared as visual diagrams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/workflows">
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
              <Workflow className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Workflows</h2>
              <p className="text-gray-600">Create and manage your visual workflows</p>
            </div>
          </Link>

          <Link href="/templates">
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all cursor-pointer">
              <Library className="w-12 h-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Templates</h2>
              <p className="text-gray-600">Manage your template library</p>
            </div>
          </Link>

          <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all">
            <FileText className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Documentation</h2>
            <p className="text-gray-600">Learn how to use the workflow builder</p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/workflows">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
