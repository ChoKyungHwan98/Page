"""Build independent raster art layers from the existing licensed/created concept-art assets.
No CSS or SVG illustration is generated. This runs before Vite build on GitHub Actions.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import random, math

out=Path("public/assets")
out.mkdir(parents=True,exist_ok=True)
src=Image.open(out/"home-art.webp").convert("RGB")
W,H=src.size
rand=random.Random(37912)
# Black painted panel fully conceals text baked into the original poster.
panel=Image.new("RGBA",(780,H),(0,0,0,0))
d=ImageDraw.Draw(panel)
knots=[(0,448),(150,470),(300,489),(500,543),(650,633),(780,728),(H,770)]
def edge(y):
 for (ya,xa),(yb,xb) in zip(knots,knots[1:]):
  if ya<=y<=yb: return xa+(xb-xa)*(y-ya)/(yb-ya)
 return knots[-1][1]
poly=[(0,0),(edge(0),0)]
for y in range(0,H+7,7):
 poly.append((edge(min(y,H))+rand.randint(-8,8),min(y,H)))
poly.extend([(0,H),(0,0)])
d.polygon(poly,fill=(18,17,16,255))
for _ in range(1600):
 x=rand.randint(0,779);y=rand.randint(0,H-1)
 if x<edge(y)-18:
  v=rand.randint(13,31);d.point((x,y),fill=(v,v-1,v-2,255))
for _ in range(32):
 y=rand.randint(0,H-1);x=int(edge(y))+rand.randint(-16,12)
 d.line((x,y,x+rand.randint(2,14),y-rand.randint(1,8)),fill=(18,17,16,rand.randint(55,190)),width=rand.randint(1,3))
panel.save(out/"ink-panel.webp","WEBP",quality=86,method=6)

# Textless pigment brush shapes: the Korean labels remain actual HTML text.
bw,bh=470,103
paper=src.crop((840,150,840+bw,150+bh)).convert("RGB").resize((bw,bh))
for variant in ("paper","rust"):
 canvas=Image.new("RGBA",(bw,bh),(0,0,0,0))
 mask=Image.new("L",(bw,bh),0);md=ImageDraw.Draw(mask)
 top=[(rand.randint(5,17),rand.randint(20,27))]
 for x in range(18,bw-6,9):top.append((x,rand.randint(10,23)))
 bottom=[]
 for x in range(bw-7,5,-9):bottom.append((x,rand.randint(bh-24,bh-13)))
 md.polygon(top+bottom,fill=255)
 for k in range(145):
  y=rand.choice([rand.randint(4,32),rand.randint(bh-30,bh-4)])
  x=rand.randint(0,bw-1)
  md.line([(x,y),(min(bw-1,x+rand.randint(4,38)),y+rand.randint(-3,3))],fill=rand.randint(60,245),width=rand.randint(1,3))
 for k in range(200):
  x=rand.randint(0,bw-1);y=rand.randint(0,bh-1)
  if rand.random()<.53: md.point((x,y),fill=0)
 if variant=="paper":
  canvas.paste(paper,(0,0))
 else:
  tone=Image.new("RGB",(bw,bh),(179,55,34))
  tint=Image.blend(tone,paper,.12);canvas.paste(tint,(0,0))
 canvas.putalpha(mask.filter(ImageFilter.GaussianBlur(.4)))
 canvas.save(out/f"brush-{variant}.webp","WEBP",quality=89,method=6)

# Separate inky backing blocks the poster's old printed project cards.
rw,rh=488,435
back=Image.new("RGBA",(rw,rh),(0,0,0,0));bd=ImageDraw.Draw(back)
outline=[(16,5),(rw-20,6),(rw-4,21),(rw-12,rh-15),(rw-30,rh-5),(8,rh-6),(2,rh-25),(5,17)]
bd.polygon(outline,fill=(17,16,16,255))
for i in range(1500):
 x=rand.randint(14,rw-30);y=rand.randint(15,rh-18);v=rand.randint(16,29);bd.point((x,y),fill=(v,v-1,v-1,255))
back.save(out/"project-backdrop.webp","WEBP",quality=85,method=6)
print("Generated raster menu and project backing assets.")


# High-quality native source-art crops, no new artificial CSS/SVG illustrations.
# These are genuine pixels from each original card's artwork (text-free right-hand area).
card_rects={
 "battle":(1403,477,1623,595),
 "pico":(1403,609,1623,728),
 "review":(1403,740,1623,858),
}
for name,box in card_rects.items():
  card=src.crop(box).resize((660,357),Image.Resampling.LANCZOS)
  card.save(out/f"{name}.webp","WEBP",quality=88,method=6)
print("Generated 3 project image crops from master illustration.")
