import { supabase } from './supabase'
import { useState, useEffect } from "react";

const AMBER = "#f5c842";
const AMBER_DARK = "#3a2000";
const AMBER_MID = "#c8860a";

const typeColors = {
  kando:  { bg: "#fff8e0", border: AMBER,      dot: AMBER,      text: AMBER_MID  },
  action: { bg: "#EEEDFE", border: "#7F77DD",  dot: "#7F77DD",  text: "#534AB7"  },
  kizuki: { bg: "#E1F5EE", border: "#1D9E75",  dot: "#1D9E75",  text: "#0F6E56"  },
  gimon:  { bg: "#FAECE7", border: "#D85A30",  dot: "#D85A30",  text: "#993C1D"  },
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
      {onBack && (
        <button onClick={onBack} style={{ color: AMBER_DARK, fontSize: 20, background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}>←</button>
      )}
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
          <span style={{ fontSize: 22 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function NazeChain({ naze }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {naze.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 9, marginBottom: i < naze.length - 1 ? 8 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%",
              background: i === naze.length - 1 ? AMBER_DARK : AMBER,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 500, color: i === naze.length - 1 ? AMBER : AMBER_DARK }}>
              {i + 1}
            </div>
            {i < naze.length - 1 && (
              <div style={{ width: 1.5, flex: 1, background: AMBER, opacity: 0.35, margin: "3px 0" }} />
            )}
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

function PostCard({ post, onExpand, expanded }) {
  const c = typeColors[post.type] || typeColors.kando;
  const emoji = typeEmoji[post.type] || "🤩";
  const label = typeLabel[post.type] || "感動";
  const naze = [post.naze1, post.naze2, post.naze3].filter(Boolean);
  const initial = post.user ? post.user[0] : "？";

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
            <div style={{ fontSize: 13, fontWeight: 500, color: "#3a2000" }}>{post.user || "匿名"}</div>
            <div style={{ fontSize: 10, color: "#a09070" }}>{new Date(post.created_at).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
          </div>
          <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 99,
            padding: "3px 9px", fontSize: 11, color: c.text, fontWeight: 500 }}>
            {emoji} {label}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#3a2000", lineHeight: 1.65, marginBottom: 10 }}>{post.body}</div>

        {naze.length > 0 && (
          !expanded ? (
            <div onClick={() => onExpand(post.id)}
              style={{ background: "#fffbf0", border: "1px solid #f0e0a0", borderRadius: 10,
                padding: "8px 11px", cursor: "pointer", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <WantaroSVG size={20} />
                <span style={{ fontSize: 11, color: AMBER_MID, fontWeight: 500 }}>わんたろうと深掘り（なぜ×{naze.length}）</span>
                <span style={{ fontSize: 10, color: "#c0a060", marginLeft: "auto" }}>タップで開く ▾</span>
              </div>
              <div style={{ fontSize: 12, color: "#8a6010", lineHeight: 1.5 }}>
                🔑 {naze[naze.length - 1]}
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <WantaroSVG size={22} />
                <span style={{ fontSize: 11, color: AMBER_MID, fontWeight: 500 }}>わんたろうと深掘り</span>
                <button onClick={() => onExpand(null)}
                  style={{ fontSize: 10, color: "#c0a060", marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  閉じる ▴
                </button>
              </div>
              <NazeChain naze={naze} />
            </div>
          )
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 14px 12px", borderTop: "0.5px solid #f5ead0" }}>
        <button style={{ fontSize: 12, color: "#a09070", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", marginRight: 16 }}>❤️ いいね</button>
        <button style={{ fontSize: 12, color: "#a09070", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>💬 コメント</button>
        <button style={{ marginLeft: "auto", fontSize: 12, color: AMBER_MID, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>🐾 さらに深掘り</button>
      </div>
    </div>
  );
}

function TeamFeed() {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  const filters = [
    { id: "all",    label: "すべて" },
    { id: "kando",  label: "🤩 感動" },
    { id: "action", label: "🎯 行動" },
    { id: "kizuki", label: "💡 気づき" },
    { id: "gimon",  label: "❓ 疑問" },
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

      <div style={{ margin: "10px 14px 2px", background: "#fffbf0", border: "1px solid #f0e0a0",
        borderRadius: 14, padding: "9px 12px", display: "flex", gap: 9, alignItems: "center", flexShrink: 0 }}>
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
        ) : (
          filtered.map(post => (
            <PostCard key={post.id} post={post}
              expanded={expanded === post.id}
              onExpand={(id) => setExpanded(expanded === id ? null : id)} />
          ))
        )}
      </div>
    </div>
  );
}

function MapScreen({ onPost }) {
  const [selectedPin, setSelectedPin] = useState(null);
  const [pins, setPins] = useState([]);

  useEffect(() => {
    async function fetchPins() {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(10);
      if (data) setPins(data);
    }
    fetchPins();
  }, []);

  const pinPositions = [
    { x: 22, y: 28 }, { x: 55, y: 50 }, { x: 35, y: 68 },
    { x: 70, y: 35 }, { x: 48, y: 20 }, { x: 15, y: 55 },
  ];

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "#d8e8f2" }}>
        {[30, 55, 75].map(t => <div key={t} style={{ position: "absolute", top: `${t}%`, left: 0, right: 0, height: 3, background: "#fff", opacity: 0.5 }} />)}
        {[30, 55, 72].map(l => <div key={l} style={{ position: "absolute", left: `${l}%`, top: 0, bottom: 0, width: 3, background: "#fff", opacity: 0.5 }} />)}
        {[
          { w: 70, h: 44, t: 5, l: 3 }, { w: 52, h: 60, t: 4, l: 35 }, { w: 44, h: 38, t: 4, l: 60 },
          { w: 58, h: 36, t: 60, l: 2 }, { w: 40, h: 52, t: 58, l: 35 }, { w: 50, h: 40, t: 60, l: 60 },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", top: `${b.t}%`, left: `${b.l}%`, width: b.w, height: b.h, background: "#bcd0e0", borderRadius: 5 }} />
        ))}
      </div>

      {pins.map((pin, i) => {
        const pos = pinPositions[i % pinPositions.length];
        const c = typeColors[pin.type] || typeColors.kando;
        const emoji = typeEmoji[pin.type] || "🤩";
        const label = typeLabel[pin.type] || "感動";
        return (
          <div key={pin.id} onClick={() => setSelectedPin(pin)}
            style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`,
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: "pointer", transform: "translateX(-50%)", zIndex: 5 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.dot,
              border: "3px solid #fff", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 17, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              {emoji}
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: "2px 8px", fontSize: 10,
              fontWeight: 500, color: AMBER_DARK, marginTop: 3, border: "0.5px solid #e8d080", whiteSpace: "nowrap" }}>
              {label}
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", bottom: 70, left: 12, right: 60, background: "#fffcf5",
        borderRadius: 18, padding: "10px 12px", border: "1px solid #f0d890", display: "flex", gap: 10, alignItems: "center" }}>
        <WantaroSVG size={38} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: AMBER_MID, fontWeight: 500, marginBottom: 2 }}>わんたろう</div>
          <div style={{ fontSize: 12, color: AMBER_DARK }}>どうしてそう思ったの？教えてワン🐾</div>
        </div>
      </div>

      <button onClick={onPost}
        style={{ position: "absolute", bottom: 14, right: 14, width: 48, height: 48,
          borderRadius: "50%", background: AMBER, border: "3px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, cursor: "pointer", zIndex: 6 }}>＋</button>

      {selectedPin && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(58,32,0,0.3)",
          display: "flex", alignItems: "flex-end", zIndex: 20 }}
          onClick={() => setSelectedPin(null)}>
          <div style={{ background: "#fffcf5", borderRadius: "24px 24px 0 0", width: "100%",
            padding: "18px 16px 28px", maxHeight: "78%", overflowY: "auto" }}
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
  const [type, setType] = useState("kando");
  const [user, setUser] = useState("");
  const [body, setBody] = useState("");
  const [naze, setNaze] = useState(["", "", ""]);
  const [shared, setShared] = useState(true);
  const [posting, setPosting] = useState(false);

  const types = [
    { id: "kando",  emoji: "🤩", label: "感動した" },
    { id: "action", emoji: "🎯", label: "行動した" },
    { id: "kizuki", emoji: "💡", label: "気づいた" },
    { id: "gimon",  emoji: "❓", label: "疑問に思った" },
  ];
  const nazeQs = [
    "なぜそう感じたの？",
    "じゃあ、なぜそれが大事なの？",
    "本当は何を大切にしてるの？",
  ];

  async function handlePost() {
    if (!body.trim()) return;
    setPosting(true);
    await supabase.from('posts').insert([{
      type,
      username: user || "匿名",
      body,
      naze1: naze[0],
      naze2: naze[1],
      naze3: naze[2],
      shared,
    }]);
    setPosting(false);
    onPosted();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="新しい記録" onBack={onBack}
        right={
          <button onClick={handlePost} disabled={posting}
            style={{ background: AMBER_DARK, color: AMBER, fontSize: 12, fontWeight: 500,
              border: "none", borderRadius: 99, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit",
              opacity: posting ? 0.6 : 1 }}>
            {posting ? "投稿中…" : "投稿する"}
          </button>
        } />

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 18, background: "#fffcf5" }}>

        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: AMBER_MID, letterSpacing: "0.7px", marginBottom: 8 }}>あなたの名前</div>
          <input value={user} onChange={e => setUser(e.target.value)} placeholder="名前を入力（省略可）"
            style={{ width: "100%", border: "1px solid #ecdca0", borderRadius: 12, padding: "10px 12px",
              fontSize: 13, color: "#3a2000", background: "#fff", fontFamily: "inherit", outline: "none" }} />
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
            placeholder="感動したこと・起こしたアクションを書いてね" rows={3}
            style={{ width: "100%", border: "1px solid #ecdca0", borderRadius: 12, padding: "10px 12px",
              fontSize: 13, color: "#3a2000", background: "#fff", resize: "none", fontFamily: "inherit", lineHeight: 1.65, outline: "none" }} />
          <div style={{ fontSize: 10, color: "#c0a860", textAlign: "right", marginTop: 4 }}>{body.length} / 200</div>
        </div>

        <div style={{ height: 1, background: "#f0e0a0", opacity: 0.6 }} />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <WantaroSVG size={32} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: AMBER_DARK }}>わんたろうと深掘り</div>
              <div style={{ fontSize: 11, color: AMBER_MID }}>「なぜ？」を3回くり返して本質へ</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {nazeQs.map((q, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%",
                    background: i === 2 ? AMBER_DARK : AMBER,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 500, color: i === 2 ? AMBER : AMBER_DARK }}>{i + 1}</div>
                  {i < 2 && <div style={{ width: 1.5, flex: 1, background: AMBER, opacity: 0.4, margin: "3px 0" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: i === 2 ? AMBER_DARK : "#8a6010", marginBottom: 6 }}>
                    {i === 2 ? "🔑 " : ""}{q}
                  </div>
                  <textarea value={naze[i]} onChange={e => { const n = [...naze]; n[i] = e.target.value; setNaze(n); }}
                    placeholder={i === 2 ? "ここまで来たら価値観が見えてくるはず…" : "「〇〇だから」という形で書いてみよう"}
                    rows={2}
                    style={{ width: "100%", border: `1px solid ${naze[i] ? (i === 2 ? AMBER_DARK : AMBER) : "#ecdca0"}`,
                      borderRadius: 10, padding: "8px 11px", fontSize: 12, color: "#3a2000",
                      background: naze[i] ? (i === 2 ? "#fff8e0" : "#fffbf0") : "#fff",
                      resize: "none", fontFamily: "inherit", lineHeight: 1.6, outline: "none" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "#f0e0a0", opacity: 0.6 }} />

        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: AMBER_MID, letterSpacing: "0.7px", marginBottom: 8 }}>チームに共有する？</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fff", borderRadius: 12, padding: "11px 14px", border: "1px solid #ecdca0" }}>
            <span style={{ fontSize: 13, color: "#3a2000" }}>👥 チームに公開する</span>
            <div onClick={() => setShared(!shared)}
              style={{ width: 40, height: 24, borderRadius: 99, background: shared ? AMBER : "#e0d0b0",
                position: "relative", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3, right: shared ? 3 : "auto", left: shared ? "auto" : 3 }} />
            </div>
          </div>
        </div>
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
        {activeTab === "log"  && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#c0a060" }}>
            <span style={{ fontSize: 40 }}>📋</span>
            <span style={{ fontSize: 14 }}>ログ画面（準備中）</span>
          </div>
        )}
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
