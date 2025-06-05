"use client";
import { useSearchParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function SimulationResults() {
  const searchParams = useSearchParams();
  const simName = searchParams.get('name');
  const population = searchParams.get('population');

  const analysisTypes = [
    {
      title: "Age Impact Analysis",
      description: "Correlation between age and willingness to change energy providers"
    },
    {
      title: "Regional Climate Analysis",
      description: "Impact of climate zones on provider switching behavior"
    },
    {
      title: "Housing Status Analysis",
      description: "Effects of home ownership vs. renting on decisions"
    },
    {
      title: "Peak Usage Analysis",
      description: "Consumer behavior during peak vs. off-peak hours"
    },
    {
      title: "Occupation Impact",
      description: "Correlation between occupation and switching behavior"
    },
    {
      title: "Stability Preference Analysis",
      description: "Impact of stability preferences on provider changes"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Simulation Results</h1>
            <div className="text-gray-300">
              <p className="text-lg">Simulation Name: {simName}</p>
              <p className="text-lg">Number of Agents: {population}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisTypes.map((analysis, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-3 text-white">{analysis.title}</h2>
                <p className="text-gray-300 mb-4">{analysis.description}</p>
                <div className="h-48 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400">
                  Simulation in progress...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
