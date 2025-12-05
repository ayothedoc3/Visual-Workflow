import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Template Library</h1>
            <p className="text-gray-600">Manage your reusable workflow templates</p>
          </div>
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Template
          </Button>
        </div>

        {/* Template list will go here */}
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No templates yet</p>
          <Button>Add your first template</Button>
        </div>
      </div>
    </div>
  );
}
