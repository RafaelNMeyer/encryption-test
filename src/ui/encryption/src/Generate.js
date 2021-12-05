import styled from "styled-components"
import { useState } from "react"
import axios from "axios"
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import './fonts.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Generate() {

    const [selectedFile, setSelectedFile] = useState();
    const [option, setOption] = useState("SHA-256");
    const [sha256, setSha256] = useState("");
    const [bits, setBits] = useState(1024);
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [link, setLink] = useState("");
    const [pass, setPass] = useState("");
    const [decoded, setDecoded] = useState("");
    const [copiedPublic, setCopiedPublic] = useState(false);
    const [copiedPrivate, setCopiedPrivate] = useState(false);
    const [CopiedSha256, setCopiedSha256] = useState(false);
    const [CopiedBase64, setCopiedBase64] = useState(false);

    const selectFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const sendFile = () => {
        const formData = new FormData();
        formData.append('File', selectedFile);
        const request = axios.post("http://127.0.0.1:5000/send", formData)
        request.then(r => {
            setTimeout(() => {

            }, 1000)
            setSha256(r.data)
        })
        request.catch()
        resetCopy()
    };

    const changeRadio = (changeEvent) => {
        setOption(changeEvent.target.value)
    };

    const changeBits = (changeEvent) => {
        setBits(changeEvent.target.value)
    };
    const rsa = () => {
        const request = axios.post("http://127.0.0.1:5000/rsa", { bits: bits })
        request.then(r => {
            setTimeout(() => {

            }, 1000)
            setPublicKey(r.data['publicKey'])
            setPrivateKey(r.data['privateKey'])
        })
        request.catch()
        resetCopy()
    };
    const changeLink = (changeEvent) => {
        setLink(changeEvent.target.value)
    }; const changePass = (changeEvent) => {
        setPass(changeEvent.target.value)
    };
    const decode = () => {
        const request = axios.post("http://127.0.0.1:5000/decode", { link: link, password: pass })
        request.then(r => {
            setTimeout(() => {
            }, 1000)
            setDecoded(r.data)
        })
        request.catch()
        resetCopy()
    };

    const resetCopy = () => {
        setCopiedPublic(false)
        setCopiedPrivate(false)
        setCopiedSha256(false)
        setCopiedBase64(false)
    }

    const copyPublic = () => {
        setCopiedPublic(true)
        setCopiedPrivate(false)
        setCopiedSha256(false)
        setCopiedBase64(false)
    }
    const copyPrivate = () => {
        setCopiedPrivate(true)
        setCopiedPublic(false)
        setCopiedSha256(false)
        setCopiedBase64(false)
    }
    const copySha256 = () => {
        setCopiedSha256(true)
        setCopiedPublic(false)
        setCopiedPrivate(false)
        setCopiedBase64(false)
    }
    const copyBase64 = () => {
        setCopiedBase64(true)
        setCopiedSha256(false)
        setCopiedPublic(false)
        setCopiedPrivate(false)
    }


    return (
        <Container>
            <Div>
                <FormControl>
                    <RadioGroup row value={option}>
                        <FormControlLabel value="SHA-256" control={<Radio onChange={changeRadio} />} label="SHA-256" />
                        <FormControlLabel value="RSA" control={<Radio onChange={changeRadio} />} label="RSA" />
                        <FormControlLabel value="BASE64" control={<Radio onChange={changeRadio} />} label="BASE64" />
                    </RadioGroup>
                </FormControl>

                {option === "SHA-256" ?
                    <Wrapper>
                        <Label htmlFor="archive">{selectedFile ? selectedFile.name : "Choose file"}</Label>
                        <Input id="archive" type="file" onChange={selectFile}></Input>
                        <Button onClick={sendFile}>Encrypt file</Button>
                        {sha256 ?
                            [<CopyToClipboard key='copy-sha256' text={sha256.trim()}
                                onCopy={copySha256}>
                                <Button key='copy-sha256-button' style={CopiedSha256 ? { color: "red" } : { color: "black" }}>
                                    {CopiedSha256 ? 'Copied!' : 'Copy resume'}
                                </Button>

                            </CopyToClipboard>,
                            <Result key='copy-sha256-result'>{sha256}</Result>] : null}

                    </Wrapper> : null}

                {option === "RSA" ?
                    <Wrapper>
                        <FormControl>
                            <RadioGroup row value={bits}>
                                <FormControlLabel value="1024" control={<Radio onChange={changeBits} />} label="1024" />
                                <FormControlLabel value="2048" control={<Radio onChange={changeBits} />} label="2048" />
                            </RadioGroup>
                        </FormControl>
                        <Button onClick={rsa}>Generate key pair</Button>
                        {privateKey ?
                            [<H1 key='private-h1'>Private Key</H1>,

                            <CopyToClipboard key='copy-private' text={privateKey.trim()}
                                onCopy={copyPrivate}>
                                <Button key='copy-private-button' style={copiedPrivate ? { color: "red" } : { color: "black" }}>
                                    {copiedPrivate ? 'Copied!' : 'Copy Private Key'}
                                </Button>

                            </CopyToClipboard>,

                            <Result key='private-result'>
                                <P key='private-p'>{privateKey}</P>
                            </Result>] : null}

                        {publicKey ?
                            [<H1 key='public-h1'>Public Key</H1>,
                            <CopyToClipboard key='copy-public' text={publicKey.trim()}
                                onCopy={copyPublic}>
                                <Button key='copy-public-button' style={copiedPublic ? { color: "red" } : { color: "black" }}>
                                    {copiedPublic ? 'Copied!' : 'Copy Public Key'}
                                </Button>

                            </CopyToClipboard>,
                            <Result key='public-result'>
                                <P key='public-p'>{publicKey}</P>
                            </Result>] : null}
                    </Wrapper> : null}

                {option === "BASE64" ?
                    <Wrapper>
                        <LabelText htmlFor="link">Insert file link</LabelText>
                        <InputText id="link" type="text" onChange={changeLink}></InputText>

                        <LabelText htmlFor="pass">Insert file password</LabelText>
                        <InputText id="pass" type="text" onChange={changePass}></InputText>

                        <Button onClick={decode}>Decode</Button>

                        {decoded ?
                            [<H1 key='decoded-h1'>Decoded</H1>,
                            <CopyToClipboard key='copy-base64' text={decoded.replace(/[^\x20-\x7E]/g, '').trim()}
                                onCopy={copyBase64}>
                                <Button key='copy-base64-button' style={CopiedBase64 ? { color: "red" } : { color: "black" }}>
                                    {CopiedBase64 ? 'Copied!' : 'Copy decrypted'}
                                </Button>
                            </CopyToClipboard>,
                            <Result key='decoded-result'>
                                <P key='decoded-p'>{decoded.replace(/[^\x20-\x7E]/g, '')}</P>
                            </Result>] : null}

                    </Wrapper> : null}
            </Div>

        </Container>
    )
}
const Container = styled.div`
    min-height: 100vh;
    background: radial-gradient(#f3aca9, #f005df);
    color: white;
    padding: 100px 0;
    box-sizing: border-box;
`;
const Div = styled.div`
    display:flex;
    justify-content: center;
    flex-direction:column;
    align-items:center;
    width: 80%;
    margin: 0 auto;
    font-family: 'Hind', sans-serif;
    border: 3px solid black;
    border-radius: 10px;
    padding-bottom: 10px;
    
`;
const Wrapper = styled.div`
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
    gap:30px;
    margin-top:30px;
    width: 100%;        
`;
const Result = styled.div`
    background: #5c5c5c;
    border-radius: 4px;
    padding: 4px;    
    width: 50%;
    text-align: center;
    word-wrap: break-word;
`;
const P = styled.p`
    line-height: 1.2;
`;
const H1 = styled.h1`
    text-align: center;
    padding: 10px 0;
    font-weight: bold;
    font-size: 20px;
`;
const Input = styled.input`
    display: none;
`;
const InputText = styled.input`
    border-style: none;
    width: 70%;
    height: 10px;
    font-size: 16px;
    font-family: 'Hind';
    font-weight: bold;
    border-radius: 4px;
    padding: 10px;
    &:focus{
        outline: none;
    }
`;
const Label = styled.label`
    cursor: pointer;
    background: lightgrey;
    color: black;
    font-weight: bold;
    padding: 5px;
    border-radius: 4px;
`;
const LabelText = styled.label`
    color: white;
    font-weight: bold;
    font-size: 16px;
`;
const Button = styled.button`
    border: none;
    cursor: pointer;
    border-radius: 5px;
    padding: 10px;
    font-size: 15px;
    font-weight: bold;
    background: white;
    color:black;
`;

