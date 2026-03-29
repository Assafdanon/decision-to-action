"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const STAGES = [
  { id:"goal",num:1,title:"מטרה ברורה",icon:"🎯",question:"יש לך מטרה ברורה ומדידה למה שאתה רוצה לעשות?",
    deepQuestions:["אתה יכול לתאר את התוצאה במשפט אחד?","יש מדד הצלחה מספרי?","מנוסחת כ'לעשות' ולא כ'לא לעשות'?","מטרת למידה או ביצוע?"],
    diagnosis:{blocked:"המטרה לא ברורה מספיק - המוח לא יכול לחבר כוונה לפעולה",
      science:"Locke & Latham: מטרות ספציפיות מעלות ביצוע ב-42-80%. Oettingen: פנטזיות חיוביות בלי עיגון מורידות אנרגיה.",
      signs:["עסוק אבל לא מתקדם","לא יודע מה הצעד הבא","לולאת מחשבות"],
      actions:[
        {text:"כתוב במשפט אחד: מה בדיוק אני רוצה להשיג?",effort:"30 שניות",placeholder:"המטרה שלי היא..."},
        {text:"הוסף מספר: כמה? עד מתי? איך אמדוד?",effort:"2 דקות",placeholder:"כמות: ___ | דדליין: ___ | מדד: ___"},
        {text:"בדוק ניסוח: 'לעשות X' ולא 'להפסיק Y'?",effort:"1 דקה",placeholder:"ניסוח גישה: אני אעשה..."},
        {text:"WOOP: תוצאה → מכשול פנימי → תוכנית",effort:"5 דקות",placeholder:"תוצאה: ___\nמכשול: ___\nתוכנית: ___"}
      ]}},
  { id:"plan",num:2,title:"תסריט אם-אז",icon:"📋",question:"יש לך תסריט: 'אם ___ קורה, אז אעשה ___'?",
    deepQuestions:["כולל זמן, מקום, פעולה?","תסריט אחד (לא 6)?","תסריט החלפה?","ניסחת בעצמך?"],
    diagnosis:{blocked:"אין גשר כוונה→פעולה - המוח מחשב מחדש כל פעם",
      science:"Gollwitzer: אם-אז מכפיל ביצוע פי 2-3. Dalton: מעל 3 תסריטים פוגע. החלפה (d=0.51) > דיכוי (d=0.29).",
      signs:["יודע מה לעשות אבל לא מתחיל","מחליט מחדש כל פעם","תוכניות לא נדבקות"],
      actions:[
        {text:"כתוב: 'אם [מצב], אז [פעולה]'",effort:"1 דקה",placeholder:"אם ___, אז ___"},
        {text:"הפוך להחלפה: 'במקום X אעשה Y'",effort:"1 דקה",placeholder:"במקום ___, אעשה ___"},
        {text:"בדוק: ה-IF קורה באופן צפוי?",effort:"2 דקות",placeholder:"זה קורה כש..."},
        {text:"הגבל ל-1-3 תסריטים:",effort:"3 דקות",placeholder:"1. אם ___ אז ___\n2. אם ___ אז ___\n3. אם ___ אז ___"}
      ]}},
  { id:"landmark",num:3,title:"תאריך-אפס",icon:"🗓️",question:"קבעת תאריך משמעותי להתחלה?",
    deepQuestions:["התאריך מסמן התחלה חדשה?","יש דדליין חיצוני?","דוחה כי 'יום ראשון מתאים יותר'?"],
    diagnosis:{blocked:"בלי ציון דרך אין דחיפות ואין ניתוק מכשלונות",
      science:"Milkman: Fresh Start +8%. Ariely: דדליינים חיצוניים עדיפים. Koo: ציפייה ל-landmark מורידה מאמץ לפני.",
      signs:["תמיד 'אתחיל ביום ראשון'","ממתין ל'רגע מושלם'","תלוי באוויר"],
      actions:[
        {text:"תאריך שמרגיש כפרק חדש:",effort:"1 דקה",placeholder:"אני מתחיל ב: ___"},
        {text:"דדליין חיצוני: למי? מתי?",effort:"3 דקות",placeholder:"אספר ל: ___ | עד: ___"},
        {text:"מה תעשה עכשיו במקום לחכות?",effort:"מיידי",placeholder:"עכשיו אני: ___"},
        {text:"Milestones שבועיים:",effort:"5 דקות",placeholder:"שבוע 1: ___\nשבוע 2: ___"}
      ]}},
  { id:"wm",num:4,title:"עומס קוגניטיבי",icon:"🧠",question:"הראש פנוי? או עומס ולולאות פתוחות?",
    deepQuestions:["כמה משימות פתוחות (מעל 4 = בעיה)?","הכל כתוב במקום אחד?","קפצת בין משימות?","משהו מטריד ברקע?"],
    diagnosis:{blocked:"זיכרון עבודה מלא - אין מקום לבצע",
      science:"Cowan: ~4 פריטים, לא 7. Leroy: שארית קשב 23 דקות. Masicampo: תוכנית כתובה מבטלת הפרעה קוגניטיבית.",
      signs:["הכל דחוף","קופץ בין משימות","שוכח דברים","קשה להתרכז"],
      actions:[
        {text:"Brain dump - כתוב הכל מהראש:",effort:"5 דקות",placeholder:"1.\n2.\n3.\n4.\n5.\n..."},
        {text:"בחר 1-3 ליום:",effort:"2 דקות",placeholder:"היום:\n1.\n2.\n3."},
        {text:"לכל משימה: מתי + צעד הבא:",effort:"5 דקות",placeholder:"משימה: ___ | מתי: ___ | צעד: ___"},
        {text:"סגור הכל. 25 דקות פוקוס:",effort:"1 דקה",placeholder:"פוקוס על: ___"}
      ]}},
  { id:"feedback",num:5,title:"משוב מיידי",icon:"🔔",question:"יש דרך לדעת אם אתה על המסלול?",
    deepQuestions:["מדד יומי/שבועי?","משוב על תהליך או תוצאה?","מתעד פיזית?","מזהה טעויות בזמן אמת?"],
    diagnosis:{blocked:"בלי משוב אין תיקון - ומשוב לא נכון מזיק",
      science:"Kluger & DeNisi: 38% מהמשוב מוריד ביצוע. תהליך > זהות. Harkin: מעקב פיזי d=0.40.",
      signs:["לא יודע אם מתקדם","בודק תוצאות ומרגיש רע","אין review"],
      actions:[
        {text:"מדד תהליך אחד (לא תוצאה):",effort:"2 דקות",placeholder:"עוקב אחרי: ___"},
        {text:"Review שבועי:",effort:"15 דק/שבוע",placeholder:"עבד: ___\nלשנות: ___"},
        {text:"Accountability partner:",effort:"5 דקות",placeholder:"אדווח ל: ___ | כל: ___"},
        {text:"אחרי טעות: מה בתהליך לשנות?",effort:"מיידי",placeholder:"טעות: ___\nשינוי: ___"}
      ]}},
  { id:"energy",num:6,title:"אנרגיה ומוטיבציה",icon:"⚡",question:"יש אנרגיה ורצון? או מותש?",
    deepQuestions:["'חייב' או 'רוצה'?","'כוח הרצון נגמר'?","הנאה בתהליך?","מתי הפסקה אחרונה?"],
    diagnosis:{blocked:"לא חוסר כוח רצון - חוסר סיבה טובה או הנאה בתהליך",
      science:"Hagger 2016: ego depletion d=0.04. Job & Dweck: אמונה שכוח רצון מוגבל יוצרת הגבלה. Milkman: temptation bundling +51%.",
      signs:["שרוף","דוחה משימות","אין כוח","נופל אחרי כשלון"],
      actions:[
        {text:"למה באמת רוצה? (לא חייב)",effort:"2 דקות",placeholder:"אני רוצה כי..."},
        {text:"Temptation bundling: הנאה+משימה:",effort:"1 דקה",placeholder:"בזמן העבודה גם: ___"},
        {text:"אחרי כשלון: מה למדתי?",effort:"מיידי",placeholder:"קרה: ___\nלמדתי: ___"},
        {text:"בלוק הבא: כמה דקות?",effort:"מיידי",placeholder:"___ דקות, הפסקה ___ דקות"}
      ]}},
  { id:"commitment",num:7,title:"התחייבות חיצונית",icon:"🤝",question:"יש התחייבות חיצונית שתחזיק?",
    deepQuestions:["סיפרת למישהו?","על פעולה (לא זהות)?","מחיר אמיתי?","נמנע מהתחייבות?"],
    diagnosis:{blocked:"בלי מנגנון חיצוני קל לוותר",
      science:"Giné: חוזים כספיים x3-5, אבל 11% מאמצים. Gollwitzer: שיתוף שאיפות זהותיות מוריד מאמץ. שתף פעולות.",
      signs:["מוותר בקלות","רק אתה יודע","אין השלכות","לבד"],
      actions:[
        {text:"למי הודעה עכשיו?",effort:"2 דקות",placeholder:"ל: ___\nהודעה: ___"},
        {text:"פעולה ספציפית (לא שאיפה):",effort:"1 דקה",placeholder:"אשלח ___ עד ___"},
        {text:"Stake: מחיר אם לא עמדת?",effort:"3 דקות",placeholder:"אם לא: ___"},
        {text:"Check-in שבועי:",effort:"5 דקות",placeholder:"עם: ___ | כל: ___ | על: ___"}
      ]}},
  { id:"action",num:8,title:"הפעל עכשיו",icon:"🚀",question:"מוכן - אבל משהו עוצר ברגע האחרון?",
    deepQuestions:["פחות מ-2 דקות?","סביבה מוכנה?","חיכוך קטן?","מחכה ל'מצב רוח'?"],
    diagnosis:{blocked:"החיכוך האחרון - הכי קל לברוח",
      science:"Webb & Sheeran: מחצית המוטיבציה נאבדת כוונה→פעולה. Madrian: defaults 49%→86%. Fogg: הקטן עד שלא צריך מוטיבציה.",
      signs:["מוכן אבל לא מתחיל","מחכה למצב רוח","עושה משהו אחר לפני","שיתוק"],
      actions:[
        {text:"הפעולה הקטנה ביותר (<2 דקות):",effort:"מיידי",placeholder:"הצעד: ___"},
        {text:"פתח/הכן עכשיו:",effort:"30 שניות",placeholder:"פתחתי: ___"},
        {text:"3-2-1 → התחל. מה עשית?",effort:"3 שניות",placeholder:"עשיתי: ___"},
        {text:"אחרי 2 דקות - ממשיך?",effort:"2 דקות",placeholder:"ממשיך עם: ___"}
      ]}}
];

