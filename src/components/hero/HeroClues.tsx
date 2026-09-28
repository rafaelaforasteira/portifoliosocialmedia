export function HeroClues() {
  return <div className="clues" aria-hidden="true" data-depth="5">
    <svg className="clue-map" viewBox="0 0 1440 900" preserveAspectRatio="none"><g fill="none" stroke="currentColor" strokeWidth=".65"><path d="M0 260H165L300 145H640M885 100V182L1120 300H1440M55 680H185L315 795H890L1110 590H1390" /><path strokeDasharray="3 8" d="M230 0V900M1210 0V900M0 450H1440"/><circle cx="1110" cy="590" r="65"/><circle cx="1110" cy="590" r="4"/><circle cx="300" cy="145" r="4"/><path d="M1086 590h48m-24-24v48M1200 190h20m-10-10v20M640 135v20m-10-10h20"/></g></svg>
    <span className="clue-label clue-a">[ 01 — 03 ]</span><span className="clue-label clue-b">ESTRATÉGIA<br /><i />CONEXÃO</span><span className="clue-label clue-c">23° 33′ S &nbsp; 46° 38′ W</span>
    <span className="target"><i /><i /><i /><i /></span>
  </div>;
}
