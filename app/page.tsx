import Link from "next/link";
import { Library, FolderKanban, Layers } from "lucide-react";
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
            Strategic execution system with 3-layer hierarchy: Campaigns → Playbooks → Executions.
            Build complex workflows using reusable templates from your component library.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl">
          <Link href="/campaigns" className="block">
            <div className="p-8 border-2 border-purple-300 bg-purple-50 rounded-lg hover:border-purple-500 hover:shadow-xl transition-all cursor-pointer">
              <FolderKanban className="w-16 h-16 text-purple-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-3 text-purple-900">Campaigns</h2>
              <p className="text-gray-700 mb-4">Strategic execution with 3-layer drill-down: Campaigns → Playbooks → Executions</p>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Layers className="w-4 h-4" />
                <span>Primary workflow system</span>
              </div>
            </div>
          </Link>

          <Link href="/templates" className="block">
            <div className="p-8 border-2 border-green-300 bg-green-50 rounded-lg hover:border-green-500 hover:shadow-xl transition-all cursor-pointer">
              <Library className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-3 text-green-900">Templates</h2>
              <p className="text-gray-700 mb-4">Component library of reusable templates used across all campaigns</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Layers className="w-4 h-4" />
                <span>Template management</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/campaigns">
            <Button size="lg" className="text-lg px-10 py-7 bg-purple-600 hover:bg-purple-700 shadow-lg">
              <FolderKanban className="w-5 h-5 mr-2" />
              Get Started with Campaigns →
            </Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" className="text-lg px-10 py-7 bg-green-600 hover:bg-green-700 shadow-lg">
              <Library className="w-5 h-5 mr-2" />
              Manage Templates →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
