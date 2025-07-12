export interface Model {
    name: string;
    description: string;
    elementCount: number;
    relationshipCount: number;
    hasComposition?: boolean;
    hasAggregation?: boolean;
    hasExtraMaterial?: boolean;
    language: string
    domain: string[];
    tags: string[];
    source: string;
}
