import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.ts";

function AdminAnalytics() {
  const [trendData, setTrendData] = useState([]);
  const [topTenData, setTopTenData] = useState([]);


  useEffect(() => {
    fetch(`${API_BASE_URL}/movies/trends/last24hours`)
      .then((res) => res.json())
      .then((data) => setTrendData(data))
      .catch((err) => console.log("Trend Error:", err));

    fetch(`${API_BASE_URL}/movies/top10/lastmonth`)
      .then((res) => res.json())
      .then((data) => setTopTenData(data))
      .catch((err) => console.log("Top10 Error:", err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>


      <style>
        {`
          .scroll-box {
            max-height: 250px;
            overflow-y: auto;
            overflow-x: hidden;
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }

          th {
            background-color: #f2f2f2;
          }
        `}
      </style>

      <h2>Streaming Analytics Dashboard</h2>



      <h3 style={{ marginTop: "30px" }}>Streaming Trend (Last 24 Hours)</h3>

      {trendData.length > 0 ? (
        <div className="scroll-box">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Stream Count</th>
                <th>Last Stream Time</th>
              </tr>
            </thead>

            <tbody>
              {trendData.map((item, i) => (
                <tr key={i}>
                  <td>{item.content_title}</td>
                  <td>{item.stream_count}</td>
                  <td>{new Date(item.last_stream_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available for the last 24 hours.</p>
      )}




      <h3 style={{ marginTop: "40px" }}>Top 10 Movies/Series (Last Month)</h3>

      {topTenData.length > 0 ? (
        <div className="scroll-box">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Total Streams</th>
              </tr>
            </thead>

            <tbody>
              {topTenData.map((item, i) => (
                <tr key={i}>
                  <td>{item.content_title}</td>
                  <td>{item.total_streams}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No streaming data available for the past month.</p>
      )}

    </div>
  );
}

export default AdminAnalytics;
