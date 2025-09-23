document.getElementById("checkBtn").addEventListener("click", async () => {
  const inputText = document.getElementById("inputText").value;

  if (!inputText.trim()) {
    document.getElementById("result").innerText = "Please enter some text.";
    return;
  }

  const response = await fetch("http://127.0.0.1:8000/detect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: inputText })
  });

  const data = await response.json();
  document.getElementById("result").innerText =
    `Verdict: ${data.verdict}\nConfidence: ${data.confidence}%`;
});
