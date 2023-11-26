import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import './Hero.css'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

    let navigate = useNavigate();

    const [id, setId] = useState(-1);

    const radioBtnClick=(val)=>{
        setId(val);
    }
    const btnOnClick=()=>{
        if(id===1){
            navigate('/workspace1');
        }else if(id===2){
            navigate('/workspace3')
        }else{
            navigate('/workspace2')
        }
    }
    const templateLinks = ["https://i.postimg.cc/7P00HmYt/image.png", "https://i.postimg.cc/8zjC5zmk/image.png", "https://i.postimg.cc/BvRpybMj/image.png"]
    return (
        <div className='hero-wrapper'>
            <h1 className='hero__heading'>
                Choose a template for your new{' '}
                <span style={{ color: 'hotpink', fontWeight: 'bolder' }}>
                    <Typewriter
                        words={['Romance', 'Thriller', 'Action', 'Comedy', 'Fantasy']}
                        loop={99}
                        cursor
                        cursorStyle='_'
                        typeSpeed={70}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />
                </span>
                {' '}comic
            </h1>
            <div className='hero__body'>
                <ul>
                    {templateLinks.map((val, index)=>(
                        <li key={index}>
                            <input type="radio" name="test" id={`cb${index+1}`} onClick={()=>radioBtnClick(index+1)}/>
                            <label htmlFor={`cb${index+1}`} className='hero_body_label'>
                                <figure>
                                    <img src={val} alt="template-design" />
                                </figure>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            {id>0?(<button className='hero__btn' onClick={btnOnClick}>Proceed</button>):(
                <button className='hero__btn' style={{cursor:"no-drop", backgroundColor:"gray"}}>Proceed</button>
            )}
        </div>
    )
}

export default Hero