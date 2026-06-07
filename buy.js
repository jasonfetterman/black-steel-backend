async function buyUnit(droneId, userId) {
  try {
    const res = await fetch("http://localhost:3000/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        droneId,
        userId
      })
    });

    const data = await res.json();

    if (!data.url) {
      throw new Error(data.error || "No checkout URL returned");
    }

    window.location.href = data.url;
  } catch (err) {
    console.error("BUY ERROR:", err);
    alert("Purchase failed");
  }
}