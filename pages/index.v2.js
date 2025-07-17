import Link from 'next/link';

export default function Home() {
  const projects = [
    { name: '8 Queens', path: '/queens', color: 'bg-purple-500' },
    { name: 'Test Page', path: '/test', color: 'bg-green-500' },
    { name: 'Coming Soon: Sorting Viz', path: '#', color: 'bg-blue-500' },
  ];

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">🧠 Algorithm Playground</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <Link href={proj.path} key={idx}>
            <div className={`rounded-xl shadow-lg p-6 text-white cursor-pointer transform transition hover:scale-105 ${proj.color}`}>
              <h2 className="text-2xl font-semibold">{proj.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
