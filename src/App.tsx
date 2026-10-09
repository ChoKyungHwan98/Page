import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowUpRight, ArrowRight, Volume2, VolumeX, X } from 'lucide-react'
import { Button } from './components/ui/button'
import Drummer from './components/Drummer'
import InkField from './components/InkField'

type Page = 'home'|'work'|'resume'|'about'
type Item = Page|'play'
type Stage = 'idle'|'watch'|'windup'|'impact'|'settle'
const menu: {id:Item, label:string,num:string}[]=[
 {id:'work',label:'포트폴리오',num:'01'},
 {id:'resume',label:'이력서',num:'02'},
 {id:'about',label:'자기소개',num:'03'},
 {id:'play',label:'시작하기',num:'04'}
]
const projects=[
 {title:'BATTLE',type:'전투·보스 AI',desc:'보스의 전투 판단과 행동을 설계한 프로젝트',url:'https://github.com/ChoKyungHwan98/Battle',n:'01'},
 {title:'PICO-BANG',type:'시스템·코어 루프',desc:'플레이어 경험을 구조와 규칙으로 구체화한 프로젝트',url:'https://github.com/ChoKyungHwan98/Pico-Bang',n:'02'},
 {title:'AI REVIEW',type:'기획 도구·데이터',desc:'스팀 리뷰를 기획자가 읽을 수 있는 정보로 재구성',url:'https://github.com/ChoKyungHwan98/Tool_Ai-review',n:'03'}
]
function beep(){
 try{
  const context = new AudioContext();const oscillator=context.createOscillator();const gain=context.createGain()
  oscillator.type='triangle';oscillator.frequency.setValueAtTime(216,context.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(134,context.currentTime+.14)
  gain.gain.setValueAtTime(.07,context.currentTime)
  gain.gain.exponentialRampToValueAtTime(.0001,context.currentTime+.2)
  oscillator.connect(gain);gain.connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+.21)
  setTimeout(()=>void context.close(),350)
 }catch{ /* Browser blocks audio until interaction; visual response still works. */ }
}
export default function App(){
 const reduced=useReducedMotion()
 const [page,setPage]=useState<Page>(()=>{const v=location.hash.replace('#','');return ['work','resume','about'].includes(v)?v as Page:'home'})
 const [stage,setStage]=useState<Stage>('idle')
 const [hover,setHover]=useState<Item>('work')
 const [sound,setSound]=useState(false)
 const [playing,setPlaying]=useState(false)
 const [hit,setHit]=useState(0)
 const [lastTarget,setLastTarget]=useState<Item>('work')
 const timers=useRef<ReturnType<typeof setTimeout>[]>([])
 const clearTimers=()=>{timers.current.forEach(clearTimeout);timers.current=[]}
 useEffect(()=>{const onHash=()=>{const s=location.hash.slice(1); if(['home','work','resume','about'].includes(s)){clearTimers();setPage(s as Page);setStage('idle')}};window.addEventListener('hashchange',onHash);return ()=>{window.removeEventListener('hashchange',onHash);clearTimers()}},[])
 const schedule=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))}
 const visit=(to:Item)=>{
  if(stage==='windup'||stage==='impact')return
  setLastTarget(to);setHover(to)
  clearTimers()
  if(reduced){
   if(to==='play'){setPlaying(true)}else{setPage(to);location.hash=to}
   setStage('idle');return
  }
  if(sound)beep()
  setStage('windup')
  schedule(()=>setStage('impact'),310)
  schedule(()=>{if(to==='play'){setPlaying(true)}else{setPage(to);location.hash=to}setStage('settle')},830)
  schedule(()=>setStage('idle'),1130)
 }
 const returnHome=()=>{clearTimers();setStage('idle');setPage('home');location.hash='home'}
 const selectSound=()=>setSound(v=>!v)
 useEffect(()=>{if(!playing)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setPlaying(false);if(e.key===' '||e.key==='ArrowRight'){e.preventDefault();setHit(v=>v+1);if(sound)beep()}};window.addEventListener('keydown',key);return ()=>window.removeEventListener('keydown',key)},[playing,sound])
 return <div className={'site-shell '+(page==='home'?'is-home':'is-section')}>
  <div className="paper-overlay" aria-hidden="true"/>
  <AnimatePresence mode="wait">
   {page==='home'? <motion.main className="hero" key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:.6}} transition={{duration:.22}}>
    <InkField/>
    <div className="hero-ambient hero-ambient--one" aria-hidden="true"/>
    <div className="hero-ambient hero-ambient--two" aria-hidden="true"/>
    <header className="masthead"><span className="identity"><strong>조경환</strong><small>전투 · 시스템 게임 기획자</small></span><button type="button" className="sound-toggle" onClick={selectSound} aria-label={sound?'소리 끄기':'소리 켜기'}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}<span>{sound?'소리 켜짐':'소리 꺼짐'}</span></button></header>
    <nav className="side-menu" aria-label="주 메뉴">
     {menu.map(m=><motion.button type="button" key={m.id} onHoverStart={()=>{setHover(m.id);setStage(v=>v==='idle'||v==='watch'?'watch':v)}} onHoverEnd={()=>setStage(v=>v==='watch'?'idle':v)}
      onFocus={()=>setHover(m.id)} onClick={()=>visit(m.id)}
      aria-current={lastTarget===m.id?'page':undefined} className={'menu-item '+(hover===m.id?'menu-item--selected':'')}>
      <span className="menu-no">{m.num}</span><span className="brush-swipe" aria-hidden="true"/><span className="menu-label">{m.label}</span><ArrowUpRight className="menu-arrow" size={23} strokeWidth={2}/></motion.button>)}
    </nav>
    <div className="hero-quote">게임을 만드는 것은<br/>경험의 구조를 설계하는 일.</div>
    <section className="hero-story" aria-label="소개">
     <p className="eyebrow"><span className="tiny-red-dot"/> 기획자의 작업실 / 2026</p>
     <h1><span className="headline-brush">놀이를</span><span>설계하는</span><span>기획자</span></h1>
     <p className="hero-description">전투와 시스템으로<br/>사람들이 오래 기억할 경험을 만듭니다.</p>
    </section>
    <div className="drummer-wrap"><div className={'beat-rays '+(stage==='impact'?'beat-rays--hit':'')} aria-hidden="true"><i/><i/><i/></div><Drummer mode={stage==='watch'?'watch':stage==='windup'?'windup':stage==='impact'?'impact':stage==='settle'?'settle':'idle'} onStrike={()=>visit(hover)}/></div>
    <div className="hero-side-note" aria-hidden="true">전투의 긴장감 / 시스템의 설득력<br/>좋은 경험은 우연히 나오지 않는다</div>
    <div className="feature-ribbon"><span className="feature-label">대표 작업 <span>↗</span></span>{projects.map(p=><button key={p.n} type="button" className="feature-item" onClick={()=>visit('work')}><span className="feature-num">{p.n}</span><span className="feature-title">{p.title}</span><span className="feature-type">{p.type}</span></button>)}</div>
   </motion.main>:<motion.main key={page} className="section-page" initial={reduced?false:{opacity:0,y:22}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.35}}>
    <header className="section-header"><button className="home-return" type="button" onClick={returnHome}><ArrowLeft size={18}/> 처음으로</button><span>조경환 · 게임 기획 포트폴리오</span><button onClick={selectSound} className="sound-toggle sound-toggle--dark" aria-label="소리 설정">{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button></header>
    <div className="section-intro"><p className="eyebrow">기획자의 작업실 / {page==='work'?'01':page==='resume'?'02':'03'}</p><h1><span className="small-red-stroke"/>{page==='work'?'포트폴리오':page==='resume'?'이력서':'자기소개'}</h1><p>{page==='work'?'어떤 재미를 만들고, 어떤 문제를 해결했는지 보여줍니다.':page==='resume'?'프로젝트에서 맡은 역할과 익힌 역량을 정리했습니다.':'게임을 설계하는 이유와 앞으로 만들어갈 경험에 대해.'}</p></div>
    {page==='work'?<section className="project-grid" aria-label="작업 목록">{projects.map(p=><a key={p.n} className="project-tile" href={p.url} target="_blank" rel="noreferrer"><span className="project-number">{p.n} / 대표 작업</span><div className="tile-graphic" aria-hidden="true"><span className="tile-paint"/><span className="tile-stripe"/></div><h2>{p.title}<ArrowUpRight size={25}/></h2><p>{p.desc}</p><small>{p.type}</small></a>)}</section>:<section className="bio-panel">{page==='resume'?<><h2>전투와 시스템을 중심으로 기획합니다.</h2><p>프로젝트 설계, 플레이 경험 분석, 프로토타입 제작, 데이터 시각화에 집중하고 있습니다. 검증된 내용과 정식 이력서는 이후 이 페이지에 반영할 예정입니다.</p><div className="tag-line"><span>전투 기획</span><span>시스템 설계</span><span>프로토타이핑</span><span>데이터 분석</span></div></>:<><h2>재미를 느끼게 하는 구조를 만들고 싶습니다.</h2><p>저에게 게임 기획은 아이디어를 늘어놓는 일이 아니라, 플레이어가 이해하고 선택하고 몰입할 수 있도록 경험의 원인을 설계하는 일입니다.</p><p>이 영역은 디자인 검토용 임시 문안이며 정식 자기소개서가 아닙니다.</p></>}</section>}
    <footer className="section-footer"><span>이 페이지는 홈 디자인 v2를 검토하기 위한 시안입니다.</span><button onClick={returnHome}>홈으로 돌아가기 <ArrowRight size={17}/></button></footer>
   </motion.main>}
  </AnimatePresence>
  <AnimatePresence>{stage==='impact'&&!reduced&&<motion.div className="ink-impact" key="impact" initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}} exit={{opacity:0}} transition={{duration:.22,ease:[.2,.7,.2,1]}} aria-hidden="true"><div className="impact-streak impact-streak--a"/><div className="impact-streak impact-streak--b"/><div className="impact-streak impact-streak--c"/></motion.div>}</AnimatePresence>
  <Dialog.Root open={playing} onOpenChange={setPlaying}><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="rhythm-dialog"><Dialog.Title className="rhythm-title">장구 한 박자</Dialog.Title><Dialog.Description className="rhythm-desc">리듬 게임 전체는 아직 제작 전이에요. 지금은 키 입력과 반응만 시험할 수 있습니다.</Dialog.Description><div className="rhythm-keys"><Button onClick={()=>{setHit(v=>v+1);if(sound)beep()}}>스페이스 · 왼손</Button><Button onClick={()=>{setHit(v=>v+1);if(sound)beep()}}>→ · 오른손</Button></div><p className="rhythm-score" aria-live="polite">지금까지 {hit}번 두드렸어요</p><a className="original-link" href="https://chokyunghwan98.github.io/Page/" target="_blank" rel="noreferrer">기존 v1 리듬 체험 열기 <ArrowUpRight size={16}/></a><Dialog.Close className="dialog-close" aria-label="닫기"><X size={22}/></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>
 </div>
}
