import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function MemberProfile() {
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "";
  const savedName = localStorage.getItem("memberName") || "";
  const savedId = localStorage.getItem("userId") || "";

  const [userId, setUserId] = useState(savedId);
  const [name, setName] = useState(savedName);
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!email) return;

      if (!userId) {
        const r = await fetch(`${API_BASE_URL}/movies/member-info/${email}`);
        if (r.ok) {
          const data = await r.json();
          if (data?.user_id) {
            const id = String(data.user_id);
            setUserId(id);
            localStorage.setItem("userId", id);
            if (data?.name) {
              setName(data.name);
              localStorage.setItem("memberName", data.name);
            }
          }
        }
      }

      if (userId) {
        const r = await fetch(`${API_BASE_URL}/members/${userId}`);
        if (r.ok) {
          const u = await r.json();
          setName(u.name || name);
          setStreetName(u.streetName || "");
          setCity(u.city || "");
          setStateVal(u.state || "");
          setZip(u.zip || "");
          setPhoneNum(u.phoneNum || "");
        }
      }
    }
    load();
  }, [email, userId]);

  async function save(e: any) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (password || confirmPassword) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    const updated: any = {
      name,
      streetName,
      city,
      state: stateVal,
      zip,
      phoneNum
    };

    if (password) updated.password = password;

    setLoading(true);

    let targetUserId = userId;
    if (!targetUserId && email) {
      try {
        const r0 = await fetch(`${API_BASE_URL}/movies/member-info/${email}`);
        if (r0.ok) {
          const d0 = await r0.json();
          if (d0?.user_id) {
            targetUserId = String(d0.user_id);
            setUserId(targetUserId);
            localStorage.setItem("userId", targetUserId);
          }
        }
      } catch {}
    }

    if (!targetUserId) {
      setError("Unable to determine user ID. Please try logging in again.");
      setLoading(false);
      return;
    }

    try {
      const r = await fetch(`${API_BASE_URL}/users/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });

      if (!r.ok) {
        let details = "";
        try { details = await r.text(); } catch {}
        setError(`Failed to update profile ${r.status ? `(${r.status})` : ""} ${details ? details : ""}`);
        setLoading(false);
        return;
      }

      localStorage.setItem("memberName", name);
      setMessage("Profile updated.");
      setLoading(false);

      setTimeout(() => navigate("/member/home"), 800);

    } catch (e: any) {
      setError(`Failed to update profile. ${e?.message || ""}`);
      setLoading(false);
    }
  }

  if (!email) {
    navigate("/");
    return null;
  }

  return (
    <div style={{ padding: "30px", color: "white", backgroundColor: "cadetblue", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center" }}>Edit Profile</h2>

      <form onSubmit={save} style={{ maxWidth: "40vw", margin: "20px auto", background: "#141414", padding: 20, borderRadius: 12 }}>

        <div style={{ marginBottom: 12 }}>
          <label>Email (read-only)</label>
          <input type="email" value={email} readOnly style={{ width: "95%", padding: 10 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "95%", padding: 10 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Street</label>
          <input value={streetName} onChange={(e) => setStreetName(e.target.value)} style={{ width: "95%", padding: 10 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "95%", padding: 10 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>State</label>
          <input value={stateVal} onChange={(e) => setStateVal(e.target.value)} style={{ width: "95%", padding: 10 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>ZIP</label>
          <input value={zip} onChange={(e) => setZip(e.target.value)} style={{ width: "95%", padding: 10 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Phone</label>
          <input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} style={{ width: "95%", padding: 10 }} />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label>New Password (optional)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 10 }} />
          </div>

          <div style={{ flex: 1 }}>
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: "90%", padding: 10 }} />
          </div>
        </div>

        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {message && <div style={{ color: "lightgreen", marginBottom: 10 }}>{message}</div>}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: 10 }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ flex: 2, padding: 10 }}>{loading ? "Saving..." : "Save"}</button>
        </div>

      </form>
    </div>
  );
}

export default MemberProfile;
