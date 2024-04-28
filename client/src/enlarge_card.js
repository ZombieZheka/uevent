const CardDesc = (props) => {
    return (props.trigger) ? ( 
        <div className='card_desc'>
            <div className='popup-body'>
            
            <img src="https://cdn-icons-png.flaticon.com/512/390/390914.png" className='close-btn' onClick = {()=>{
                    props.setTrigger(false);
                }} alt = "close"/>


                {props.children}
            </div>
        </div>
    ) : '';
}
 
export default CardDesc;