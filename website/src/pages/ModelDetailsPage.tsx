import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Model } from "@/interfaces/model";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ModelDetails() {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const [model, setModel] = useState<Model | null>(null);
    const [loading, setLoading] = useState(true);
    const [descOpen, setDescOpen] = useState(false);

    useEffect(() => {
        let baseUrl = import.meta.env.BASE_URL;
        if (!baseUrl.endsWith("uml-dataset-website/")) {
            baseUrl += "uml-dataset-website/";
        }
        fetch(`${baseUrl}models/models.json`)
            .then((res) => res.json())
            .then((data: Model[]) => {
                const found = data.find(
                (m) => m.name.toLowerCase() === decodeURIComponent(name ?? "").toLowerCase()
                );
                setModel(found || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [name]);


    if (loading) return <main className="p-8">Loading...</main>;
    if (!model) return (
        <main className="p-8 text-center">
        <p className="mb-6">Model not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
            Back
        </Button>
        </main>
    );

    
    return (
        <main className="w-full flex flex-col items-center py-10 px-2 text-left">
            <div className="w-full">
                <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>
                &larr; Back
                </Button>
                <div className="rounded-xl shadow p-8 flex flex-col gap-6">
                    <h2 className="text-3xl font-bold">{model.name}</h2>
                    <div className="flex flex-wrap gap-8 text-md text-gray-700">
                        <span>
                        <span className="font-semibold">{model.elementCount}</span> elements
                        </span>
                        <span>
                        <span className="font-semibold">{model.relationshipCount}</span> relationships
                        </span>
                    </div>

                    {model.description && (
                        <Collapsible open={descOpen} onOpenChange={setDescOpen}>
                        <CollapsibleTrigger asChild>
                            <Button
                            variant="ghost"
                            className="mb-2 text-left px-0"
                            aria-expanded={descOpen}
                            >
                            <span className="font-semibold">
                                {descOpen ? "Hide Description" : "Show Description"}
                            </span>
                            {descOpen ? (
                                <ChevronUp className="ml-2" size={18} />
                            ) : (
                                <ChevronDown className="ml-2" size={18} />
                            )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="text-gray-800 whitespace-pre-line px-2 pb-2">
                            {model.description}
                            </div>
                        </CollapsibleContent>
                        </Collapsible>
                    )}

                    {/* Add additional metadata here as needed */}

                    <div>
                        <div className="font-semibold mb-2">UML Diagram</div>
                        <div className="bg-gray-100 rounded p-8 text-gray-400 flex items-center justify-center min-h-[200px]">
                        [PlantUML diagram will be rendered here]
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
