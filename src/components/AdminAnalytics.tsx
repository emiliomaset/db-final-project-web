import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.ts";

function AdminAnalytics() {
  const [trendData, setTrendData] = useState([]);
  const [topTenData, setTopTenData] = useState([]);


  useEffect(() => {
    fetch(`${API_BASE_URL}/movies/trends/last24hours`)
      .then((res) => res.json())
      .then((data) => setTrendData(data))
      .catch((err) => console.error("Error fetching 24-hour trends:", err));

    fetch(`${API_BASE_URL}/movies/top10/lastmonth`)
      .then((res) => res.json())
      .then((data) => setTopTenData(data))
      .catch((err) => console.error("Error fetching top 10 data:", err));
  }, []);

  return (
    <div className="admin-home-content">
      <h2>📊 Streaming Analytics Dashboard</h2>


      <section style={{ marginTop: "30px" }}>
        <h3>🎬 Streaming Trend (Last 24 Hours)</h3>
        {trendData.length > 0 ? (
          <table
            cellPadding="8"
            style={{ marginTop: "10px", borderCollapse: "collapse", width: "100%" }}
          >
            <thead style={{ background: "#f0f0f0" }}>
              <tr>
                <th>Title</th>
                <th>Stream Count</th>
                <th>Last Stream Time</th>
              </tr>
            </thead>
            <tbody style={{ background: "#f0f0f0" }}>
              {trendData.map((item: any, i) => (
                <tr key={i}>
                  <td>{item.content_title}</td>
                  <td>{item.stream_count}</td>
                  <td>{new Date(item.last_stream_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available for the last 24 hours.</p>
        )}
      </section>


      <section style={{ marginTop: "50px" }}>
        <h3>🏆 Top 10 Movies/Series (Last Month)</h3>
        {topTenData.length > 0 ? (
          <table
            cellPadding="8"
            style={{ marginTop: "10px", borderCollapse: "collapse", width: "100%" }}
          >
            <thead style={{ background: "#f0f0f0" }}>
              <tr>
                <th>Title</th>
                <th>Total Streams</th>
              </tr>
            </thead>
            <tbody style={{ background: "#f0f0f0" }}>
              {topTenData.map((item: any, i) => (
                <tr key={i}>
                  <td>{item.content_title}</td>
                  <td>{item.total_streams}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No streaming data available for the past month.</p>
        )}
      </section>
    </div>
  );
}

export default AdminAnalytics;
