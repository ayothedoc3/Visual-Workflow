import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Workflows</h1>
            <p className="text-gray-600">Create and manage your visual workflows</p>
          </div>
          <Link href="/workflows/new">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Workflow
            </Button>
          </Link>
        </div>

        {/* Workflow list will go here */}
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No workflows yet</p>
          <Link href="/workflows/new">
            <Button>Create your first workflow</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
