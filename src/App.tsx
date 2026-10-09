import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowUpRight, Volume2, VolumeX, X } from 'lucide-react'
import { Button } from './components/ui/button'

type Page = 'home' | 'work' | 'resume' | 'about'
type Target = Page | 'play'
type ProjectKey = 'battle' | 'pico' | 'review'

const BASE = './'
const artwork = `${BASE}assets/home-art.webp`

const projects: { key: ProjectKey; name: string; type: string; summary: string; repo: string }[] = [
  { key: 'battle', name: 'BATTLE', type: '전투·보스 AI 기획', summary: '전투의 리듬과 보스의 판단을 구조화한 전투 기획·프로토타입', repo: 'https://github.com/ChoKyungHwan98/Battle' },
  { key: 'pico', name: 'PICO-BANG', type: '코어 루프·시스템 기획', summary: '플레이어 경험을 핵심 재미와 규칙으로 구체화한 프로젝트', repo: 'https://github.com/ChoKyungHwan98/Pico-Bang' },
  { key: 'review', name: 'AI REVIEW', type: '게임 리뷰 분석 도구', summary: '게임 리뷰를 분석하고 기획에 활용할 수 있도록 시각화한 도구', repo: 'https://github.com/ChoKyungHwan98/Tool_Ai-review' },
]

const labels: Record<Page, string> = { home: '홈', work: '포트폴리오', resume: '이력서', about: '자기소개' }
const pageFromHash = (): Page => {
  const part = window.location.hash.replace('#', '').split('/')[0]
  return part === 'work' || part === 'resume' || part === 'about' ? part : 'home'
}

function useHitSound() {
  const [enabled, setEnabled] = useState(false)
  const sound = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = new AudioContext()
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.type = 'triangle'; o.frequency.setValueAtTime(230, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(94, ctx.currentTime + .13)
      g.gain.setValueAtTime(.08, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .22)
      o.connect(g); g.connect(ctx.destination)
      o.start(); o.stop(ctx.currentTime + .23)
      o.addEventListener('ended', () => { void ctx.close() })
    } catch { /* Browsers can disable synthesized sound. */ }
  }, [enabled])
  return { enabled, setEnabled, sound }
}

