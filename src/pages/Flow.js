import AnimatedPage from './components/AnimatedPage';
  
function generateSplits(arr) {
  let res = [];

  // combi
  for (let i = 1; i < (2<<(arr.length-1))-1; i++) {
    let l = []
    let r = []
    for (let j = 0; j < arr.length; j++) {
      let bit = 1<<j; // the number for a true value on the j'th bit
      console.log(i,j,bit)
      if (i&bit){
        l.push(arr[j])
      }else{
        r.push(arr[j])
      }
    }
    res.push([l,r])
  }
  return res
}

function Flow() {

  function SplitLine(props) {
    const { arr } = props;
    return (<>
        <div>A: [{arr[0].join(', ')}]</div>
        <div>B: [{arr[1].join(', ')}]</div>
      </>
    )
  }

  let splits = generateSplits([1,2,3,4,5,6,7,8]);

  return (
    <>
    <AnimatedPage>

      <div className='sidebar'>
      {splits.map((item, index) => (
        <SplitLine key={index} arr={item} />
      ))}
      </div>
      <div className='content'>
      <div id="cy" className="cy"></div>
      </div>
    </AnimatedPage>

    </>
  );
}

export default Flow;