function ActionItem({ action, index, checked, onToggle, userText, onTextChange }) {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef(null);
  useEffect(() => { if (expanded && textRef.current) textRef.current.focus(); }, [expanded]);
  const handleText = (e) => { onTextChange(index, e.target.value); e.target.style.height="auto"; e.target.style.height=e.target.scrollHeight+"px"; };
  return (
    <div style={{marginBottom:"8px",borderRadius:"12px",border:checked?"2px solid #86efac":expanded?"2px solid #a5b4fc":"2px solid #e2e8f0",background:checked?"#f0fdf4":expanded?"#eef2ff":"#fafafa",overflow:"hidden",transition:"all 0.2s"}}>
      <div onClick={()=>{if(checked){onToggle(index);setExpanded(true);}else setExpanded(!expanded);}} style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"12px 14px",cursor:"pointer"}}>
        <span style={{fontSize:"20px",flexShrink:0,marginTop:"1px"}}>{checked?"✅":expanded?"✏️":"⬜"}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:"14px",color:checked?"#166534":"#1e293b",lineHeight:1.5,fontWeight:expanded?"600":"400"}}>{action.text}</div>
          <div style={{fontSize:"12px",color:"#94a3b8",marginTop:"2px"}}>⏱ {action.effort}</div>
        </div>
        {!checked&&<span style={{fontSize:"14px",color:"#94a3b8",flexShrink:0}}>{expanded?"▲":"▼"}</span>}
      </div>
      {expanded&&!checked&&(
        <div style={{padding:"0 14px 14px 14px"}}>
          <textarea ref={textRef} value={userText||""} onChange={handleText} placeholder={action.placeholder} style={{width:"100%",minHeight:"60px",padding:"10px 12px",borderRadius:"8px",border:"1px solid #c7d2fe",background:"#fff",fontSize:"14px",fontFamily:"inherit",direction:"rtl",resize:"none",outline:"none",lineHeight:1.6,color:"#1e293b",boxSizing:"border-box"}}/>
          <div style={{display:"flex",gap:"8px",marginTop:"8px"}}>
            <button onClick={(e)=>{e.stopPropagation();if(userText?.trim()){onToggle(index);setExpanded(false);}}} disabled={!userText?.trim()} style={{flex:1,padding:"8px",borderRadius:"8px",border:"none",background:userText?.trim()?"#22c55e":"#e2e8f0",color:userText?.trim()?"#fff":"#94a3b8",fontSize:"13px",fontWeight:"600",cursor:userText?.trim()?"pointer":"default"}}>✓ סיימתי</button>
            <button onClick={(e)=>{e.stopPropagation();setExpanded(false);}} style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",color:"#94a3b8",fontSize:"13px",cursor:"pointer"}}>אח״כ</button>
          </div>
        </div>
      )}
      {checked&&userText&&(<div style={{padding:"0 14px 12px 14px"}}><div style={{background:"#dcfce7",borderRadius:"8px",padding:"8px 10px",fontSize:"13px",color:"#166534",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{userText}</div></div>)}
    </div>
  );
}

