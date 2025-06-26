import Sidebar from '../../components/Sidebar';

export default function PreRunSimulationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
