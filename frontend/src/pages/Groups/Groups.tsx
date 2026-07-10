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
        <>
            <h1>Groups</h1>

            {groups.map((group) => (
                <GroupCard
                    key={group.id}
                    group={group}
                />
            ))}
        </>
    );
}
