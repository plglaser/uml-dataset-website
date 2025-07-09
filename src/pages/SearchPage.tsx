import { ModelCard } from "@/components/ModelCard";
import type { Model } from "@/interfaces/model";
import { useEffect, useState } from "react";


export default function SearchPage() {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}models/models.json`)
            .then((res) => res.json())
            .then((data) => {
                setModels(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredModels = models.filter((model) => {
        const q = query.toLowerCase();
        return (
            model.name?.toLowerCase().includes(q) ||
            model.description?.toLowerCase().includes(q)
        );
    });


    return (
        <main className="mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-6">Available UML Models</h2>
            <input
                type="text"
                className="w-full mb-6 px-3 py-2 border rounded shadow-sm"
                placeholder="Search by name or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-4">
                    {filteredModels.map((model) => (
                        <li key={model.name}>
                            <ModelCard model={model} />
                        </li>
                    ))}
                    {!filteredModels.length && <p className="text-gray-500">No models found.</p>}
                </ul>
            )}
        </main>
    );
}