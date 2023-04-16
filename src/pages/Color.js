import React, { useEffect, useState } from 'react';
import { InlineMath } from 'react-katex';
import AnimatedPage from './components/AnimatedPage';


function Color() {
  return (
    <>
    <AnimatedPage>
    <div className='colorbox'>
        <div className='color X'><div>#FFA500</div><div><InlineMath math="X"/></div></div>
        <div className='color C1'><div>#87CEEB</div><div><InlineMath math="C_1"/></div></div>
        <div className='color C2'><div>#D56EFF</div><div><InlineMath math="C_2"/></div></div>
        <div className='color C3'><div>#7FFF00</div><div><InlineMath math="C_3"/></div></div>
        <div className='color C4'><div>#FFFF00</div><div><InlineMath math="C_4"/></div></div>
    </div>
    </AnimatedPage>
    </>
  );
}




export default Color;