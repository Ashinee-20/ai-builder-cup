const port = process.env.CDP_PORT || "9223";
const base = process.env.APP_URL || "http://localhost:3100";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target) throw new Error("No browser page target found");

const socket = new WebSocket(target.webSocketDebuggerUrl.replace("localhost", "127.0.0.1"));
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let id = 0;
const pending = new Map();
const consoleErrors = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id); pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") consoleErrors.push(message.params.exceptionDetails.text);
});
function call(method, params = {}) {
  const callId = ++id;
  socket.send(JSON.stringify({ id: callId, method, params }));
  return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
}
async function navigate(path) { await call("Page.navigate", { url: `${base}${path}` }); await delay(1400); }
async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function clickText(text) {
  const clicked = await evaluate(`(() => { const node = [...document.querySelectorAll('button,a')].find((el) => el.textContent.includes(${JSON.stringify(text)})); if (!node) return false; node.click(); return true; })()`);
  if (!clicked) throw new Error(`Could not click ${text}`);
  await delay(500);
}

await call("Runtime.enable"); await call("Page.enable");
await navigate("/");
await evaluate("localStorage.clear(); true");
await navigate("/student/lessons/rational-numbers-foundations");
if (!(await evaluate("document.body.innerText.includes('not published')"))) throw new Error("Unpublished packet gate failed");

await navigate("/teacher/lessons/rational-numbers-foundations");
await clickText("Approve & publish");
await navigate("/student/lessons/rational-numbers-foundations");
if (!(await evaluate("document.body.innerText.includes('Teacher approved')"))) throw new Error("Published packet did not appear");

await clickText("Quiz");
await evaluate(`(() => { const choices = [2,1,2]; document.querySelectorAll('.quiz-question').forEach((q,i) => q.querySelectorAll('input')[choices[i]].click()); return true; })()`);
await clickText("Submit answers");
if (!(await evaluate("document.body.innerText.includes('3 of 3') || document.body.innerText.includes('Submitted')"))) throw new Error("Quiz submission failed");

await clickText("Explain it");
await evaluate(`(() => { const field = document.querySelector('#explanation'); const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set; setter.call(field, 'A rational number is p/q for two integers, q cannot be zero; for example 3/5.'); field.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
await clickText("Send explanation");
await delay(700);
if (!(await evaluate("document.body.innerText.includes('That works')"))) throw new Error("Explanation feedback failed");

await navigate("/teacher/classes/math-8a/insights");
const summary = await evaluate(`({ hasLiveEvidence: document.body.innerText.toLowerCase().includes('live student evidence'), responded: [...document.querySelectorAll('.metric strong')].map((el) => el.textContent) })`);
if (!summary.hasLiveEvidence || summary.responded[1] !== "1") throw new Error(`Insights did not update: ${JSON.stringify(summary)}`);
if (consoleErrors.length) throw new Error(`Browser exceptions: ${consoleErrors.join('; ')}`);

console.log(JSON.stringify({ ok: true, gate: true, quiz: "3/3", explanation: "demonstrated", insightsResponded: 1 }));
socket.close();
