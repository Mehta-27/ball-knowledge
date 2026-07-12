import { useEffect, useState } from "react";

import { getGroups } from "../../api/groups";
import GroupCard from "../../components/group/GroupCard";

import type { GroupCard as GroupCardType } from "../../types/groups";

export default function Groups() {
    const [groups, setGroups] = useState<GroupCardType[]>([]);

    useEffect(() => {
        async function fetchGroups() {
            const data = await getGroups();
            setGroups(data);
        }

        fetchGroups();
    }, []);

    return (
        <div className="section">
            <div className="section-header">
                <h1 className="type-h1">Groups</h1>
            </div>

            <div className="grid grid--auto-fill">
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        group={group}
                    />
                ))}
            </div>
        </div>
    );
}
