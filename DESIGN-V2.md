# 홈 디자인 v2 — 붓획과 캐릭터

이 작업은 본문 브랜치 main과 GitHub Pages 공개 웹사이트를 변경하지 않는 검토용 React 구현입니다.

## 사용자 선택
- 앞선 첫 번째 v2 콘셉트의 구도: 왼쪽 검은 경사면, 오른쪽 장구 캐릭터.
- 장구 캐릭터는 단순하고 인지가 빠른 리듬 게임 마스코트 느낌을 유지.
- 단단한 흑백과 종이색에 주홍 계열 잉크 강조.
- 선택 메뉴에 찢긴 종이 같은 거친 붓획, UI 문구는 한국어.
- 사이트는 게임 화면이 아니라 전투/시스템 기획 포트폴리오.

## 인터랙션
1. 메뉴에 포인터/포커스 → 붓획 하이라이트와 캐릭터의 작은 반응.
2. 메뉴 클릭 → 장구채 준비 → 마지막 한 타 → 화면의 검은 획 → 한국어 포트폴리오/이력/소개 이동.
3. 소리 기본 끔, 켜면 짧은 합성 타격음.
4. 체험은 짧은 인터랙션 미리보기이며 완성된 리듬 게임이 아닙니다.

## 실제 라이브러리
- React 19 + Vite + TypeScript (SPA 구성)
- Tailwind CSS v4 (@tailwindcss/vite) + shadcn/ui Button 패턴(CVA + Radix Slot)
- @radix-ui/react-dialog (접근 가능한 체험 대화창)
- Motion (캐릭터/페이지/전환 타이밍)
- lucide-react (의미 있는 아이콘)

실제 외부 컴포넌트 소스를 저작권 확인 없이 복제하지 않습니다. 21st.dev와 motionin.design의 연출은 비교/참고용이며, 브러시 모양과 캐릭터는 이 브랜치에서 자체 작성했습니다. shadcn/ui는 MIT 라이선스를 확인하는 것이 좋습니다.

## 실행
```sh
npm install
npm run dev
npm run build
```

정적 배포 시 Vite의 상대경로 base='./' 설정을 사용합니다. main의 GitHub Pages 배포 설정은 변경하지 않습니다.

## 검토 링크
GitHub의 브랜치 소스를 그대로 가져오는 StackBlitz 기능으로 별도 미리보기가 가능합니다:
https://stackblitz.com/github/ChoKyungHwan98/Page/tree/feat/home-v2-brush-character

주의: StackBlitz는 제3자 사이트이며 첫 접속 시 설치/빌드에 시간이 걸릴 수 있습니다. 작업 브랜치가 아직 main에 병합되지 않았습니다.
