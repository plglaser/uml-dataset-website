import { ModelCard } from "@/components/ModelCard";
import { MultiSelectCombobox } from "@/components/MultiSelectCombobox";
import type { Model } from "@/interfaces/model";
import { useEffect, useState } from "react";


export default function SearchPage() {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [query, setQuery] = useState("");
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);


    useEffect(() => {
        let baseUrl = import.meta.env.BASE_URL;
        if (!baseUrl.endsWith("uml-dataset-website/")) {
            baseUrl += "uml-dataset-website/";
        }
        fetch(`${baseUrl}models.json`)
            .then((res) => res.json())
            .then((data) => {
                setModels(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const allProperties = [
        "hasExtraMaterial",
        "hasComposition",
        "hasAggregation",
    ];
    const allLanguages = Array.from(new Set(models.map(m => m.language).filter(Boolean)));
    const allDomains = Array.from(new Set(models.flatMap(m => m.domain || [])));
    const allTags = Array.from(new Set(models.flatMap(m => m.tags || [])));

    const filteredModels = models.filter((model) => {
        const q = query.toLowerCase();
        if (!(
            model.name?.toLowerCase().includes(q) ||
            model.description?.toLowerCase().includes(q)
        )) { return false; }
        
        // properties
        if (selectedProperties.length > 0 && !selectedProperties.some((prop) => (model as any)[prop])) return false;
        // language
        if (selectedLanguages.length > 0 && !selectedLanguages.includes(model.language)) return false;
        // domain
        if (selectedDomains.length > 0 && !(model.domain || []).some(d => selectedDomains.includes(d))) return false;
        // tags
        if (selectedTags.length > 0 && !(model.tags || []).some(t => selectedTags.includes(t))) return false;

        return true
    });


    return (
        <main className="mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-6">Available UML Models</h2>
            <div className="mb-4 flex flex-wrap gap-4 items-end">
                {/* Property Filter */}
                <MultiSelectCombobox
                    label="Property"
                    options={allProperties}
                    selected={selectedProperties}
                    setSelected={setSelectedProperties}
                    placeholder="All"
                />

                {/* Language Filter */}
                <MultiSelectCombobox
                    label="Language"
                    options={allLanguages}
                    selected={selectedLanguages}
                    setSelected={setSelectedLanguages}
                    placeholder="All"
                />

                {/* Domain Filter */}
                <MultiSelectCombobox
                    label="Domain"
                    options={allDomains}
                    selected={selectedDomains}
                    setSelected={setSelectedDomains}
                    placeholder="All"
                />

                {/* Tag Filter */}
                <MultiSelectCombobox
                    label="Tag"
                    options={allTags}
                    selected={selectedTags}
                    setSelected={setSelectedTags}
                    placeholder="All"
                />
            </div>

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