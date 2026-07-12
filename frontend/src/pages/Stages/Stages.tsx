import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStages } from "../../api/stages";
import StageCard from "../../components/stage/StageCard";
import type { StageCard as StageCardType } from "../../types/stages";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Stages() {
    const [stages, setStages] = useState<StageCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStages().then((data) => { setStages(data); setLoading(false); });
    }, []);

    return (
        <div className="section">
            <div className="players-header">
                <div className="players-header__top">
                    <h1 className="players-header__title">Stages</h1>
                    {!loading && <span className="players-header__count">{stages.length} stages</span>}
                </div>
                <p className="players-header__subtitle">Tournament stages from group phase to knockout rounds.</p>
            </div>

            {loading ? (
                <div className="grid grid--auto-fill">{Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="entity-card" aria-hidden><div className="skeleton skeleton--text" style={{ width: "70%", height: 20 }} /><div className="skeleton skeleton--text" style={{ width: "40%", height: 14, marginTop: 8 }} /></div>
                ))}</div>
            ) : (
                <motion.div className="grid grid--auto-fill" variants={container} initial="hidden" animate="show">
                    {stages.map((stage) => <motion.div key={stage.id} variants={item}><StageCard stage={stage} /></motion.div>)}
                </motion.div>
            )}
        </div>
    );
}
