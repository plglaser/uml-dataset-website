import type { Model } from "@/interfaces/model";
import { Link } from "react-router-dom";

export function ModelCard({ model }: Readonly<{ model: Model }>) {
  return (
    <Link to={`/model/${encodeURIComponent(model.name)}`}>
        <div className="p-4 bg-white rounded-lg shadow border flex flex-col gap-2 hover:bg-gray-50 transition">
            <div className="font-semibold text-lg">{model.name}</div>
            <div className="flex gap-4 text-sm text-gray-700 flex-wrap">
                <span>
                    <span className="font-medium">{model.elementCount}</span> elements
                </span>
                <span>
                    <span className="font-medium">{model.relationshipCount}</span> relationships
                </span>
                {model.hasComposition && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        Composition
                    </span>
                )}
                {model.hasAggregation && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                        Aggregation
                    </span>
                )}
            </div>
            <div className="flex gap-2 text-xs text-gray-500 flex-wrap">
                {model.language && (
                    <span className="bg-gray-100 rounded px-2 py-0.5">{model.language}</span>
                )}
                {model.domain && Array.isArray(model.domain) && model.domain.length > 0 && (
                    model.domain.map((d: string) => (
                        <span key={d} className="bg-yellow-50 rounded px-2 py-0.5 text-yellow-800">
                            {d}
                        </span>
                    ))
                )}
                {model.tags && Array.isArray(model.tags) && model.tags.length > 0 && (
                    model.tags.map((tag: string) => (
                        <span key={tag} className="bg-gray-200 rounded px-2 py-0.5">{tag}</span>
                    ))
                )}
            </div>
            {model.source && (
                <div className="text-xs text-gray-400 mt-1">
                    <span className="font-medium">Source: </span>{model.source}
                </div>
            )}
            {model.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{model.description}</p>
            )}
        </div>
    </Link>
  );
}