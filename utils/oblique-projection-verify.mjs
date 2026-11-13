import * as mat4 from '/home/ys/feedback/uidreczz28ZFFXYqoKT/src/mat4.js';
import * as vec3 from '/home/ys/feedback/uidreczz28ZFFXYqoKT/src/vec3.js';
import { setMatrixArrayType } from '/home/ys/feedback/uidreczz28ZFFXYqoKT/src/common.js';

const clip = (m,p)=>[
  m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],
  m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],
  m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14],
  m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15]];
const inside=(c)=> -c[3]<=c[2]&&c[2]<=c[3]&&-c[3]<=c[0]&&c[0]<=c[3]&&-c[3]<=c[1]&&c[1]<=c[3];
const ndc=(c)=>[c[0]/c[3],c[1]/c[3],c[2]/c[3]];
const f3=(v)=>v.map(x=>+x.toFixed(6));
const maxDrift=(a,b)=>Math.max(...Array.from({length:16},(_,i)=>Math.abs(a[i]-b[i])));
const mul64=(a,b)=>{const o=new Float64Array(16);mat4.multiply(o,a,b);return o;};

const ang=20*Math.PI/180;
const normal=[0,Math.sin(ang),-Math.cos(ang)];
const p0=[0,0,-1];
const onPlane=(x,z)=>[x,(normal[2]*(p0[2]-z))/normal[1]+p0[1],z];
const quad=[onPlane(-1,-0.5),onPlane(1,-0.5),onPlane(1,-2.5),onPlane(-1,-2.5)];
const sectionVertex=onPlane(1,-0.5);
const building=[[-1,0,-0.2],[1,0,-0.2],[1,3,-0.2],[-1,3,-0.2],
                [-1,0,-4],[1,0,-4],[1,3,-4],[-1,3,-4]];
const inputs=[['section(plane)',sectionVertex],...building.map((v,i)=>['b'+i,v])];

// ---- Q in default Float32 storage (shipping behavior) ----
const Q=mat4.create();
mat4.obliqueFromQuad(Q,quad[0],quad[1],quad[2],quad[3],null);
console.log('=== Q (Float32 storage, column-major) ===');
console.log(Array.from(Q).map(x=>+x.toFixed(9)).join(', '));

// Fit ortho to the sheared scene: transform all points by Q, take AABB, 5% margin.
const sheared=inputs.map(([,v])=>vec3.transformMat4(vec3.create(),v,Q));
const min=[Infinity,Infinity,Infinity], max=[-Infinity,-Infinity,-Infinity];
for(const s of sheared) for(let k=0;k<3;k++){min[k]=Math.min(min[k],s[k]);max[k]=Math.max(max[k],s[k]);}
const mx=(k)=>0.05*(max[k]-min[k]||1);
const L=min[0]-mx(0), R=max[0]+mx(0), B=min[1]-mx(1), T=max[1]+mx(1);
const near=-max[2]-mx(2), far=-min[2]+mx(2);   // camera looks down -Z
console.log('\nfitted ortho bounds: L,R,B,T,near,far =',[L,R,B,T,near,far].map(x=>+x.toFixed(4)).join(', '));

const Pbefore=mat4.ortho(mat4.create(),-4,4,-4,4,1,5);
const Pafter=mat4.multiply(mat4.create(), mat4.ortho(mat4.create(),L,R,B,T,near,far), Q);

console.log('\n=== BEFORE / AFTER, identical inputs (clip verdict + NDC) ===');
for(const [tag,v] of inputs){
  const c1=clip(Pbefore,v), c2=clip(Pafter,v);
  console.log(tag.padEnd(15),'v=',JSON.stringify(f3(v)));
  console.log('  BEFORE:', inside(c1)?'keep':'CULL','ndc=',JSON.stringify(f3(ndc(c1))));
  console.log('  AFTER :', inside(c2)?'keep':'CULL','ndc=',JSON.stringify(f3(ndc(c2))));
}

// ---- drift: Float32 path ----
const Q2f32=mat4.multiply(new Float32Array(16),Float32Array.from(Q),Float32Array.from(Q));
console.log('\n=== reuse twice: max|Q - Q*Q| over 16 entries ===');
console.log('Float32 storage:', maxDrift(Q,Q2f32).toExponential(3));

// ---- drift: Float64 path (setMatrixArrayType(Array)) ----
setMatrixArrayType(Array);
const Qd=mat4.create();
mat4.obliqueFromQuad(Qd,quad[0],quad[1],quad[2],quad[3],null);
const Qd2=mul64(Qd,Qd);
console.log('Float64 storage:', maxDrift(Qd,Qd2).toExponential(3));
let vd=0;
for(const [,v] of inputs){const a=ndc(clip(Qd,v)),b=ndc(clip(Qd2,v));a.forEach((x,i)=>vd=Math.max(vd,Math.abs(x-b[i])));}
console.log('vertex-level |Q(v)-Q^2(v)|, Float64 max:', vd.toExponential(3));
setMatrixArrayType(Float32Array);

// ---- bit reproducibility ----
const Qb=mat4.create();
mat4.obliqueFromQuad(Qb,quad[0],quad[1],quad[2],quad[3],null);
console.log('\nbit-identical repeated build:', mat4.exactEquals(Q,Qb));

// ---- plane fixed point ----
console.log('section vertex maps to itself:', JSON.stringify(f3(ndc(clip(Q,sectionVertex)))));

// ---- failure paths ----
const cases=[
  ['zero normal',       ()=>mat4.obliqueFromPlane(mat4.create(),[0,0,0],p0,null)],
  ['zero projector',    ()=>mat4.obliqueFromPlane(mat4.create(),normal,p0,[0,0,0])],
  ['parallel projector',()=>mat4.obliqueFromPlane(mat4.create(),normal,p0,[1,0,0])],
  ['collinear quad',    ()=>mat4.obliqueFromQuad(mat4.create(),[0,0,0],[1,0,0],[2,0,0],[0,1,0],null)],
  ['duplicate p0=p1',   ()=>mat4.obliqueFromQuad(mat4.create(),[0,0,0],[0,0,0],[0,1,0],[1,1,0],null)],
  ['non-coplanar quad', ()=>mat4.obliqueFromQuad(mat4.create(),[0,0,0],[1,0,0],[0,1,0],[0,0,1],null)],
];
console.log('\n=== failure paths ===');
for(const [name,fn] of cases){
  try{fn();console.log(name.padEnd(20),'NO THROW (BUG)');}
  catch(e){console.log(name.padEnd(20),'throws:',e.message);}
}
