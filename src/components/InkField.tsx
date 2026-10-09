export default function InkField(){
 return <svg className="ink-field" viewBox="0 0 1512 840" preserveAspectRatio="none" aria-hidden="true">
 <defs><filter id="inkNoise" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="3" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="11"/></filter></defs>
 <path d="M0 0H470L455 61L419 109L388 180L337 272L326 305L303 334L279 420L245 513L215 617L183 745L160 840H0Z" fill="#11110f"/>
 <g filter="url(#inkNoise)" fill="#11110f" opacity=".91">
 <path d="M455 0L488 0L445 89L425 128L389 178L367 224L347 282L335 309L312 370L280 431L268 473L244 515L205 644L177 784L146 840L162 742L209 585L249 480L272 403L301 329L339 242L384 160L407 113Z"/>
 <path d="M417 0L468 0L453 49L432 80L428 41Z"/>
 <path d="M204 592Q364 647 566 734L836 837L410 840L164 796Z"/>
 <path d="M210 615Q454 717 762 835H647L192 705Z" opacity=".72"/>
 </g>
 <path d="M428 0Q341 158 285 326Q220 503 174 702" fill="none" stroke="#d5d0c7" strokeWidth="1.5" opacity=".38" strokeDasharray="6 20"/>
 <g fill="#141311">
 <path d="M493 63L505 44L510 103L492 114Z" opacity=".2"/><path d="M537 75L542 51L546 128L535 134Z" opacity=".12"/>
 <path d="M577 240L589 196L597 237L612 254L573 259Z" opacity=".12"/>
 <path d="M524 510L535 498L536 529L520 530Z" opacity=".1"/>
 </g>
 <path d="M357 219L369 223L331 307L321 303" fill="#ba442e" opacity=".84"/>
 <path d="M271 577L315 598L294 604Z" fill="#b9492e" opacity=".85"/>
 <g fill="none" stroke="#12110f" strokeWidth="3" opacity=".36"><path d="M642 154L656 147L647 167"/><path d="M1097 106L1111 100L1108 115"/><path d="M998 559L1017 546L1021 570"/></g>
 </svg>
}