import Link from "next/link";
import { Workflow, Library, FolderKanban } from "lucide-react";
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
          <Link href="/campaigns" className="block">
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer">
              <FolderKanban className="w-12 h-12 text-purple-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
              <p className="text-gray-600">3-layer strategic execution system with campaigns, playbooks, and tasks</p>
            </div>
          </Link>

          <Link href="/workflows" className="block">
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
              <Workflow className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Workflows</h2>
              <p className="text-gray-600">Create and manage your visual workflows</p>
            </div>
          </Link>

          <Link href="/templates" className="block">
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all cursor-pointer">
              <Library className="w-12 h-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Templates</h2>
              <p className="text-gray-600">Manage your template library</p>
            </div>
          </Link>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/campaigns">
            <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
              Campaigns →
            </Button>
          </Link>
          <Link href="/workflows">
            <Button size="lg" className="text-lg px-8 py-6" variant="outline">
              Workflows →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
