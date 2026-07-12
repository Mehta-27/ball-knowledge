import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStandings } from "../../api/standings";
import StandingCard from "../../components/standing/StandingCard";
import type { StandingGroup } from "../../types/standings";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Standings() {
    const [groups, setGroups] = useState<StandingGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStandings().then((data) => { setGroups(data); setLoading(false); });
    }, []);

    return (
        <div className="section">
            <div className="players-header">
                <div className="players-header__top">
                    <h1 className="players-header__title">Standings</h1>
                    {!loading && <span className="players-header__count">{groups.length} groups</span>}
                </div>
                <p className="players-header__subtitle">Competition standings organized by group.</p>
            </div>

            {loading ? (
                <div className="grid grid--auto-fill">{Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="entity-card" aria-hidden><div className="skeleton skeleton--text" style={{ width: "60%", height: 20 }} /><div className="skeleton skeleton--text" style={{ width: "30%", height: 14, marginTop: 8 }} /></div>
                ))}</div>
            ) : (
                <motion.div className="grid grid--auto-fill" variants={container} initial="hidden" animate="show">
                    {groups.map((group) => <motion.div key={group.group} variants={item}><StandingCard group={group} /></motion.div>)}
                </motion.div>
            )}
        </div>
    );
}
