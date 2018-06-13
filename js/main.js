
class Wrap extends React.Component{
  render(){
    return <div className='wrap' onLoad={this.checkArrDisable.bind(this)}>
      <div className="navigation">
        <Arrow director='left'/>
        <Arrow director='right'/>
      </div>            
      <div className='image'><Imagebox data={info.image}/></div>
      <div className='content'><ElementBox data={info.content}/></div>
    </div>;
  }
  checkArrDisable(){
    checkDisable(0);
  }
}
class Arrow extends React.Component{
  constructor(props){
    super(props);
  }
  changeActive(){
    store.dispatch({type:this.props.director});
  }
  render(){
    return <div onClick={this.changeActive.bind(this)} className={'arrow-'+this.props.director}></div>
  }
}
class Imagebox extends React.Component{

  render(){
    let data = this.props.data;  
    let imgList = data.map((item,index)=>{
 // <div key={index} className={this.state.class}><img src={item}/></div>;
     return <Img key={index} index={index} item={item} />;
    });

    return imgList;
  } 
}
class Img extends React.Component{
  constructor(props){
    super(props);    
    this.state = store.getState().initClass[props.index];       
  }
  render(){
    return <div className={this.state.class}><img src={this.props.item} /></div>;
  }
  refresh(){
    this.setState(store.getState().initClass[this.props.index]);
  }
  componentDidMount(){
    store.subscribe(this.refresh.bind(this));
  }
}
class ElementBox extends React.Component{
  render(){
    let data = this.props.data;
    let contentList = data.map((item,index)=>(
      <Element key={index} item={item} index={index}/>
    ));
    return contentList;
  }
}
class Element extends React.Component{
  constructor(props){
    super(props);    
    this.state = store.getState().initClass[props.index];;
    
  }
  render(){

   return <div id={this.props.item.color} key={this.props.index} className={this.state.class}>
        <div className='page'></div>
        <div className="text">
          <div className="title">{this.props.item.title}</div>
          <div className="skill">{this.props.item.skill}</div>
          <div className="description">{this.props.item.description}</div>
          <div className="link"><a href={this.props.item.href} target="_blank">DEMO</a></div>            
        </div>      
      </div>;
  }
  refresh(){
    this.setState(store.getState().initClass[this.props.index]);
  }
  componentDidMount(){
    store.subscribe(this.refresh.bind(this));
  }  
}
let store;
let reducer = function (state,action){
    let i =0;
    let newState = state;  
    let setClass = function(director){
      let stateLength = state.initClass.length;
      for(i=0;i<stateLength;i++){
        if(state.initClass[i].class.indexOf('works active') !== -1){
           newState.initClass[i] = {class: 'works'};
          if(director === 'left'){
            checkDisable(i-1);
            newState.initClass[i-1] = {class: 'works active'};
          }else if(director === 'right'){
            newState.initClass[i+1] = {class: 'works active'};
            checkDisable(i+1);
          }
          break;
        }
      }    
  }

  switch(action.type){
    case 'left':
      setClass('left');
      return newState;    
    case 'right':
      setClass('right');
      return newState;              
    default:
      return state;
  }
}
function checkDisable(i){
  let al = document.querySelector('.arrow-left');
  let ar = document.querySelector('.arrow-right');

  if (i - 1 < 0) {
    al.classList.add('disabled');
  }else if(al.classList.contains('disabled')=== true){
    al.classList.remove('disabled');
  }

  if (i + 1 >= infoLenth) {
    ar.classList.add('disabled');
  }else if(ar.classList.contains('disabled')=== true){
    ar.classList.remove('disabled');
  }
}
let storeClass = [];
let infoLenth = info.image.length;
for(let i= 0;i<infoLenth;i++){
  i===0?storeClass.push({class:'works active'}):storeClass.push({class:'works'});
}
store = Redux.createStore(reducer,{initClass:storeClass});
window.addEventListener("load", ()=>{
  ReactDOM.render(<Wrap />,document.querySelector('#main'));
 });