function QuickScan({ onResult }) {
  const [feelings, setFeelings] = useState([]);
  const options = [
    {id:"unclear",text:"לא ברור לי מה בדיוק אני רוצה להשיג",stage:"goal"},
    {id:"noplan",text:"יודע מה רוצה אבל לא מתחיל",stage:"plan"},
    {id:"postpone",text:"דוחה - 'אתחיל מחר'",stage:"landmark"},
    {id:"overwhelm",text:"יותר מדי דברים בראש",stage:"wm"},
    {id:"lost",text:"לא יודע אם מתקדם",stage:"feedback"},
    {id:"tired",text:"אין לי כוח/מוטיבציה",stage:"energy"},
    {id:"alone",text:"לבד בזה",stage:"commitment"},
    {id:"frozen",text:"הכל מוכן אבל לא מתחיל",stage:"action"}
  ];
  const toggle=(id)=>setFeelings(p=>p.includes(id)?p.filter(f=>f!==id):[...p,id]);
  const diagnose=()=>{if(!feelings.length)return;const first=options.find(o=>feelings.includes(o.id));onResult(first.stage,feelings.map(f=>options.find(o=>o.id===f).stage));};
  return (
    <div>
      <p style={{fontSize:"15px",color:"#64748b",marginBottom:"16px",lineHeight:1.6}}>סמן מה מרגיש נכון עכשיו:</p>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {options.map(opt=>(
          <button key={opt.id} onClick={()=>toggle(opt.id)} style={{padding:"12px 16px",borderRadius:"10px",border:feelings.includes(opt.id)?"2px solid #6366f1":"2px solid #e2e8f0",background:feelings.includes(opt.id)?"#eef2ff":"#fff",cursor:"pointer",textAlign:"right",fontSize:"14px",direction:"rtl",transition:"all 0.15s",color:feelings.includes(opt.id)?"#4338ca":"#334155",fontWeight:feelings.includes(opt.id)?"600":"400"}}>{opt.text}</button>
        ))}
      </div>
      {feelings.length>0&&(<button onClick={diagnose} style={{marginTop:"16px",width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:"16px",fontWeight:"700",cursor:"pointer",boxShadow:"0 4px 14px rgba(99,102,241,0.3)"}}>אבחן ← ({feelings.length})</button>)}
    </div>
  );
}

