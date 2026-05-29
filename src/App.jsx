import { supabase } from './supabase'
import Map from './Map'
import { useState, useEffect, useRef } from "react";

const AMBER = "#f5c842";
const AMBER_DARK = "#3a2000";
const AMBER_MID = "#c8860a";

const typeColors = {
  kando:  { bg: "#fff8e0", border: AMBER,     dot: AMBER,     text: AMBER_MID },
  action: { bg: "#EEEDFE", border: "#7F77DD", dot: "#7F77DD", text: "#534AB7" },
  kizuki: { bg: "#E1F5EE", border: "#1D9E75", dot: "#1D9E75", text: "#0F6E56" },
  gimon:  { bg: "#FAECE7", border: "#D85A30", dot: "#D85A30", text: "#993C1D" },
};
const typeEmoji = { kando: "🤩", action: "🎯", kizuki: "💡", gimon: "❓" };
const typeLabel = { kando: "感動", action: "行動", kizuki: "気づき", gimon: "疑問" };

function WantaroSVG({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="70" fill="#f0c878" stroke="#d8a040" strokeWidth="3"/>
      <ellipse cx="40" cy="72" rx="20" ry="30" fill="#d8900a" stroke="#b87008" strokeWidth="2" transform="rotate(-14 40 72)"/>
      <ellipse cx="120" cy="72" rx="20" ry="30" fill="#d8900a" stroke="#b87008" strokeWidth="2" transform="rotate(14 120 72)"/>
      <ellipse cx="60" cy="40" rx="12" ry="9" fill="#e8b040" stroke="#d09028" strokeWidth="1.2"/>
      <ellipse cx="80" cy="34" rx="14" ry="10" fill="#f0c050" stroke="#d8a030" strokeWidth="1.2"/>
      <ellipse cx="100" cy="40" rx="12" ry="9" fill="#e8b040" stroke="#d09028" strokeWidth="1.2"/>
      <circle cx="60" cy="80" r="17" fill="white" stroke="#2a1408" strokeWidth="2"/>
      <circle cx="100" cy="80" r="17" fill="white" stroke="#2a1408" strokeWidth="2"/>
      <circle cx="62" cy="83" r="10" fill="#5a3010"/>
      <circle cx="102" cy="83" r="10" fill="#5a3010"/>
      <circle cx="62" cy="84" r="6" fill="#1a0800"/>
      <circle cx="102" cy="84" r="6" fill="#1a0800"/>
      <circle cx="57" cy="76" r="4" fill="white"/>
      <circle cx="97" cy="76" r="4" fill="white"/>
      <ellipse cx="44" cy="97" rx="10" ry="10" fill="#ffb0b8" opacity="0.5"/>
      <ellipse cx="116" cy="97" rx="10" ry="10" fill="#ffb0b8" opacity="0.5"/>
      <ellipse cx="80" cy="108" rx="13" ry="9" fill="#2a1408" stroke="#1a0808" strokeWidth="1"/>
      <ellipse cx="76" cy="104" rx="3.5" ry="2.2" fill="white" opacity="0.35"/>
      <path d="M68 117 Q75 126 80 120 Q85 126 92 117" fill="none" stroke="#3a1808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TopBar({ title, right, onBack }) {
  return (
    <div style={{ background: AMBER, padding: "13px 18px 11px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      {onBack && <button onClick={onBack} style={{ color: AMBER_DARK, fontSize: 20, background: "none", border: "none", cursor: "pointer", padding: 0 }}>←</button>}
      <span style={{ fontSize: 16, fontWeight: 500, color: AMBER_DARK, flex: 1 }}>{title}</span>
      {right}
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const tabs = [
    { id: "map",  icon: "🗺️", label: "地図" },
    { id: "team", icon: "👥", label: "チーム" },
    { id: "log",  icon: "📋", label: "ログ" },
    { id: "wan",  icon: "🐾", label: "わんたろう" },
  ];
  return (
    <div style={{ background: "#fff", borderTop: "0.5px solid #f0e0a0", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", flexShrink: 0 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10,
            color: active === t.id ? AMBER_MID : "#b0a080", background: "none", border: "none",
            cursor: "pointer", fontFamily: "inherit", fontWeight: active === t.id ? 500 : 400 }}>
          <span style={{ fontSize: 22 }}>{t.icon}</span>{t.label}
        </button>
      ))}
    </div>
  );
}

function NazeChain({ naze }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {naze.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 9, marginBottom: i < naze.length - 1 ? 8 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%",
              background: i === naze.length - 1 ? AMBER_DARK : AMBER,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 500, color: i === naze.length - 1 ? AMBER : AMBER_DARK }}>{i + 1}</div>
            {i < naze.length - 1 && <div style={{ width: 1.5, flex: 1, background: AMBER, opacity: 0.35, margin: "3px 0" }} />}
          </div>
          <div style={{ flex: 1, borderRadius: 10, padding: "8px 10px",
            background: i === naze.length - 1 ? "#fff8e0" : "#fffcf5",
            border: `1px solid ${i === naze.length - 1 ? AMBER : "#ecdca0"}` }}>
            <div style={{ fontSize: 10, color: AMBER_MID, fontWeight: 500, marginBottom: 3 }}>
              {i === naze.length - 1 ? "🔑 本質" : `なぜ ${i + 1}`}
            </div>
            <div style={{ fontSize: 12, color: "#3a2000", lineHeight: 1.6 }}>{item}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== AI深掘りチャット =====
function WantaroChat({ type, body, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const bottomRef = useRef(null);
  const typeNameMap = { kando: "感動", action: "行動", kizuki: "気づき", gimon: "疑問" };

  useEffect(() => { startChat(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function askClaude(prevAnswers, currentStep) {
    const systemPrompt = `あなたは「わんたろう」という名前のかわいいゴールデン犬のAIキャラクターです。
ユーザーが日常で体験した「${typeNameMap[type] || "体験"}」について、「なぜ？」を3回繰り返して本質的な価値観を引き出します。

ルール：
- 必ず1文の質問だけを返す（説明や前置き不要）
- 語尾は「〜ワン？」「〜かな？」「〜だったの？」など犬らしく親しみやすく
- ステップ${currentStep + 1}/3の質問をする
- ステップ3（最後）は「本当は何を大切にしてるのかな？🔑」のように価値観・本質を問う
- 絵文字を1〜2個使う
- 短く、温かく、好奇心旺盛に

ユーザーの体験：「${body}」
${prevAnswers.length > 0 ? `\nこれまでの回答：\n${prevAnswers.map((a, i) => `なぜ${i+1}: ${a}`).join("\n")}` : ""}`;

    try {
      const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    system: systemPrompt,
    userMessage: `ステップ${currentStep + 1}の質問をしてください。`,
  }),
});
const data = await res.json();
return data.text || "どうしてそう思ったの？🐾";
    } catch {                              // ← catchを追加
      return "どうしてそう思ったの？🐾";
    }
  }

  async function generateSummary(allAnswers) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: `あなたは「わんたろう」という名前のかわいいゴールデン犬のAIキャラクターです。
ユーザーが3回の深掘りを終えました。温かく褒めて、気づいた価値観を一言でまとめてください。
語尾は「〜ワン！」など犬らしく。絵文字2〜3個。2文以内。`,
        userMessage: `体験：${body}\n回答1：${allAnswers[0]}\n回答2：${allAnswers[1]}\n回答3：${allAnswers[2]}`,
      }),
    });
    const data = await res.json();
    return data.text || "深掘り完了！すごい気づきだったワン🐾✨";
  } catch {
    return "深掘り完了！すごい気づきだったワン🐾✨";
  }
}

  async function startChat() {
    setLoading(true);
    const firstQ = await askClaude([], 0);
    setMessages([{ role: "wan", text: firstQ }]);
    setLoading(false);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const newAnswers = [...answers, userText];
    setAnswers(newAnswers);
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep >= 3) {
      setLoading(true);
      const summary = await generateSummary(newAnswers);
      setMessages([...newMessages, { role: "wan", text: summary }]);
      setLoading(false);
      setTimeout(() => onComplete(newAnswers), 1800);
    } else {
      setLoading(true);
      const nextQ = await askClaude(newAnswers, nextStep);
      setMessages([...newMessages, { role: "wan", text: nextQ }]);
      setLoading(false);
    }
  }

  const progress = Math.min(step, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* プログレスバー */}
      <div style={{ padding: "10px 16px 8px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: AMBER_MID, fontWeight: 500 }}>わんたろうと深掘り中…</span>
          <span style={{ fontSize: 11, color: AMBER_MID }}>{progress}/3</span>
        </div>
        <div style={{ height: 4, background: "#f0e0a0", borderRadius: 99 }}>
          <div style={{ height: 4, background: AMBER, borderRadius: 99, width: `${(progress / 3) * 100}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* チャットエリア */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* 体験の要約 */}
        <div style={{ background: "#fffbf0", border: "1px solid #f0e0a0", borderRadius: 12, padding: "10px 12px", fontSize: 12, color: "#8a6010", lineHeight: 1.6 }}>
          📝 {body}
        </div>
        {/* メッセージ */}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 8, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-end" }}>
            {msg.role === "wan" && <WantaroSVG size={30} />}
            <div style={{
              maxWidth: "78%",
              background: msg.role === "wan" ? "#fff" : AMBER,
              border: msg.role === "wan" ? "1px solid #ecdca0" : "none",
              borderRadius: msg.role === "wan" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
              padding: "10px 13px", fontSize: 13,
              color: msg.role === "wan" ? "#3a2000" : AMBER_DARK,
              lineHeight: 1.65,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {/* ローディング */}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <WantaroSVG size={30} />
            <div style={{ background: "#fff", border: "1px solid #ecdca0", borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER,
                    animation: `bounce 1s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      {step < 3 && (
        <div style={{ padding: "10px 14px 14px", borderTop: "0.5px solid #f0e0a0", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="わんたろうに答えてみよう…"
              disabled={loading}
              style={{
                flex: 1, border: "1px solid #ecdca0", borderRadius: 99,
                padding: "10px 14px", fontSize: 13, color: "#3a2000",
                background: "#fff", fontFamily: "inherit", outline: "none",
                opacity: loading ? 0.6 : 1,
              }}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? AMBER : "#f0e0a0",
                border: "none", borderRadius: "50%", width: 42, height: 42,
                fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
              ➤
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

function PostCard({ post, onExpand, expanded }) {
  const c = typeColors[post.type] || typeColors.kando;
  const emoji = typeEmoji[post.type] || "🤩";
  const label = typeLabel[post.type] || "感動";
  const naze = [post.naze1, post.naze2, post.naze3].filter(Boolean);
  const displayName = post.username || "匿名";
  const initial = displayName[0];

  return (
    <div style={{ background: "#fff", borderRadius: 18, border: "0.5px solid #ecdca0", overflow: "hidden" }}>
      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 500, color: c.text, border: "1px solid #ecdca0", flexShrink: 0 }}>
            {initial}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#3a2000" }}>{displayName}</div>
            <div style={{ fontSize: 10, color: "#a09070" }}>
              {new Date(post.created_at).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 99, padding: "3px 9px", fontSize: 11, color: c.text, fontWeight: 500 }}>
            {emoji} {label}
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#3a2000", lineHeight: 1.65, marginBottom: 10 }}>{post.body}</div>
        {naze.length > 0 && (!expanded ? (
          <div onClick={() => onExpand(post.id)}
            style={{ background: "#fffbf0", border: "1px solid #f0e0a0", borderRadius: 10, padding: "8px 11px", cursor: "pointer", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
              <WantaroSVG size={20} />
              <span style={{ fontSize: 11, color: AMBER_MID, fontWeight: 500 }}>わんたろうと深掘り（なぜ×{naze.length}）</span>
              <span style={{ fontSize: 10, color: "#c0a060", marginLeft: "auto" }}>タップで開く ▾</span>
            </div>
            <div style={{ fontSize: 12, color: "#8a6010", lineHeight: 1.5 }}>🔑 {naze[naze.length - 1]}</div>
          </div>
        ) : (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <WantaroSVG size={22} />
              <span style={{ fontSize: 11, color: AMBER_MID, fontWeight: 500 }}>わんたろうと深掘り</span>
              <button onClick={() => onExpand(null)} style={{ fontSize: 10, color: "#c0a060", marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>閉じる ▴</button>
            </div>
            <NazeChain naze={naze} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 14px 12px", borderTop: "0.5px solid #f5ead0" }}>
        <button style={{ fontSize: 12, color: "#a09070", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", marginRight: 16 }}>❤️ いいね</button>
        <button style={{ fontSize: 12, color: "#a09070", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>💬 コメント</button>
        <button style={{ marginLeft: "auto", fontSize: 12, color: AMBER_MID, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>🐾 さらに深掘り</button>
      </div>
    </div>
  );
}

function LogScreen() {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [inputName, setInputName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchPosts(name) {
    setLoading(true);
    let query = supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (name) query = query.eq("username", name);
    const { data } = await query;
    if (data) setPosts(data);
    setLoading(false);
  }

  function handleSearch() { setUsername(inputName); fetchPosts(inputName); }
  useEffect(() => { fetchPosts(""); }, []);

  const filters = [
    { id: "all", label: "すべて" }, { id: "kando", label: "🤩 感動" },
    { id: "action", label: "🎯 行動" }, { id: "kizuki", label: "💡 気づき" }, { id: "gimon", label: "❓ 疑問" },
  ];
  const filtered = filter === "all" ? posts : posts.filter(p => p.type === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: "0.5px solid #f0e0a0", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: AMBER_MID, fontWeight: 500, marginBottom: 6 }}>ユーザー名で絞り込む</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={inputName} onChange={e => setInputName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="名前を入力（空欄=全員）"
            style={{ flex: 1, border: "1px solid #ecdca0", borderRadius: 10, padding: "8px 11px", fontSize: 13, color: "#3a2000", background: "#fff", fontFamily: "inherit", outline: "none" }} />
          <button onClick={handleSearch} style={{ background: AMBER, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 500, color: AMBER_DARK, cursor: "pointer", fontFamily: "inherit" }}>検索</button>
        </div>
        {username && (
          <div style={{ marginTop: 6, fontSize: 11, color: AMBER_MID, display: "flex", alignItems: "center", gap: 6 }}>
            「{username}」の記録を表示中
            <button onClick={() => { setInputName(""); setUsername(""); fetchPosts(""); }}
              style={{ fontSize: 11, color: "#c0a060", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>✕ クリア</button>
          </div>
        )}
      </div>
      <div style={{ padding: "8px 14px 6px", display: "flex", gap: 6, overflowX: "auto", borderBottom: "0.5px solid #f0e0a0", flexShrink: 0 }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ padding: "5px 12px", borderRadius: 99, border: `1px solid ${filter === f.id ? AMBER : "#ecdca0"}`,
              background: filter === f.id ? "#fff8e0" : "#fff", fontSize: 12,
              color: filter === f.id ? AMBER_MID : "#9a8060", cursor: "pointer",
              fontFamily: "inherit", fontWeight: filter === f.id ? 500 : 400, whiteSpace: "nowrap", flexShrink: 0 }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "6px 14px 2px", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#c0a860" }}>{loading ? "読み込み中..." : `${filtered.length}件`}</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#c0a060", paddingTop: 40 }}>読み込み中…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#c0a060", paddingTop: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            <div>記録がありません</div>
          </div>
        ) : filtered.map(post => {
          const c = typeColors[post.type] || typeColors.kando;
          const naze = [post.naze1, post.naze2, post.naze3].filter(Boolean);
          const isExpanded = expanded === post.id;
          const date = new Date(post.created_at).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
          return (
            <div key={post.id} style={{ background: "#fff", borderRadius: 16, border: "0.5px solid #ecdca0" }}>
              <div style={{ padding: "11px 13px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: c.text, border: "1px solid #ecdca0", flexShrink: 0 }}>
                    {(post.username || "匿")[0]}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#3a2000", flex: 1 }}>{post.username || "匿名"}</div>
                  <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 99, padding: "2px 8px", fontSize: 10, color: c.text, fontWeight: 500 }}>
                    {typeEmoji[post.type]} {typeLabel[post.type]}
                  </div>
                  <div style={{ fontSize: 10, color: "#a09070" }}>{date}</div>
                </div>
                <div style={{ fontSize: 13, color: "#3a2000", lineHeight: 1.65, marginBottom: 8 }}>{post.body}</div>
                {naze.length > 0 && (!isExpanded ? (
                  <div onClick={() => setExpanded(post.id)}
                    style={{ background: "#fffbf0", border: "1px solid #f0e0a0", borderRadius: 10, padding: "7px 11px", cursor: "pointer", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <WantaroSVG size={18} />
                      <span style={{ fontSize: 11, color: AMBER_MID, fontWeight: 500 }}>なぜ×{naze.length}</span>
                      <span style={{ fontSize: 10, color: "#c0a060", marginLeft: "auto" }}>タップで開く ▾</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#8a6010" }}>🔑 {naze[naze.length - 1]}</div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <WantaroSVG size={20} />
                      <span style={{ fontSize: 11, color: AMBER_MID, fontWeight: 500 }}>なぜ深掘り</span>
                      <button onClick={() => setExpanded(null)} style={{ fontSize: 10, color: "#c0a060", marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>閉じる ▴</button>
                    </div>
                    <NazeChain naze={naze} />
                  </div>
                ))}
              </div>
              {post.lat && post.lng && (
                <div style={{ padding: "5px 13px 10px", borderTop: "0.5px solid #f5ead0" }}>
                  <span style={{ fontSize: 10, color: "#a09070" }}>📍 {post.lat.toFixed(4)}, {post.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamFeed() {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);
  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  const filters = [
    { id: "all", label: "すべて" }, { id: "kando", label: "🤩 感動" },
    { id: "action", label: "🎯 行動" }, { id: "kizuki", label: "💡 気づき" }, { id: "gimon", label: "❓ 疑問" },
  ];
  const filtered = filter === "all" ? posts : posts.filter(p => p.type === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 8px", display: "flex", gap: 6, overflowX: "auto", borderBottom: "0.5px solid #f0e0a0", flexShrink: 0 }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ padding: "5px 12px", borderRadius: 99, border: `1px solid ${filter === f.id ? AMBER : "#ecdca0"}`,
              background: filter === f.id ? "#fff8e0" : "#fff", fontSize: 12,
              color: filter === f.id ? AMBER_MID : "#9a8060", cursor: "pointer",
              fontFamily: "inherit", fontWeight: filter === f.id ? 500 : 400, whiteSpace: "nowrap", flexShrink: 0 }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ margin: "10px 14px 2px", background: "#fffbf0", border: "1px solid #f0e0a0", borderRadius: 14, padding: "9px 12px", display: "flex", gap: 9, alignItems: "center", flexShrink: 0 }}>
        <WantaroSVG size={34} />
        <div>
          <div style={{ fontSize: 10, color: AMBER_MID, fontWeight: 500, marginBottom: 2 }}>わんたろうより</div>
          <div style={{ fontSize: 12, color: AMBER_DARK, lineHeight: 1.5 }}>みんなの「なぜ」を読んで、あなたはどう思う？🐾</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#c0a060", paddingTop: 40 }}>読み込み中…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#c0a060", paddingTop: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🐾</div>
            <div>まだ投稿がありません</div>
          </div>
        ) : filtered.map(post => (
          <PostCard key={post.id} post={post}
            expanded={expanded === post.id}
            onExpand={(id) => setExpanded(expanded === id ? null : id)} />
        ))}
      </div>
    </div>
  );
}

function MapScreen({ onPost }) {
  const [selectedPin, setSelectedPin] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase.from('posts').select('*').not('lat', 'is', null).order('created_at', { ascending: false });
      if (data) setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <Map posts={posts} onPinClick={setSelectedPin} />
      <div style={{ position: "absolute", bottom: 70, left: 12, right: 60, background: "#fffcf5",
        borderRadius: 18, padding: "10px 12px", border: "1px solid #f0d890",
        display: "flex", gap: 10, alignItems: "center", zIndex: 10 }}>
        <WantaroSVG size={38} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: AMBER_MID, fontWeight: 500, marginBottom: 2 }}>わんたろう</div>
          <div style={{ fontSize: 12, color: AMBER_DARK }}>どうしてそう思ったの？教えてワン🐾</div>
        </div>
      </div>
      <button onClick={onPost}
        style={{ position: "absolute", bottom: 14, right: 14, width: 48, height: 48,
          borderRadius: "50%", background: AMBER, border: "3px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, cursor: "pointer", zIndex: 10 }}>＋</button>
      {selectedPin && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(58,32,0,0.3)", display: "flex", alignItems: "flex-end", zIndex: 20 }}
          onClick={() => setSelectedPin(null)}>
          <div style={{ background: "#fffcf5", borderRadius: "24px 24px 0 0", width: "100%", padding: "18px 16px 28px", maxHeight: "78%", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: "#e0d0a0", borderRadius: 99, margin: "0 auto 14px" }} />
            <div style={{ fontSize: 14, color: "#3a2000", lineHeight: 1.65, marginBottom: 12, fontWeight: 500 }}>{selectedPin.body}</div>
            <NazeChain naze={[selectedPin.naze1, selectedPin.naze2, selectedPin.naze3].filter(Boolean)} />
          </div>
        </div>
      )}
    </div>
  );
}

function PostScreen({ onBack, onPosted }) {
  const [step, setStep] = useState("form"); // "form" | "chat"
  const [type, setType] = useState("kando");
  const [username, setUsername] = useState("");
  const [body, setBody] = useState("");
  const [shared, setShared] = useState(true);
  const [posting, setPosting] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.log("位置情報取得失敗", err)
    );
  }, []);

  const types = [
    { id: "kando",  emoji: "🤩", label: "感動した" },
    { id: "action", emoji: "🎯", label: "行動した" },
    { id: "kizuki", emoji: "💡", label: "気づいた" },
    { id: "gimon",  emoji: "❓", label: "疑問に思った" },
  ];

  async function handleChatComplete(answers) {
    setPosting(true);
    const { error } = await supabase.from('posts').insert([{
      type,
      username: username || "匿名",
      body,
      naze1: answers[0] || "",
      naze2: answers[1] || "",
      naze3: answers[2] || "",
      shared,
      lat: location?.lat,
      lng: location?.lng,
    }]);
    if (error) console.error("投稿エラー", error);
    setPosting(false);
    onPosted();
  }

  // チャット画面
  if (step === "chat") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <TopBar title="わんたろうと深掘り🐾" onBack={() => setStep("form")} />
        {posting ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <WantaroSVG size={64} />
            <span style={{ fontSize: 14, color: AMBER_MID }}>投稿中…🐾</span>
          </div>
        ) : (
          <WantaroChat type={type} body={body} onComplete={handleChatComplete} />
        )}
      </div>
    );
  }

  // 入力フォーム画面
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="新しい記録" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 18, background: "#fffcf5" }}>

        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: AMBER_MID, letterSpacing: "0.7px", marginBottom: 8 }}>あなたの名前</div>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="名前を入力（省略可）"
            style={{ width: "100%", border: "1px solid #ecdca0", borderRadius: 12, padding: "10px 12px", fontSize: 13, color: "#3a2000", background: "#fff", fontFamily: "inherit", outline: "none" }} />
        </div>

        <div style={{ height: 1, background: "#f0e0a0", opacity: 0.6 }} />

        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: AMBER_MID, letterSpacing: "0.7px", marginBottom: 8 }}>どんな記録？</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
            {types.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                style={{ padding: "9px 4px 8px", borderRadius: 12,
                  border: `1.5px solid ${type === t.id ? AMBER : "#ecdca0"}`,
                  background: type === t.id ? "#fff8e0" : "#fff",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", fontFamily: "inherit" }}>
                <span style={{ fontSize: 20 }}>{t.emoji}</span>
                <span style={{ fontSize: 10, color: type === t.id ? AMBER_MID : "#7a6030", fontWeight: 500 }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "#f0e0a0", opacity: 0.6 }} />

        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: AMBER_MID, letterSpacing: "0.7px", marginBottom: 8 }}>何があった？</div>
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder="感動したこと・起こしたアクションを書いてね" rows={4}
            style={{ width: "100%", border: "1px solid #ecdca0", borderRadius: 12, padding: "10px 12px",
              fontSize: 13, color: "#3a2000", background: "#fff", resize: "none", fontFamily: "inherit", lineHeight: 1.65, outline: "none" }} />
          <div style={{ fontSize: 10, color: "#c0a860", textAlign: "right", marginTop: 4 }}>{body.length} / 200</div>
        </div>

        <div style={{ height: 1, background: "#f0e0a0", opacity: 0.6 }} />

        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: AMBER_MID, letterSpacing: "0.7px", marginBottom: 8 }}>チームに共有する？</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fff", borderRadius: 12, padding: "11px 14px", border: "1px solid #ecdca0" }}>
            <span style={{ fontSize: 13, color: "#3a2000" }}>👥 チームに公開する</span>
            <div onClick={() => setShared(!shared)}
              style={{ width: 40, height: 24, borderRadius: 99, background: shared ? AMBER : "#e0d0b0", position: "relative", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3, right: shared ? 3 : "auto", left: shared ? "auto" : 3 }} />
            </div>
          </div>
        </div>

        {/* わんたろうと深掘りボタン */}
        <button
          onClick={() => { if (body.trim()) setStep("chat"); }}
          disabled={!body.trim()}
          style={{
            background: body.trim() ? AMBER : "#f0e0a0",
            border: "none", borderRadius: 16, padding: "16px",
            display: "flex", alignItems: "center", gap: 12,
            cursor: body.trim() ? "pointer" : "not-allowed",
            fontFamily: "inherit", width: "100%",
          }}>
          <WantaroSVG size={40} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: AMBER_DARK, marginBottom: 3 }}>
              わんたろうと深掘りする 🐾
            </div>
            <div style={{ fontSize: 11, color: body.trim() ? "#8a6010" : "#c0a060" }}>
              {body.trim() ? "AIが「なぜ？」を3回聞いてくれるワン！" : "まず「何があった？」を入力してね"}
            </div>
          </div>
          <span style={{ fontSize: 22, color: AMBER_DARK }}>›</span>
        </button>

      </div>
    </div>
  );
}

export default function NazeLog() {
  const [activeTab, setActiveTab] = useState("map");
  const [showPost, setShowPost] = useState(false);

  function handlePosted() {
    setShowPost(false);
    setActiveTab("team");
  }

  if (showPost) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0", minHeight: 640 }}>
        <div style={{ width: 360, height: 740, background: "#fffcf5", borderRadius: 36, overflow: "hidden", border: "0.5px solid #e8d8a0", display: "flex", flexDirection: "column" }}>
          <PostScreen onBack={() => setShowPost(false)} onPosted={handlePosted} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 0", minHeight: 640 }}>
      <div style={{ width: 360, height: 740, background: "#fffcf5", borderRadius: 36, overflow: "hidden", border: "0.5px solid #e8d8a0", display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)" }}>
        <TopBar title="なぜログ"
          right={<div style={{ display: "flex", gap: 14, fontSize: 20 }}>
            <span style={{ cursor: "pointer" }}>🔔</span>
            <span style={{ cursor: "pointer" }}>👤</span>
          </div>} />
        {activeTab === "map"  && <MapScreen onPost={() => setShowPost(true)} />}
        {activeTab === "team" && <TeamFeed />}
        {activeTab === "log"  && <LogScreen />}
        {activeTab === "wan"  && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#c0a060" }}>
            <WantaroSVG size={80} />
            <span style={{ fontSize: 14 }}>わんたろう画面（準備中）</span>
          </div>
        )}
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}
