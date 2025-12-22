'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FolderKanban, Calendar, Settings, Award, TrendingUp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StrategicCanvas } from '@/components/strategic-canvas/StrategicCanvas';
import { HelpModal } from '@/components/help/HelpModal';
import { PACKAGE_TIERS, LEVELS } from '@/lib/emosSystem';
import { CAMPAIGN_HELP } from '@/lib/helpContent';
import type { PackageTier, Level } from '@/lib/schema';

interface Campaign {
  id: string;
  name: string;
  description: string;
  strategic_nodes: any[];
  strategic_edges: any[];
  overall_status: string;
  start_date: string | null;
  target_date: string | null;
  playbook_count: number;
  package_tier?: PackageTier | null;
  level?: Level | null;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEMOSSettings, setShowEMOSSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCanvas = async (nodes: any[], edges: any[]) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategicNodes: nodes,
          strategicEdges: edges
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setCampaign(updated);
        alert('Campaign saved successfully!');
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save campaign');
    }
  };

  const handleUpdateEMOS = async (packageTier: PackageTier | null, level: Level | null) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageTier,
          level
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setCampaign(updated);
        setShowEMOSSettings(false);
      }
    } catch (error) {
      console.error('Error updating EMOS settings:', error);
      alert('Failed to update EMOS settings');
    }
  };

  const handleNodeDoubleClick = async (nodeId: string, nodeData: any) => {
    // Check if this node already has a linked playbook
    if (nodeData.linkedPlaybookId) {
      router.push(`/playbooks/${nodeData.linkedPlaybookId}`);
      return;
    }

    // Ask user if they want to create a playbook
    const createPlaybook = confirm(`Create a playbook for "${nodeData.label}"?`);
    if (!createPlaybook) return;

    try {
      const response = await fetch('/api/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${nodeData.label} - Playbook`,
          description: nodeData.description,
          parentCampaignId: campaignId,
          parentNodeId: nodeId,
          workflowNodes: [],
          workflowEdges: []
        })
      });

      if (response.ok) {
        const newPlaybook = await response.json();

        // Update the node with the linked playbook ID
        const updatedNodes = campaign!.strategic_nodes.map(node =>
          node.id === nodeId
            ? { ...node, linkedPlaybookId: newPlaybook.id }
            : node
        );

        await handleSaveCanvas(updatedNodes, campaign!.strategic_edges);

        // Navigate to the new playbook
        router.push(`/playbooks/${newPlaybook.id}`);
      }
    } catch (error) {
      console.error('Error creating playbook:', error);
      alert('Failed to create playbook');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="text-center py-12">
          <p className="text-red-600">Campaign not found</p>
          <Button onClick={() => router.push('/campaigns')} className="mt-4">
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/campaigns')}
            className="mb-4 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-semibold mb-2">{campaign.name}</h1>
                {campaign.description && (
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                )}

                {/* EMOS Metadata Display */}
                <div className="flex items-center gap-3 mb-4">
                  {campaign.package_tier && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">{campaign.package_tier}</span>
                    </div>
                  )}
                  {campaign.level && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">{campaign.level}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FolderKanban className="w-4 h-4 mr-2" />
                    <span>{campaign.playbook_count} playbook{campaign.playbook_count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not started'}
                      {' → '}
                      {campaign.target_date ? new Date(campaign.target_date).toLocaleDateString() : 'No target'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                  {campaign.overall_status}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)} title="Help Guide">
                  <HelpCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowEMOSSettings(true)} title="EMOS Settings">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Canvas */}
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Layer 1: Strategic View</strong> - Create 3-5 high-level nodes representing your campaign strategy. Double-click a Strategy node to drill down into a detailed Playbook.
            </p>
          </div>
        </div>

        <StrategicCanvas
          campaignId={campaignId}
          initialNodes={campaign.strategic_nodes || []}
          initialEdges={campaign.strategic_edges || []}
          onSave={handleSaveCanvas}
          onNodeDoubleClick={handleNodeDoubleClick}
        />

        {/* EMOS Settings Modal */}
        {showEMOSSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">EMOS Settings</h2>
              <p className="text-sm text-gray-600 mb-6">
                Configure Enterprise Management Operating System metadata for this campaign
              </p>

              <div className="space-y-4">
                {/* Package Tier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    Package Tier
                  </label>
                  <select
                    value={campaign.package_tier || ''}
                    onChange={(e) => setCampaign({ ...campaign, package_tier: e.target.value as PackageTier || null })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Not Set</option>
                    {PACKAGE_TIERS.map((tier) => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Service package level (Bronze to Black)
                  </p>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Level
                  </label>
                  <select
                    value={campaign.level || ''}
                    onChange={(e) => setCampaign({ ...campaign, level: e.target.value as Level || null })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Not Set</option>
                    {LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Growth stage: ACQUIRE new clients, MAINTAIN existing, or SCALE operations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => handleUpdateEMOS(campaign.package_tier || null, campaign.level || null)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save EMOS Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEMOSSettings(false);
                    fetchCampaign(); // Reset to saved values
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Modal */}
        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          title={CAMPAIGN_HELP.title}
          description={CAMPAIGN_HELP.description}
          sections={CAMPAIGN_HELP.sections}
          examples={CAMPAIGN_HELP.examples}
        />
      </div>
    </div>
  );
}