function StageView({ stageId, allStages, onBack, onGoDeep, onSave }) {
  const stage=STAGES.find(s=>s.id===stageId);
  const [showDeep,setShowDeep]=useState(false);
  const [showScience,setShowScience]=useState(false);
  const [checkedActions,setCheckedActions]=useState([]);
  const [userTexts,setUserTexts]=useState({});
  const toggleAction=(i)=>{
    const next=checkedActions.includes(i)?checkedActions.filter(x=>x!==i):[...checkedActions,i];
    setCheckedActions(next);
    if(!checkedActions.includes(i)&&userTexts[i]?.trim()){
      onSave({stage:stageId,actionIndex:i,text:userTexts[i],actionText:stage.diagnosis.actions[i].text});
    }
  };
  const handleTextChange=(i,text)=>setUserTexts(p=>({...p,[i]:text}));
  const otherStages=allStages?allStages.filter(s=>s!==stageId):[];
  return (
    <div style={{direction:"rtl"}}>
      <div style={{background:"linear-gradient(135deg,#eef2ff,#faf5ff)",borderRadius:"16px",padding:"20px",marginBottom:"16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:"32px",marginBottom:"8px"}}>{stage.icon}</div>
            <h2 style={{margin:"0 0 4px 0",fontSize:"20px",color:"#312e81"}}>שלב {stage.num}: {stage.title}</h2>
          </div>
          {checkedActions.length>0&&(<div style={{background:"#22c55e",color:"#fff",borderRadius:"20px",padding:"4px 12px",fontSize:"13px",fontWeight:"700"}}>{checkedActions.length}/{stage.diagnosis.actions.length}</div>)}
        </div>
        <p style={{margin:0,fontSize:"14px",color:"#6366f1",fontWeight:"600",lineHeight:1.5}}>{stage.diagnosis.blocked}</p>
      </div>
      <div style={{marginBottom:"16px"}}>
        <h3 style={{fontSize:"15px",color:"#1e293b",marginBottom:"8px"}}>🔍 סימנים:</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{stage.diagnosis.signs.map((s,i)=>(<span key={i} style={{background:"#fef3c7",color:"#92400e",padding:"4px 10px",borderRadius:"20px",fontSize:"13px"}}>{s}</span>))}</div>
      </div>
      <div style={{marginBottom:"16px"}}>
        <h3 style={{fontSize:"15px",color:"#1e293b",marginBottom:"10px"}}>⚡ לחץ לפתוח ולרשום:</h3>
        {stage.diagnosis.actions.map((a,i)=>(<ActionItem key={i} action={a} index={i} checked={checkedActions.includes(i)} onToggle={toggleAction} userText={userTexts[i]} onTextChange={handleTextChange}/>))}
      </div>
      {showDeep&&(<div style={{background:"#f1f5f9",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}><h3 style={{fontSize:"14px",color:"#475569",margin:"0 0 8px 0"}}>🔬 שאלות מעמיקות:</h3>{stage.deepQuestions.map((q,i)=>(<div key={i} style={{padding:"6px 0",fontSize:"13px",color:"#334155",borderBottom:i<stage.deepQuestions.length-1?"1px solid #e2e8f0":"none",lineHeight:1.5}}>{i+1}. {q}</div>))}</div>)}
      {showScience&&(<div style={{background:"#fffbeb",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}><h3 style={{fontSize:"14px",color:"#92400e",margin:"0 0 6px 0"}}>📊 מדע:</h3><p style={{fontSize:"13px",color:"#78350f",margin:0,lineHeight:1.6}}>{stage.diagnosis.science}</p></div>)}
      <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
        <button onClick={()=>setShowDeep(!showDeep)} style={{flex:1,padding:"10px",borderRadius:"8px",border:"1px solid #cbd5e1",background:showDeep?"#e2e8f0":"#fff",cursor:"pointer",fontSize:"13px",color:"#475569"}}>{showDeep?"הסתר":"🔬 מעמיק"}</button>
        <button onClick={()=>setShowScience(!showScience)} style={{flex:1,padding:"10px",borderRadius:"8px",border:"1px solid #cbd5e1",background:showScience?"#e2e8f0":"#fff",cursor:"pointer",fontSize:"13px",color:"#475569"}}>{showScience?"הסתר":"📊 מדע"}</button>
      </div>
      {otherStages.length>0&&(<div style={{background:"#f8fafc",borderRadius:"12px",padding:"12px",marginBottom:"12px"}}><p style={{fontSize:"13px",color:"#64748b",margin:"0 0 8px 0"}}>חסמים נוספים:</p><div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{otherStages.map(sid=>{const s=STAGES.find(st=>st.id===sid);return(<button key={sid} onClick={()=>onGoDeep(sid)} style={{padding:"6px 12px",borderRadius:"20px",border:"1px solid #c7d2fe",background:"#eef2ff",cursor:"pointer",fontSize:"13px",color:"#4338ca"}}>{s.icon} {s.title}</button>);})}</div></div>)}
      <button onClick={onBack} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:"14px",color:"#64748b"}}>← סריקה חדשה</button>
    </div>
  );
}

function WalkThrough({ onResult }) {
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const answer=(val)=>{const stage=STAGES[current];const na={...answers,[stage.id]:val};setAnswers(na);if(val==="no")onResult(stage.id,Object.keys(na).filter(k=>na[k]==="no"));else if(current<STAGES.length-1)setCurrent(current+1);else onResult("action",[]);};
  const stage=STAGES[current];
  return (
    <div style={{direction:"rtl"}}>
      <div style={{height:"4px",background:"#e2e8f0",borderRadius:"2px",marginBottom:"16px",overflow:"hidden"}}><div style={{height:"100%",width:`${((current+1)/STAGES.length)*100}%`,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:"2px",transition:"width 0.3s"}}/></div>
      <div style={{textAlign:"center",marginBottom:"20px"}}>
        <div style={{fontSize:"48px",marginBottom:"8px"}}>{stage.icon}</div>
        <div style={{fontSize:"13px",color:"#94a3b8",marginBottom:"4px"}}>שלב {stage.num} מתוך 8</div>
        <h2 style={{margin:"0 0 4px 0",fontSize:"18px",color:"#1e293b"}}>{stage.title}</h2>
      </div>
      <div style={{background:"#f8fafc",borderRadius:"14px",padding:"20px",marginBottom:"20px",textAlign:"center"}}><p style={{margin:0,fontSize:"16px",color:"#334155",lineHeight:1.6}}>{stage.question}</p></div>
      <div style={{display:"flex",gap:"10px"}}>
        <button onClick={()=>answer("yes")} style={{flex:1,padding:"14px",borderRadius:"12px",border:"2px solid #86efac",background:"#f0fdf4",cursor:"pointer",fontSize:"16px",fontWeight:"700",color:"#166534"}}>✓ כן</button>
        <button onClick={()=>answer("partial")} style={{flex:1,padding:"14px",borderRadius:"12px",border:"2px solid #fcd34d",background:"#fffbeb",cursor:"pointer",fontSize:"16px",fontWeight:"700",color:"#92400e"}}>~ חלקית</button>
        <button onClick={()=>answer("no")} style={{flex:1,padding:"14px",borderRadius:"12px",border:"2px solid #fca5a5",background:"#fef2f2",cursor:"pointer",fontSize:"16px",fontWeight:"700",color:"#991b1b"}}>✗ לא</button>
      </div>
    </div>
  );
}

function History({ entries, onClose }) {
  if(!entries.length) return (
    <div style={{textAlign:"center",padding:"40px 20px",color:"#94a3b8"}}>
      <div style={{fontSize:"32px",marginBottom:"8px"}}>📭</div>
      <p>אין רשומות עדיין</p>
      <button onClick={onClose} style={{marginTop:"12px",padding:"10px 20px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:"14px",color:"#64748b"}}>← חזרה</button>
    </div>
  );
  const grouped={};
  entries.forEach(e=>{const d=new Date(e.createdAt).toLocaleDateString("he-IL");if(!grouped[d])grouped[d]=[];grouped[d].push(e);});
  return (
    <div style={{direction:"rtl"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
        <h2 style={{margin:0,fontSize:"18px",color:"#1e293b"}}>📊 היסטוריה</h2>
        <button onClick={onClose} style={{padding:"6px 14px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:"13px",color:"#64748b"}}>← חזרה</button>
      </div>
      {Object.entries(grouped).map(([date,items])=>(
        <div key={date} style={{marginBottom:"16px"}}>
          <div style={{fontSize:"13px",color:"#94a3b8",marginBottom:"8px",fontWeight:"600"}}>{date}</div>
          {items.map(item=>{const stage=STAGES.find(s=>s.id===item.stage);return(
            <div key={item.id} style={{background:"#f8fafc",borderRadius:"10px",padding:"10px 12px",marginBottom:"6px",border:"1px solid #e2e8f0"}}>
              <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"4px"}}>
                <span style={{fontSize:"16px"}}>{stage?.icon}</span>
                <span style={{fontSize:"13px",fontWeight:"600",color:"#4338ca"}}>{stage?.title}</span>
                <span style={{fontSize:"12px",color:"#94a3b8"}}>- {item.actionText}</span>
              </div>
              <div style={{fontSize:"13px",color:"#334155",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{item.text}</div>
            </div>
          );})}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [mode,setMode]=useState("home");
  const [resultStage,setResultStage]=useState(null);
  const [allBlocked,setAllBlocked]=useState([]);
  const [user,setUser]=useState(null);
  const [entries,setEntries]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      fetch("/api/auth/me").then(r=>r.json()),
      fetch("/api/data").then(r=>r.json())
    ]).then(([u,d])=>{
      if(u.email)setUser(u.email);
      if(d.entries)setEntries(d.entries);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  const handleResult=useCallback((sid,all)=>{setResultStage(sid);setAllBlocked(all||[]);setMode("result");},[]);
  const reset=useCallback(()=>{setMode("home");setResultStage(null);setAllBlocked([]);},[]);
  const goDeep=useCallback((sid)=>setResultStage(sid),[]);
  const handleSave=useCallback(async(entry)=>{
    try{
      const res=await fetch("/api/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({entry})});
      const data=await res.json();
      if(data.entry)setEntries(p=>[data.entry,...p]);
    }catch(e){console.error(e);}
  },[]);
  const handleLogout=async()=>{await fetch("/api/auth/logout",{method:"POST"});window.location.href="/login";};

  if(loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:"32px"}}>🎯</div></div>;

  return (
    <div style={{maxWidth:"480px",margin:"0 auto",padding:"20px",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",direction:"rtl",minHeight:"100vh",background:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px",fontSize:"12px",color:"#94a3b8"}}>
        <span>{user}</span>
        <div style={{display:"flex",gap:"8px"}}>
          {mode!=="history"&&<button onClick={()=>setMode("history")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:"#6366f1"}}>📊 היסטוריה ({entries.length})</button>}
          <button onClick={handleLogout} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:"#94a3b8"}}>יציאה</button>
        </div>
      </div>

      {mode==="home"&&(
        <div>
          <div style={{textAlign:"center",marginBottom:"24px"}}>
            <h1 style={{margin:"0 0 6px 0",fontSize:"24px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>עץ החלטה → פעולה</h1>
            <p style={{margin:0,fontSize:"14px",color:"#94a3b8"}}>איפה אתה תקוע? מה יזיז אותך?</p>
          </div>
          <div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>
            <button onClick={()=>setMode("quick")} style={{flex:1,padding:"16px 12px",borderRadius:"14px",border:"2px solid #c7d2fe",background:"linear-gradient(135deg,#eef2ff,#faf5ff)",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:"28px",marginBottom:"6px"}}>⚡</div>
              <div style={{fontSize:"15px",fontWeight:"700",color:"#4338ca"}}>סריקה מהירה</div>
              <div style={{fontSize:"12px",color:"#6366f1",marginTop:"2px"}}>30 שניות</div>
            </button>
            <button onClick={()=>setMode("walkthrough")} style={{flex:1,padding:"16px 12px",borderRadius:"14px",border:"2px solid #c7d2fe",background:"linear-gradient(135deg,#eef2ff,#faf5ff)",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:"28px",marginBottom:"6px"}}>🔬</div>
              <div style={{fontSize:"15px",fontWeight:"700",color:"#4338ca"}}>אבחון מלא</div>
              <div style={{fontSize:"12px",color:"#6366f1",marginTop:"2px"}}>2-3 דקות</div>
            </button>
          </div>
          <div style={{background:"#f8fafc",borderRadius:"14px",padding:"16px"}}>
            <p style={{margin:"0 0 10px 0",fontSize:"13px",color:"#64748b"}}>8 נקודות - לחץ לקפוץ ישירות:</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
              {STAGES.map(s=>(<button key={s.id} onClick={()=>handleResult(s.id,[s.id])} style={{padding:"5px 10px",borderRadius:"20px",border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:"12px",color:"#475569"}}>{s.icon} {s.title}</button>))}
            </div>
          </div>
        </div>
      )}
      {mode==="quick"&&(<div><h2 style={{margin:"0 0 4px 0",fontSize:"18px",color:"#1e293b"}}>⚡ סריקה מהירה</h2><QuickScan onResult={handleResult}/><button onClick={reset} style={{marginTop:"12px",width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:"13px",color:"#94a3b8"}}>← חזרה</button></div>)}
      {mode==="walkthrough"&&(<div><WalkThrough onResult={handleResult}/><button onClick={reset} style={{marginTop:"12px",width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:"13px",color:"#94a3b8"}}>← חזרה</button></div>)}
      {mode==="result"&&resultStage&&(<StageView stageId={resultStage} allStages={allBlocked} onBack={reset} onGoDeep={goDeep} onSave={handleSave}/>)}
      {mode==="history"&&(<History entries={entries} onClose={reset}/>)}
    </div>
  );
}
