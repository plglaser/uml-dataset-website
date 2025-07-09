import type { Model } from "@/interfaces/model";
import { Link } from "react-router-dom";

export function ModelCard({ model }: Readonly<{ model: Model }>) {
  return (
    <Link to={`/model/${encodeURIComponent(model.name)}`}>
        <div className="p-4 bg-white rounded-lg shadow border flex flex-col gap-2">
            <div className="font-semibold text-lg">{model.name}</div>
            <div className="flex gap-4 text-sm text-gray-700">
                <span>
                    <span className="font-medium">{model.elements}</span> elements
                </span>
                <span>
                    <span className="font-medium">{model.relationships}</span> relationships
                </span>
            </div>
            {model.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{model.description}</p>
            )}
        </div>
    </Link>
  );
}