import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getGroups } from "../../api/groups";
import GroupCard from "../../components/group/GroupCard";
import type { GroupCard as GroupCardType } from "../../types/groups";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function Groups() {
    const [groups, setGroups] = useState<GroupCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGroups().then((data) => { setGroups(data); setLoading(false); });
    }, []);

    return (
        <div className="section">
            <div className="players-header">
                <div className="players-header__top">
                    <h1 className="players-header__title">Groups</h1>
                    {!loading && <span className="players-header__count">{groups.length} groups</span>}
                </div>
                <p className="players-header__subtitle">Competition groups with standings and match results.</p>
            </div>

            {loading ? (
                <div className="grid grid--auto-fill">{Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="entity-card" aria-hidden><div className="skeleton skeleton--text" style={{ width: "60%", height: 20 }} /></div>
                ))}</div>
            ) : (
                <motion.div className="grid grid--auto-fill" variants={container} initial="hidden" animate="show">
                    {groups.map((group) => <motion.div key={group.id} variants={item}><GroupCard group={group} /></motion.div>)}
                </motion.div>
            )}
        </div>
    );
}
