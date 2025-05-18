import {Scene} from "../components/Scene.tsx";
import {useInteractStore, useSceneStore} from "../stores";

export const Project = () => {
    const {viewMode, setViewMode} = useSceneStore();
    const {objectIdAdding, selectObjectIdToAdding} = useInteractStore();

    const objects = Array(10).fill(0).map((_, i) => ({id: (i + 1).toString(), name: `Table ${i + 1}`}))

    return (
        <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
            <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="mb-2 text-sm font-semibold text-gray-600">Categories</div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-200 text-sm px-2 py-1 rounded">All</span>
                    <span className="bg-gray-200 text-sm px-2 py-1 rounded">Round Tables</span>
                    <span className="bg-gray-200 text-sm px-2 py-1 rounded">Long Tables</span>
                </div>
                <button className="flex-1 overflow-y-auto">
                    {objects.map((objectItem, i) => (
                        <div
                            key={i}
                            className={`p-3 mb-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer [&.active]:font-bold [&.active]:border-blue-300 [&.active]:shadow ${objectIdAdding === objectItem.id ? 'active' : ''}`}
                            onMouseDown={() => selectObjectIdToAdding(objectItem.id)}>
                            {objectItem.name}
                        </div>
                    ))}
                </button>
                <div className={"flex gap-2 border p-1 border-gray-300"}>
                    <button
                        onClick={() => setViewMode("2D")}
                        className={`flex-1 border border-gray-300 rounded py-1 cursor-pointer font-bold
              ${viewMode === "2D" ? "bg-sky-200 shadow" : "hover:bg-gray-200"}`}
                    >
                        2D
                    </button>
                    <button
                        onClick={() => setViewMode("3D")}
                        className={`flex-1 border border-gray-300 rounded py-1 cursor-pointer font-bold
              ${viewMode === "3D" ? "bg-sky-200 shadow" : "hover:bg-gray-200"}`}
                    >
                        3D
                    </button>
                </div>
            </aside>
            <Scene className="flex-1 relative bg-gray-200"/>


            {/* <div className="absolute top-4 right-4 w-72 bg-white rounded-xl shadow-lg p-4 z-50">
                <h2 className="text-lg font-semibold mb-2">Item Settings</h2>
                <div className="space-y-3 text-sm text-gray-700">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input className="w-full border px-2 py-1 rounded" value="Round Table 1" readOnly />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Position</label>
                        <input className="w-full border px-2 py-1 rounded" value="[1.2, 0, -3]" readOnly />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Note</label>
                        <textarea className="w-full border px-2 py-1 rounded" rows={2}></textarea>
                    </div>
                    <button className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600">
                        Save
                    </button>
                </div>
            </div>*/}
        </div>
    );
}
