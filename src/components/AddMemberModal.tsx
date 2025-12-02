import {useState} from "react";
import Select from "react-select";
import {API_BASE_URL} from "../config.ts";

const AddMemberModal = ({members, setIsModalOpen} :
                        {members: {userId: string, name: string, email: string, subscriptionType:string}[], setIsModalOpen: any}) => {

    interface newMember {
        email: string,
        name: string,
        street_name: string,
        city: string,
        state: string,
        zip: string,
        phone_num: string,
        password: string,
        subscription_type: string,
    }
    const [newMemberData, setNewMemberData] = useState<newMember>({
        email: "",
        name: "",
        street_name: "",
        city: "",
        state: "",
        zip: "",
        phone_num: "",
        password: "",
        subscription_type: ""
    });

    const subscriptionTypeOptions = [
        {value: "Basic", label: "Basic"},
        {value: "Premium", label: "Premium"}
    ]

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        setNewMemberData({...newMemberData, [e.target.name] : e.target.value})
    }

    // const translateNewMemberDataToDto = () => {
    //
    // } // end of translateNewMemberDataToDto

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Sending new member data:", newMemberData)
        const response = await fetch(`${API_BASE_URL}/addmember`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newMemberData)
        })

        if (!response.ok) {
            alert("New member was not able to be submitted. Please try again!")

        }

        const result = await response.text()

        members.push({userId: result, email: newMemberData.email, name: newMemberData.name, subscriptionType: newMemberData.subscription_type})
        setIsModalOpen(false)

    } // end of handleSubmit

    return(
        <div className="modal-container">
            <form onSubmit={handleSubmit} className="model-content">
                <div className="form-row">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={newMemberData.email}
                            placeholder="Enter email..."
                            onChange={handleChange}
                            maxLength={25}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newMemberData.name}
                            placeholder="Enter name..."
                            onChange={handleChange}
                            maxLength={20}
                            required
                        />
                    </div>
                </div>


                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        name="street_name"
                        value={newMemberData.street_name}
                        placeholder="Enter Address..."
                        onChange={handleChange}
                        maxLength={30}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={newMemberData.city}
                            placeholder="Enter city..."
                            onChange={handleChange}
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            value={newMemberData.state}
                            placeholder="Enter state..."
                            onChange={handleChange}
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label>Zip</label>
                        <input
                            type="text"
                            name="zip"
                            value={newMemberData.zip}
                            placeholder="Enter zip code..."
                            onChange={handleChange}
                            maxLength={15}
                        />
                    </div>

                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone_num"
                            value={newMemberData.phone_num}
                            placeholder="Enter phone number..."
                            onChange={handleChange}
                            maxLength={15}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={newMemberData.password}
                            placeholder="Enter password..."
                            onChange={handleChange}
                            maxLength={25}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Subscription Type</label>
                    <Select
                        options={subscriptionTypeOptions}
                        onChange={(data) =>
                            setNewMemberData((prevState) => ({
                                ...prevState,
                                subscription_type: data.value
                            }))
                        }
                        required
                    />



                </div>

                <button className="blue-btn btn" type="submit">Submit</button>
            </form>
        </div>


    ) // end of return

} // end of AddMemberModal

export default AddMemberModal