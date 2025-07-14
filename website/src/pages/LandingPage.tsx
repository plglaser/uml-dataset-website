import { Button } from "@/components/ui/button";
import type { Model } from "@/interfaces/model";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [models, setModels] = useState<Model[]>([]);
    
    useEffect(() => {
        let baseUrl = import.meta.env.BASE_URL;
        //if (!baseUrl.endsWith("uml-dataset-website/")) {
        //    baseUrl += "uml-dataset-website/";
        //}
        fetch(`${baseUrl}models.json`)
            .then((res) => res.json())
            .then((data) => setModels(data))
        }, []);

    return (
        <main className="flex flex-col items-center min-h-[75vh]">
            <section className="flex flex-col items-center w-full max-w-xl mt-16 px-4">
                <h1 className="text-4xl font-bold mb-4 text-center">
                    Golden UML ModelSet
                </h1>
                <p className="text-base text-gray-700 mb-2 text-center">
                    The <span className="font-bold">Golden UML modelset</span> is a community-curated dataset of UML modeling exercises for education.
                </p>
                <p className="text-base text-gray-700 mb-6 text-center">
                    Currently there are <span className="font-bold">{models.length} total models</span> available.
                </p>
                <Button>
                    <Download size={18} className="mr-2" />
                    Download
                </Button>
            </section>
        </main>
    );
}