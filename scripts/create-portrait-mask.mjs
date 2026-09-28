// Generate only an alpha mask; never rewrite the supplied photograph.
// A protected ellipse keeps every facial pixel, including glasses reflections.
import sharp from 'sharp';
(async () => {
  const {data, info} = await sharp('public/images/hero/raffaela-hero.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h,channels:c}=info;
  const mask=Buffer.alloc(w*h*4);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
    const i=y*w+x, p=i*c;
    const face=((x/w-.51)/.13)**2+((y/h-.49)/.33)**2<1;
    const white=Math.min(data[p],data[p+1],data[p+2]);
    const alpha=face?255:Math.max(0,Math.min(255,(245-white)/65*255));
    mask[i*4]=255;mask[i*4+1]=255;mask[i*4+2]=255;mask[i*4+3]=alpha;
  }
  await sharp(mask,{raw:{width:w,height:h,channels:4}}).png().toFile('public/images/hero/raffaela-hero-mask.png');
  console.log('Display mask saved; original photograph unchanged.');
})();