export default function App() {
  const reduced = useReducedMotion()
  const [page, setPage] = useState<Page>(pageFromHash)
  const [project, setProject] = useState<ProjectKey | null>(null)
  const [play, setPlay] = useState(false)
  const [hitCount, setHitCount] = useState(0)
  const [lastSide, setLastSide] = useState<'왼쪽' | '오른쪽'>('왼쪽')
  const [switching, setSwitching] = useState(false)
  const { enabled: soundOn, setEnabled: setSoundOn, sound } = useHitSound()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => {
    const handler = () => { clearTimers(); setPage(pageFromHash()); setSwitching(false) }
    window.addEventListener('hashchange', handler)
    return () => { window.removeEventListener('hashchange', handler); clearTimers() }
  }, [])
  const navigate = useCallback((target: Target, selectedProject: ProjectKey | null = null) => {
    if (switching) return
    if (target === 'play') { setPlay(true); setHitCount(0); return }
    if (target === 'home' && page === 'home') return
    setProject(selectedProject)
    clearTimers()
    if (reduced) { setPage(target); window.location.hash = target; window.scrollTo({ top: 0 }); return }
    setSwitching(true)
    sound()
    timers.current.push(setTimeout(() => {
      setPage(target); window.location.hash = target
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 490))
    timers.current.push(setTimeout(() => setSwitching(false), 810))
  }, [page, switching, reduced, sound])
  const tap = useCallback((side: '왼쪽' | '오른쪽') => { setHitCount(v => v + 1); setLastSide(side); sound() }, [sound])
  useEffect(() => {
    if (!play) return
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); tap('왼쪽') }
      if (e.code === 'ArrowRight') { e.preventDefault(); tap('오른쪽') }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [play, tap])

  const goWork = (which: ProjectKey | null) => navigate('work', which)
  return <div className="app-shell">
    <AnimatePresence mode="wait">
      {page === 'home' ? <motion.main key="home" className="home-page" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .28 }}>
        <div className="poster poster--master-art" aria-label="조경환의 게임 기획 포트폴리오">
          <img className="poster-art" src={artwork} alt="장구를 든 캐릭터, 먹으로 그린 판타지 도시와 한글 메뉴로 구성된 포트폴리오 홈" draggable={false} />
          <nav className="art-hotspots" aria-label="메인 메뉴">
            <button className="art-hit art-hit--work" type="button" aria-label="포트폴리오 열기" title="포트폴리오 열기" onClick={()=>goWork(null)} />
            <button className="art-hit art-hit--resume" type="button" aria-label="이력서 열기" title="이력서 열기" onClick={()=>navigate('resume')} />
            <button className="art-hit art-hit--about" type="button" aria-label="자기소개 열기" title="자기소개 열기" onClick={()=>navigate('about')} />
            <button className="art-hit art-hit--play" type="button" aria-label="장구 리듬 체험 시작하기" title="장구 리듬 체험" onClick={()=>navigate('play')} />
          </nav>
          <div className="art-project-links" role="group" aria-label="대표 프로젝트">
            {projects.map(p=><button key={p.key} type="button" className={"art-hit art-hit--"+p.key}
              aria-label={p.name+" 프로젝트 확인"} title={p.name+" 프로젝트 확인"} onClick={()=>goWork(p.key)}/>)}
          </div>
          <button className="art-sound" type="button" onClick={()=>setSoundOn(v=>!v)}
            title={soundOn?'소리 끄기':'소리 켜기'} aria-label={soundOn?'소리 끄기':'소리 켜기'} aria-pressed={soundOn}/>
        </div>
        <div className="mobile-home">
          <header className="mobile-heading"><strong>조경환</strong><span>전투 · 시스템 기획자</span><button onClick={() => setSoundOn(v => !v)} aria-label="소리 설정">{soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}</button></header>
          <div className="mobile-art-window"><img src={artwork} alt="장구를 치는 캐릭터와 수묵화 스타일의 배경" draggable={false} /></div>
          <nav className="mobile-navigation" aria-label="주 메뉴"><button onClick={() => goWork(null)}>포트폴리오</button><button onClick={() => navigate('resume')}>이력서</button><button onClick={() => navigate('about')}>자기소개</button><button className="mobile-play" onClick={() => navigate('play')}>시작하기</button></nav>
          <h2 className="mobile-project-title">대표 작업</h2><div className="mobile-projects">{projects.map(p => <button key={p.key} onClick={() => goWork(p.key)}><span>{p.name}</span><small>{p.type}</small><ArrowUpRight size={17}/></button>)}</div>
        </div>
      </motion.main> : <motion.main className="inside-page" key={page} initial={reduced ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .32 }}>
        <header className="inside-bar"><button onClick={() => navigate('home')} className="back-button"><ArrowLeft size={18}/> 홈으로</button><span>조경환 <span className="bar-divider">/</span> 전투 · 시스템 기획자</span></header>
        <section className="inside-heading"><span className="inside-label">기획 포트폴리오</span><h1>{labels[page]}</h1></section>
        {page === 'work' ? <div className="works-body">
          <div className="works-index"><p>대표 작업 03</p><nav aria-label="프로젝트 바로가기">{projects.map(p => <button className={project === p.key ? 'current' : ''} key={p.key} onClick={() => document.getElementById(`work-${p.key}`)?.scrollIntoView({ behavior: 'smooth' })}>{p.name}</button>)}</nav></div>
          <div className="works-list">{projects.map((p, i) => <article id={`work-${p.key}`} key={p.key} className={`work-entry ${project === p.key ? 'is-requested' : ''}`}>
            <div className={`work-artwork work-artwork--${p.key}`} style={{ backgroundImage: `url(${BASE}assets/${p.key}.webp)` }} aria-hidden="true" />
            <div className="work-description"><span className="work-counter">{String(i + 1).padStart(2, '0')} / 03</span><h2>{p.name}</h2><strong>{p.type}</strong><p>{p.summary}</p><Button asChild><a href={p.repo} target="_blank" rel="noopener noreferrer">프로젝트 확인 <ArrowUpRight size={17}/></a></Button></div>
          </article>)}</div>
        </div> : <section className="profile-content"><p className="profile-eyebrow">{page === 'resume' ? '이력서' : '자기소개'}</p><h2>{page === 'resume' ? '전투와 시스템을 설계합니다.' : '게임을 설계하는 이유'}</h2><p>{page === 'resume' ? '전투 기획·시스템 설계·프로토타이핑에 집중하고 있습니다. 정식 이력서의 자세한 내용은 아래 링크에서 확인할 수 있습니다.' : '게임 기획 경험과 지원 동기는 기존 포트폴리오의 자기소개서에서 확인할 수 있습니다.'}</p><div className="profile-actions"><Button asChild><a href={page === 'resume' ? 'https://chokyunghwan98.github.io/Portfolio/?view=resume' : 'https://chokyunghwan98.github.io/Portfolio/?view=cover-letter'} target="_blank" rel="noopener noreferrer">{page === 'resume' ? '기존 이력서 자세히 보기' : '자기소개서 자세히 보기'} <ArrowUpRight size={17}/></a></Button><Button variant="outline" onClick={() => navigate('work')}>대표 작업 보기 <ArrowUpRight size={17}/></Button></div></section>}
        <footer className="inside-footer">조경환 · 전투 / 시스템 기획 <button onClick={() => navigate('home')}>처음으로 ↑</button></footer>
      </motion.main>}
    </AnimatePresence>
    <AnimatePresence>{switching && !reduced && <motion.div className="page-interlude" initial={{ opacity: 0 }} animate={{ opacity: [.0, .95, .18] }} exit={{ opacity: 0 }} transition={{ duration: .75, times: [0, .36, 1] }} aria-hidden="true"><img src={`${BASE}assets/brush-rust.webp`} alt="" /></motion.div>}</AnimatePresence>
    <Dialog.Root open={play} onOpenChange={setPlay}><Dialog.Portal><Dialog.Overlay className="dialog-backdrop" /><Dialog.Content className="rhythm-dialog"><Dialog.Title className="dialog-title">장구 리듬 체험</Dialog.Title><Dialog.Description className="dialog-description">스페이스와 오른쪽 화살표 키를 눌러 두 종류의 장구 소리를 연주해 보세요. 전체 리듬 게임은 제작 중입니다.</Dialog.Description><div className="rhythm-buttons"><button onClick={() => tap('왼쪽')}>스페이스<span>왼쪽</span></button><button onClick={() => tap('오른쪽')}>→<span>오른쪽</span></button></div><p className="tap-feedback" role="status">{hitCount === 0 ? '어느 쪽부터 쳐 볼까?' : `${lastSide} · ${hitCount}타`}</p><Dialog.Close className="dialog-close" aria-label="닫기"><X size={22} /></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>
}
