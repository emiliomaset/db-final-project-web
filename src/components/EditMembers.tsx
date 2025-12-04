import {useEffect, useState} from "react";
import {API_BASE_URL} from "../config.ts";
import AddMemberModal from "./AddMemberModal.tsx";

const EditMembers = () => {

    interface Member {
        userId: string,
        name: string,
        email: string,
        subscriptionType:string
    }

    const [members, setMembers] = useState<Member[]>([])
    const [isLoadingMembers, setIsLoadingMembers] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch(`${API_BASE_URL}/getallmembers`);

            if (!response.ok) {
                throw new Error(`Error ${response.status} in fetching members!`);
            }
            const result: Member[] = await response.json();
            setMembers(result);
            setIsLoadingMembers(false)
        }

        fetchMembers();

    }, []);

    const removeMember = async (index: number) => {
        const memberToRemove = members[index]
        const response = await fetch (`${API_BASE_URL}/removemember/${memberToRemove.userId}`,{
            method: 'POST'})
        if (!response.ok) {
            throw new Error(`Error ${response.status} in removing member!`)
        }

        setMembers(prevMembers => [
            ...prevMembers.slice(0, index),
            ...prevMembers.slice(index + 1),
        ]);

        alert(`${memberToRemove.name} has been removed!`)
    }

    return(
        <div className="admin-home-content">

            <h2>All Members</h2>
            {!isLoadingMembers && members.length == 0 && (<h3>No members found!</h3>)}

            {!isLoadingMembers && members.length > 0 && (
                <>
                    <table
                        cellPadding="15"
                        style={{borderCollapse: "collapse", width: "80%", margin: "auto", textAlign: "center", background: "#f0f0f0", fontSize:"1em"}}>
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subscription Type</th>
                            <th>Action</th>
                        </tr>

                        </thead>

                        <tbody>



                        {members.map((member, i) => (

                            <>
                                <tr key={i}>
                                    <td>{member.userId}</td>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.subscriptionType}</td>
                                    <td><button className="blue-btn btn" onClick={() => removeMember(i)}>Remove</button></td>
                                </tr>

                            </>

                        ))}
                        </tbody>
                    </table>

                </>
            )
            }

            <button className="blue-btn btn" onClick={() => setIsModalOpen(true)}>Add Member</button>

            {isModalOpen && (<AddMemberModal members={members} setIsModalOpen={setIsModalOpen}/>)}
        </div>

    ) //

} //

export default EditMembers;