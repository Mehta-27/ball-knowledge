import { useEffect, useState } from "react";

import { getStages } from "../../api/stages";
import StageCard from "../../components/stage/StageCard";

import type { StageCard as StageCardType } from "../../types/stages";

export default function Stages() {
    const [stages, setStages] = useState<StageCardType[]>([]);

    useEffect(() => {
        async function fetchStages() {
            const data = await getStages();
            setStages(data);
        }

        fetchStages();
    }, []);

    return (
        <div className="section">
            <div className="section-header">
                <h1 className="type-h1">Stages</h1>
            </div>

            <div className="grid grid--auto-fill">
                {stages.map((stage) => (
                    <StageCard
                        key={stage.id}
                        stage={stage}
                    />
                ))}
            </div>
        </div>
    );
}
