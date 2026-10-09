import { motion, useReducedMotion } from 'motion/react'

type Props = { mode?: 'idle'|'watch'|'windup'|'impact'|'settle', onStrike?:()=>void }
export default function Drummer({mode='idle',onStrike}:Props){
 const reduce=useReducedMotion()
 const rush=mode==='windup'||mode==='impact'
 const armAngle= mode==='windup' ? -58 : mode==='impact' ? 57 : mode==='watch' ? -12 : 8
 return <motion.svg className="drummer-svg" viewBox="0 0 620 550" role="img" aria-label="장구를 치는 작은 캐릭터. 머리를 묶고 장구채 두 개를 들고 있다."
  animate={reduce?{}:{y:mode==='idle'?[0,-6,0]:0,rotate:mode==='impact'?[0,3,0]:0}}
  transition={reduce?{}:{duration:mode==='idle'?1.7:.4,repeat:mode==='idle'?Infinity:0,ease:'easeInOut'}}
  onClick={onStrike}>
  <defs>
   <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8"/></filter>
   <linearGradient id="bodydrum" x1="0" x2="1"><stop stopColor="#9f311f"/><stop offset=".5" stopColor="#d15a37"/><stop offset="1" stopColor="#832b22"/></linearGradient>
  </defs>
  <g className="drummer-ink" opacity=".94" fill="none" stroke="#161514" strokeWidth="3">
    <path d="M96 453Q158 435 214 455M325 472Q419 449 529 471" strokeWidth="4"/>
    <path d="M82 464L112 450M123 477L131 453M497 454L542 449M472 482L521 474" opacity=".25"/>
  </g>
  <motion.g animate={rush?{x:mode==='impact'?18:-8}: {x:0}} transition={{type:'spring',stiffness:290,damping:19}}>
  {/* scarf/ribbon */}
  <path d="M286 263Q214 260 193 290Q239 287 254 309L299 290Z" fill="#b4472c" stroke="#141311" strokeWidth="5"/>
  <path d="M260 278Q210 281 176 270L196 300Q220 298 258 293" fill="#cc5130" stroke="#141311" strokeWidth="4"/>
  {/* legs */}
  <path d="M294 357L252 430Q243 446 222 450L215 469Q255 477 271 459L334 401Z" fill="#171616" stroke="#171616" strokeWidth="9" strokeLinejoin="round"/>
  <path d="M358 356L400 426L440 447L445 466Q398 477 375 452L330 407Z" fill="#171616" stroke="#171616" strokeWidth="9" strokeLinejoin="round"/>
  <path d="M211 460Q234 451 250 453" stroke="#f1ece1" strokeWidth="5" fill="none"/>
  {/* torso */}
  <path d="M264 273Q300 246 349 257Q381 292 390 365L352 393L280 376L245 332Z" fill="#181716" stroke="#141311" strokeWidth="6" strokeLinejoin="round"/>
  <path d="M301 270L330 293L356 268" stroke="#f1e8d8" strokeWidth="13" fill="none"/>
  <path d="M332 289L319 349L343 364" fill="none" stroke="#b83d2a" strokeWidth="8"/>
  <path d="M257 337Q304 352 372 339" stroke="#c34b2b" strokeWidth="12" fill="none"/>
  {/* hair tied behind head */}
  <path d="M226 151Q191 134 173 155Q170 172 188 191Q171 210 140 207Q168 233 205 223Q233 235 259 201Z" fill="#111" stroke="#111" strokeWidth="5"/>
  <path d="M185 169Q155 152 156 132Q184 137 200 157" fill="#111" stroke="#111" strokeWidth="7"/>
  <path d="M201 155L178 137L176 116Q201 118 218 151" fill="#141311"/>
  <path d="M182 179L169 172L162 189L180 192" fill="#c94933"/>
  {/* face */}
  <path d="M224 146Q252 95 306 109Q362 116 370 167Q381 213 343 249Q290 283 245 247Q215 231 207 194Z" fill="#f7eee0" stroke="#151413" strokeWidth="7" strokeLinejoin="round"/>
  <path d="M222 151Q229 108 272 101Q317 88 355 129L379 178Q347 167 337 140Q299 162 277 145Q260 172 223 166Z" fill="#131211" stroke="#131211" strokeWidth="4"/>
  <path d="M246 136Q216 157 218 186" stroke="#111" strokeWidth="11" fill="none"/>
  <path d="M208 186Q191 178 190 195Q188 216 215 221" fill="#f5ecdf" stroke="#151413" strokeWidth="6"/>
  <ellipse cx="283" cy="202" rx="5.4" ry="10" fill="#161514"/><ellipse cx="337" cy="191" rx="5" ry="9" fill="#161514"/>
  <path d={mode==='watch'?'M267 178L286 180M322 173L343 169':'M269 180L286 182M323 174L343 172'} stroke="#111" strokeWidth="4" strokeLinecap="round"/>
  <path d="M310 208L308 219" fill="none" stroke="#151413" strokeWidth="2.7"/>
  <path d={mode==='impact'?'M307 233Q318 217 326 232Q324 245 314 246Z':'M306 234Q318 240 329 232'} stroke="#151413" strokeWidth="3" fill={mode==='impact'?'#141311':'none'} strokeLinecap="round"/>
  <circle cx="258" cy="218" r="6" fill="#d8846c" opacity=".36"/>
  {/* left arm and mallet */}
  <path d="M268 293Q218 313 205 356L248 365L293 324" fill="#111" stroke="#111" strokeWidth="8" strokeLinejoin="round"/>
  <path d="M208 353Q198 343 191 354Q181 366 203 374L218 370" fill="#f7eee0" stroke="#141311" strokeWidth="5"/>
  <path d="M205 363L144 325" stroke="#151413" strokeWidth="8" strokeLinecap="round"/>
  <circle cx="137" cy="321" r="13" fill="#be492e" stroke="#141311" strokeWidth="5"/>
  {/* animated right arm mallet */}
  <motion.g animate={{rotate:armAngle}} transition={{type:'spring',stiffness:330,damping:17}} style={{transformOrigin:'366px 290px'}}>
    <path d="M364 280Q419 277 463 225L484 251Q461 298 386 334Z" fill="#151413" stroke="#151413" strokeWidth="8" strokeLinejoin="round"/>
    <path d="M469 231Q475 222 490 228Q501 237 485 249L475 245Z" fill="#f7eee0" stroke="#141311" strokeWidth="5"/>
    <path d="M487 233L520 113" stroke="#171615" strokeWidth="9" strokeLinecap="round"/>
    <circle cx="524" cy="104" r="17" fill="#c85032" stroke="#141311" strokeWidth="6"/>
  </motion.g>
  </motion.g>
  {/* double headed janggu */}
  <g filter="url(#rough)">
   <path d="M354 333Q394 318 462 340L510 362Q531 400 519 445Q473 477 416 474L362 456Q334 410 354 333Z" fill="url(#bodydrum)" stroke="#161514" strokeWidth="7"/>
   <path d="M417 343Q434 375 420 469M459 344Q482 380 467 462" stroke="#141311" strokeWidth="7" fill="none"/>
   <path d="M375 346L493 455M391 333L509 432M368 370L487 470M365 447L489 355" stroke="#171615" strokeWidth="4" fill="none" opacity=".85"/>
   <ellipse cx="358" cy="396" rx="52" ry="77" transform="rotate(10 358 396)" fill="#f4eadb" stroke="#171615" strokeWidth="9"/>
   <ellipse cx="358" cy="396" rx="44" ry="69" transform="rotate(10 358 396)" fill="none" stroke="#b4a596" strokeWidth="3" strokeDasharray="7 7"/>
   <ellipse cx="516" cy="407" rx="25" ry="48" transform="rotate(-12 516 407)" fill="#f1e8db" stroke="#171615" strokeWidth="7"/>
   <path d="M317 403L401 404" stroke="#b34d30" strokeWidth="2" opacity=".35"/>
  </g>
  {/* character accents */}
  <path d="M212 486L236 479M452 493L481 482" stroke="#151413" strokeWidth="3" strokeLinecap="round" opacity=".5"/>
 </motion.svg>
}
