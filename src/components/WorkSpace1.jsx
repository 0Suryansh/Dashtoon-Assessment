import React, { useState, useRef, useEffect, useCallback } from 'react'
import './WorkSpace1.css'
import { toastStyle } from "../utility/helper";
import toast from 'react-hot-toast';
import { Typewriter } from 'react-simple-typewriter';
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { SpeechBubble } from './SpeechBubble';
import { ItemTypes } from '../utility/ItemTypes';
import { v4 as uuidv4 } from 'uuid';


const WorkSpace1 = ({ hideSourceOnDrag }) => {
    const [w3open, setW3open] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [checked, setChecked] = useState(false);
    const [images, setImages] = useState([]);
    const [prompts, setPrompts] = useState({
        prompt1: "",
        prompt2: "",
        prompt3: "",
        prompt4: "",
        prompt5: "",
        prompt6: "",
        prompt7: "",
        prompt8: "",
        prompt9: "",
        prompt10: ""
    })

    const dialogRef = useRef(null);

    useEffect(() => {
        if (generated) {
            return
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [generated]);

    const arePromptsEmpty = () => {
        for (const key in prompts) {
            if (prompts[key] === "") {
                return true;
            }
        }
        return false;
    };

    const handleClickGeneratingBtnF = () => {
        setW3open(!w3open);
    };

    async function query(data) {
        const response = await fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
                headers: {
                    "Accept": "image/png",
                    "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.blob();
        return result;
    }

    const handleClickGeneratingBtnS = async () => {
        if (arePromptsEmpty()) {
            toast.error('Please fill in all prompts before submitting', { ...toastStyle.error });
            return
        }
        setGenerated(true)
        setImages([])
        const inputs = Object.values(prompts);
        try {
            await Promise.all(inputs.map(async (input) => {
                try {
                    const response = await query({ "inputs": input });
                    setImages((prevImages) => [...prevImages, response]);
                } catch (error) {
                    toast.error('Error in one or more requests. Please Check Networks Tab', { ...toastStyle.error });
                }
            }));
        } catch (error) {
            toast.error('Error in one or more requests. Please Check Networks Tab.', { ...toastStyle.error });
        } finally {
            setGenerated(false);
            setW3open(false)
        }

    }

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setPrompts({ ...prompts, [name]: value });

    };

    const handleClickOutside = (event) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target)) {
            setW3open(false);
        }
    };

    const fillPromptsFromArray = (values) => {
        const filledPrompts = {};
        for (let i = 0; i < 10; i++) {
            const promptKey = `prompt${i + 1}`;
            filledPrompts[promptKey] = values[i] || "";
        }

        setPrompts(filledPrompts);
    };

    const handleCheckChange = () => {
        const exampleArray = [
            "A weathered, abandoned carousel in the midst of an overgrown, forgotten amusement park",
            "A mysterious, ornate key lying in the grass near the carousel", "A faded map with cryptic symbols and a marked path leading away from the carousel", "A crumbling clock tower, its hands forever frozen at midnight, visible in the distance on the map", "A dense forest with trees that appear to be whispering secrets, hinting at hidden truths", "An old, leather-bound journal discovered beneath the trees, filled with sketches and mysterious notes", "A broken telescope near a clearing in the woods, suggesting someone was searching the skies", "A mesmerizing night sky filled with constellations, mirroring a sketch in the forgotten journal", "A shimmering portal that seems to connect the stars above with the clearing below, hinted at in the telescope's broken lens", "A stone statue resembling a guardian with a raised hand, standing at the entrance of the clearing, as if protecting the portal"];
        if (!checked) {
            fillPromptsFromArray(exampleArray);
        } else {
            setPrompts({
                prompt1: "",
                prompt2: "",
                prompt3: "",
                prompt4: "",
                prompt5: "",
                prompt6: "",
                prompt7: "",
                prompt8: "",
                prompt9: "",
                prompt10: ""
            });
        }
        setChecked(!checked)
    }

    const [boxes1, setBoxes1] = useState({});
    const moveBox1 = useCallback(
        (id, left, top) => {
            setBoxes1(
                update(boxes1, {
                    [id]: {
                        $merge: { left, top }
                    }
                })
            );
        },
        [boxes1, setBoxes1]
    );
    const [, drop1] = useDrop(
        () => ({
            accept: ItemTypes.BOX,
            drop(item, monitor) {
                const { x, y } = monitor.getDifferenceFromInitialOffset();
                const left = Math.round(item.left + x);
                const top = Math.round(item.top + y);
                moveBox1(item.id, left, top);
                return undefined;
            }
        }),
        [moveBox1]
    );

    const addBox1 = () => {
        const newBoxKey = uuidv4();
        const newBox = { top: 100, left: 100, title: "Write your dialog..." };
        setBoxes1(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
      };

      const deleteLastBox1 = () => {
        const boxKeys = Object.keys(boxes1);    
        if (boxKeys.length > 0) {
          const newBoxes = { ...boxes1 };
          delete newBoxes[boxKeys[boxKeys.length - 1]];
            setBoxes1(newBoxes);
        }
      };
    

      const [boxes2, setBoxes2] = useState({});
      const moveBox2 = useCallback(
          (id, left, top) => {
              setBoxes2(
                  update(boxes2, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes2, setBoxes2]
      );
      const [, drop2] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox2(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox2]
      );
  
      const addBox2 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes2(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox2 = () => {
            const boxKeys = Object.keys(boxes2);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes2 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes2(newBoxes);
            }
          };


        const [boxes3, setBoxes3] = useState({});
      const moveBox3 = useCallback(
          (id, left, top) => {
              setBoxes3(
                  update(boxes3, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes3, setBoxes3]
      );
      const [, drop3] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox3(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox3]
      );
  
      const addBox3 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes3(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };

        const deleteLastBox3 = () => {
            const boxKeys = Object.keys(boxes3);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes3 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes3(newBoxes);
            }
          };


        const [boxes4, setBoxes4] = useState({});
      const moveBox4 = useCallback(
          (id, left, top) => {
              setBoxes4(
                  update(boxes4, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes4, setBoxes4]
      );
      const [, drop4] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox4(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox4]
      );
  
      const addBox4 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes4(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox4 = () => {
            const boxKeys = Object.keys(boxes4);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes4 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes4(newBoxes);
            }
          };

        const [boxes5, setBoxes5] = useState({});
      const moveBox5 = useCallback(
          (id, left, top) => {
              setBoxes5(
                  update(boxes5, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes5, setBoxes5]
      );
      const [, drop5] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox5(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox5]
      );
  
      const addBox5 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes5(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox5 = () => {
            const boxKeys = Object.keys(boxes5);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes5 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes5(newBoxes);
            }
          };
        const [boxes6, setBoxes6] = useState({});
      const moveBox6 = useCallback(
          (id, left, top) => {
              setBoxes6(
                  update(boxes6, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes6, setBoxes6]
      );
      const [, drop6] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox6(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox6]
      );
  
      const addBox6 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes6(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox6 = () => {
            const boxKeys = Object.keys(boxes6);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes6 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes6(newBoxes);
            }
          };
        const [boxes7, setBoxes7] = useState({});
      const moveBox7 = useCallback(
          (id, left, top) => {
              setBoxes7(
                  update(boxes7, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes7, setBoxes7]
      );
      const [, drop7] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox7(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox7]
      );
  
      const addBox7 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes7(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox7 = () => {
            const boxKeys = Object.keys(boxes7);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes7 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes7(newBoxes);
            }
          };
        const [boxes8, setBoxes8] = useState({});
      const moveBox8 = useCallback(
          (id, left, top) => {
              setBoxes8(
                  update(boxes8, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes8, setBoxes8]
      );
      const [, drop8] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox8(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox8]
      );
  
      const addBox8 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes8(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox8 = () => {
            const boxKeys = Object.keys(boxes8);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes8 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes8(newBoxes);
            }
          };
        const [boxes9, setBoxes9] = useState({});
      const moveBox9 = useCallback(
          (id, left, top) => {
              setBoxes9(
                  update(boxes9, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes9, setBoxes9]
      );
      const [, drop9] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox9(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox9]
      );
  
      const addBox9 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes9(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox9 = () => {
            const boxKeys = Object.keys(boxes9);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes9 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes9(newBoxes);
            }
          };
        const [boxes10, setBoxes10] = useState({});
      const moveBox10 = useCallback(
          (id, left, top) => {
              setBoxes10(
                  update(boxes10, {
                      [id]: {
                          $merge: { left, top }
                      }
                  })
              );
          },
          [boxes10, setBoxes10]
      );
      const [, drop10] = useDrop(
          () => ({
              accept: ItemTypes.BOX,
              drop(item, monitor) {
                  const { x, y } = monitor.getDifferenceFromInitialOffset();
                  const left = Math.round(item.left + x);
                  const top = Math.round(item.top + y);
                  moveBox10(item.id, left, top);
                  return undefined;
              }
          }),
          [moveBox10]
      );
  
      const addBox10 = () => {
          const newBoxKey = uuidv4();
          const newBox = { top: 100, left: 100, title: "Write your dialog..." };
          setBoxes10(prevBoxes => ({ ...prevBoxes, [newBoxKey]: newBox }));
        };
        const deleteLastBox10 = () => {
            const boxKeys = Object.keys(boxes10);    
            if (boxKeys.length > 0) {
              const newBoxes = { ...boxes10 };
              delete newBoxes[boxKeys[boxKeys.length - 1]];
                setBoxes10(newBoxes);
            }
          };

    return (
        <>
            <div className="workspace3__header">
                <h2>
                    Generate your own Comic 👇
                </h2>
                <button className="workspace3__btn" style={w3open ? { visibility: 'hidden' } : { display: 'inline' }} onClick={() => handleClickGeneratingBtnF(w3open)}>
                    Generate
                </button>
                <p style={{color:"white"}}>(Hover on any Comic Panel to add Speech Bubbles)</p>
                {w3open &&
                    <div className="workspace3__dialog" ref={dialogRef}>
                        {!generated && <div>
                            <h2>Fill in the prompts to make your Comic</h2>
                            <input type="checkbox" checked={checked} onChange={handleCheckChange} name="checkbox"/>
                            <span>Fill Dummy Data</span>
                            <div className="workspace3__dialog__htmlForm">
                                <div className="workspace3__dialog__htmlForm__row">
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 1" name="prompt1" id='prompt1' value={prompts.prompt1} onChange={handleInputChange} />
                                        <label htmlFor="prompt1" className="htmlForm__label">Prompt 1</label>
                                    </div>
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 2" name="prompt2" id='prompt2' value={prompts.prompt2} onChange={handleInputChange} />
                                        <label htmlFor="prompt2" className="htmlForm__label">Prompt 2</label>
                                    </div>
                                </div>
                                <div className="workspace3__dialog__htmlForm__row">
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 3" name="prompt3" id='prompt3' value={prompts.prompt3} onChange={handleInputChange} />
                                        <label htmlFor="prompt3" className="htmlForm__label">Prompt 3</label>
                                    </div>
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 4" name="prompt4" id='prompt4' value={prompts.prompt4} onChange={handleInputChange} />
                                        <label htmlFor="prompt4" className="htmlForm__label">Prompt 4</label>
                                    </div>
                                </div>
                                <div className="workspace3__dialog__htmlForm__row">
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 5" name="prompt5" id='prompt5' value={prompts.prompt5} onChange={handleInputChange} />
                                        <label htmlFor="prompt5" className="htmlForm__label">Prompt 5</label>
                                    </div>
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 6" name="prompt6" id='prompt6' value={prompts.prompt6} onChange={handleInputChange} />
                                        <label htmlFor="prompt6" className="htmlForm__label">Prompt 6</label>
                                    </div>
                                </div>
                                <div className="workspace3__dialog__htmlForm__row">
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 7" name="prompt7" id='prompt7' value={prompts.prompt7} onChange={handleInputChange} />
                                        <label htmlFor="prompt7" className="htmlForm__label">Prompt 7</label>
                                    </div>
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 8" name="prompt8" id='prompt8' value={prompts.prompt8} onChange={handleInputChange} />
                                        <label htmlFor="prompt8" className="htmlForm__label">Prompt 8</label>
                                    </div>
                                </div>
                                <div className="workspace3__dialog__htmlForm__row">
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 9" name="prompt9" id='prompt9' value={prompts.prompt9} onChange={handleInputChange} />
                                        <label htmlFor="prompt9" className="htmlForm__label">Prompt 9</label>
                                    </div>
                                    <div className="htmlForm__group field">
                                        <input type="input" className="htmlForm__field" placeholder="Prompt 10" name="prompt10" id='prompt10' value={prompts.prompt10} onChange={handleInputChange} />
                                        <label htmlFor="prompt10" className="htmlForm__label">Prompt 10</label>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {generated &&
                            <div className="workspace3__dialog__loading__parent">
                                <div className="workspace3__dialog__loading">
                                </div>
                            </div>
                        }
                        {!generated ? (
                            <button className="workspace3__btn" style={{ marginTop: "32px" }} onClick={handleClickGeneratingBtnS}>
                                Generate
                            </button>
                        ) : (
                            <h2 style={{ color: 'hotpink', fontWeight: 'bolder' }}>
                                <Typewriter
                                    words={['Generating...', 'Loading...']}
                                    loop={99}
                                    cursor
                                    cursorStyle='😼'
                                    typeSpeed={70}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                            </h2>
                        )}
                    </div>}
            </div>
            <article className="comic">
                {images.length > 0 ? images.map((imageUrl, index) => (
                    <div
                        key={index}
                        className="panel"
                        style={{ backgroundImage: `url(${URL.createObjectURL(imageUrl)})` }}
                        ref={eval(`drop${index+1}`)}
                    >
                        <button className='speech__btn' onClick={eval(`addBox${index+1}`)}>Add speechBox</button>
                        {Object.keys(eval(`boxes${index+1}`)).length>0?(
                                <button className='speech__btn__delete' onClick={eval(`deleteLastBox${index+1}`)}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(eval(`boxes${index+1}`)).map((key) => {
                                const { left, top, title } = eval(`boxes${index+1}`)[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                    </div>
                )) : (
                    <>
                        <div className="panel" ref={drop1}>
                            <button className='speech__btn' onClick={addBox1}>Add speechBox</button>
                            {Object.keys(boxes1).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox1}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes1).map((key) => {
                                const { left, top, title } = boxes1[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop2}>
                        <button className='speech__btn' onClick={addBox2}>Add speechBox</button>
                        {Object.keys(boxes2).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox2}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes2).map((key) => {
                                const { left, top, title } = boxes2[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop3}>
                        <button className='speech__btn' onClick={addBox3}>Add speechBox</button>
                        {Object.keys(boxes3).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox3}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes3).map((key) => {
                                const { left, top, title } = boxes3[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop4}>
                        <button className='speech__btn' onClick={addBox4}>Add speechBox</button>
                        {Object.keys(boxes4).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox4}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes4).map((key) => {
                                const { left, top, title } = boxes4[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop5}>
                        <button className='speech__btn' onClick={addBox5}>Add speechBox</button>
                        {Object.keys(boxes5).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox5}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes5).map((key) => {
                                const { left, top, title } = boxes5[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop6}>
                        <button className='speech__btn' onClick={addBox6}>Add speechBox</button>
                        {Object.keys(boxes6).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox6}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes6).map((key) => {
                                const { left, top, title } = boxes6[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop7}>
                        <button className='speech__btn' onClick={addBox7}>Add speechBox</button>
                        {Object.keys(boxes7).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox7}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes7).map((key) => {
                                const { left, top, title } = boxes7[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop8}>
                        <button className='speech__btn' onClick={addBox8}>Add speechBox</button>
                        {Object.keys(boxes8).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox8}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes8).map((key) => {
                                const { left, top, title } = boxes8[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop9}>
                        <button className='speech__btn' onClick={addBox9}>Add speechBox</button>
                        {Object.keys(boxes9).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox9}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes9).map((key) => {
                                const { left, top, title } = boxes9[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                        <div className="panel" ref={drop10}>
                        <button className='speech__btn' onClick={addBox10}>Add speechBox</button>
                        {Object.keys(boxes10).length>0?(
                                <button className='speech__btn__delete' onClick={deleteLastBox10}>Delete Last speechBox</button>
                            ):(null)}
                            {Object.keys(boxes10).map((key) => {
                                const { left, top, title } = boxes10[key];
                                return (
                                <SpeechBubble
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </SpeechBubble>
                                );
                            })}
                        </div>
                    </>
                )}
            </article>
        </>
    )
}
export default WorkSpace1