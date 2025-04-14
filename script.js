
async function fetchSheetData() {
  const sheetURL = "https://docs.google.com/spreadsheets/d/1eFbWP_QvdetV2uluT9KL5t_fO-Z2muQyXmLeTapIH9E/gviz/tq?tqx=out:json";
  try {
    const res = await fetch(sheetURL);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2)); // 去除 Google 回傳前後包裝
    const rows = json.table.rows;
    if (rows.length > 0) {
      const latest = rows[rows.length - 1].c;
      document.getElementById("totalViews").innerText = latest[1]?.v || "0";
      document.getElementById("todayViews").innerText = latest[2]?.v || "0";
      document.getElementById("stats").style.display = "block";
    }
  } catch (e) {
    console.error("讀取試算表失敗", e);
  }
}

window.onload = fetchSheetData;
