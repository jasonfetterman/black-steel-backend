async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found. User not logged in.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/features", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log(data);
  } catch (err) {
    console.error("Dashboard load failed:", err);
  }
}

loadDashboard();