import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function MemberProfile() {
  const navigate = useNavigate();

  const [email] = useState(localStorage.getItem("email") || "");
  const [memberId, setMemberId] = useState<string | null>(localStorage.getItem("userId"));
  const [name, setName] = useState<string>(localStorage.getItem("memberName") || "");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {

    const fetchInfo = async () => {
      if (!email) return;
      try {
        const res = await fetch(`${API_BASE_URL}/movies/member-info/${email}`);
        if (!res.ok) return;
        const info = await res.json();
        if (info?.user_id) {
          setMemberId(info.user_id);
        }
        if (info?.name) {
          setName(info.name);
        }
      } catch (e) {

      }
    };

    if (!memberId || !name) fetchInfo();
  }, [email, memberId, name]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!memberId) {
      setError("Missing member identifier. Try reloading the page.");
      return;
    }

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const body: any = { name: name.trim() };
      if (password.trim().length > 0) {
        body.password = password.trim();
      }

      const res = await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to update profile (status ${res.status})`);
      }


      localStorage.setItem("memberName", name.trim());
      setMessage("Profile updated successfully.");
      setPassword("");

      setTimeout(() => navigate("/member/home"), 800);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate("/");
    return null;
  }

  return (
    <div style={{ padding: "30px", color: "white", backgroundColor: "cadetblue", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center" }}>Edit Profile</h2>

      <form onSubmit={onSave} style={{ maxWidth: 420, margin: "20px auto", background: "#141414", padding: 20, borderRadius: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Email (read-only)</label>
          <input
            type="email"
            value={email}
            readOnly
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: "#fff" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: "#fff" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>New Password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: "#fff" }}
          />
        </div>

        {error && (
          <div style={{ color: "#ff6b6b", marginBottom: 10 }}>{error}</div>
        )}
        {message && (
          <div style={{ color: "#4cd137", marginBottom: 10 }}>{message}</div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "#333", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 2, padding: "10px 14px", borderRadius: 10, background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberProfile;
