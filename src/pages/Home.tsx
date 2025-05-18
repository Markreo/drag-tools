import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-white shadow-sm p-4 flex flex-col">
                <div className="text-xl font-bold mb-8">Your Logo</div>
                <nav className="space-y-3 text-gray-700">
                    <div className="font-medium text-blue-600">Projects</div>
                    <div>-------</div>
                    <div>-------</div>
                    <div>-------</div>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <h1 className="text-2xl font-semibold mb-4">Projects</h1>
                    <div className="flex gap-6">
                        <div
                            className="border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center h-40 cursor-pointer  w-96 h-56 hover:bg-gray-100 hover:shadow-lg">
                            <div className="text-center text-gray-500">
                                <div className="text-3xl">+</div>
                                <div className="text-sm mt-1">New Project</div>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 w-96 h-56 cursor-pointer hover:shadow-lg"
                             onClick={() => navigate(`/project/example`)}>
                            <div className="h-24 bg-gray-200 rounded mb-3"></div>
                            <div className="text-sm font-medium mb-1">Mirai Events - Las Arenas Pavillion</div>
                            <div className="text-xs text-gray-500 mb-2">9 days ago</div>
                            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
