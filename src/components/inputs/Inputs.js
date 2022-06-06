import React, {useEffect, useState} from "react" 
import { Button, TextField, FormControl, Input, CircularProgress } from "@mui/material"
import "./Inputs.scss"
import qrPlaceholder from "../../media/qr-placeholder.svg"
import CardInputs from "../CardInputs/CardInputs"
import StickerInputs from "../StickerInputs/StickerInputs"
import { HexColorPicker } from "react-colorful";

export default function Inputs(props) {
    const {cardData, setCardData, page} = props

    const [loading, setLoading] = useState(false)
    const [qrColor, setQrColor] = useState(cardData.qrColor)
    const [backgroundColor, setBackgroundColor] = useState(cardData.background)
    const [created, setCreated] = useState(false)


    useEffect(() => {
        fetchData()
    }, [])


    
    function colorChange() {
        document.querySelector('path').style.fill = qrColor
        document.querySelector('rect').style.fill = backgroundColor
    }

    useEffect(()=>{
        setCardData({...cardData, qrCode: qrPlaceholder, qrColor: qrColor})
        if (created) {
            colorChange()
        }
    }, [qrColor]
    )

    useEffect(()=>{
        setCardData({...cardData, qrCode: qrPlaceholder, background: backgroundColor})
        if (created) {
            colorChange()
        }
    }, [backgroundColor]
    )

    function fetchData() {
        fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cardData.url}&bgcolor=${cardData.background.substring(1)}&color=${cardData.qrColor.substring(1)}&format=svg`)
            .then(res => res.text())
            .then(response => {
                setCreated(true)
                const holder = document.createElement('div')
                holder.innerHTML = response
                document.getElementById('qr-holder').innerHTML = ""
                document.getElementById('qr-holder').append(holder)
                setLoading(false)
            })
            .catch(console.log("Request not recieved"))
    }
    

    function formSubmit(e) {
        setLoading(true)
        e.preventDefault()
        fetchData()
    }

    function handleChange(e){
        setCardData({...cardData, [e.target.name]: e.target.value})
    }

    function imageUpload(e){
        const imageUrl = URL.createObjectURL(e.target.files[0])
        setCardData({...cardData, image: imageUrl})
    }

    function colorInputsAndSubmit(){
        return (
            <>  
                <div className="color-pickers">
                    <div className="color-picker">
                        <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                        <p>Background</p>
                    </div>
                    <div className="color-picker">
                        <HexColorPicker color={qrColor} onChange={setQrColor} />
                        <p>Qr Code</p>
                    </div>
                </div>
                <Button className="Button" sx={{ mt: 1, width: "100%", background: cardData.qrColor}} variant="contained" type="submit" onClick={formSubmit}>Generate Qr Code</Button>
                {loading && <CircularProgress />}
            </>
        )
    }

    function urlInput(){
        return <TextField autoComplete='off' value={cardData.url} sx={{ my: 1, mr: 1, width: "100%" }} size="small" label="Url" variant="outlined" name="url" onChange={handleChange}/>
    }

    return (
        <>
            {page === "welcome" ? 
            <>
            {urlInput()}
            {colorInputsAndSubmit()}
            </> :
            <div id="right">
                <FormControl id="form" onSubmit={formSubmit}>
                    <div id="inputs">
                        <h2 id="username">Customize Card</h2>
                        <TextField autoComplete='off' sx={{ my: 1, mr: 1 }} size="small" label="Url" variant="outlined" name="url" onChange={handleChange}/>
                        {page === "card" && <CardInputs handleChange={handleChange} imageUpload={imageUpload}/>}
                        {page === "sticker" && <StickerInputs handleChange={handleChange} />}
                        {colorInputsAndSubmit()}
                    </div>
                </FormControl>
            </div>} 
        </>
        
    )
}