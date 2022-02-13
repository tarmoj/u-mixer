import * as Tone from "tone"
//import sound from "./Arpege.mp3";
import {useState, useEffect, useRef} from "react";



// see example: https://github.com/Tonejs/Tone.js/blob/dev/examples/mixer.html

// make tone.js elements live outside of react component



const ChannelControl = ({name, soundFile, stopped}) => { // props: name, source, isMuted, isSolo



    const [player, setPlayer] = useState(null);
    const [channel, setChannel] = useState(null);
    //const [soloed, setSoloed] = useState(false);
    //const [muted, setMuted] = useState(false)


    useEffect(() => {
            console.log("Create player for: ", soundFile);

            if (player===null) {

                const source = process.env.PUBLIC_URL + "/sounds/" + soundFile;
                const channel = new Tone.Channel(0, -0.5).toDestination();
                const player = new Tone.Player({
                    url: source,
                    loop: true,
                    onload: () => console.log("Local onload -  loaded", name, soundFile)
                }).sync().start(0);
                player.connect(channel);

                setChannel(channel);
                setPlayer(player);
            }
    }, []);

    // real stopping does not work though....
    useEffect(
        () => {
            console.log("Stopped:", stopped);
            // if (player) {
            //     if (stopped)
            //         player.stop();
            //     else
            //         player.start();
            // }
        },
        [stopped]
    );

    const setVolume = (event) => {
        const volume = event.target.value;
        console.log(volume);
        if (channel) {
            if (!channel.muted) channel.set({volume: volume }); // otherwise changing the channel volume will open the channel in muted state
        }
        //TODO: we need state variable to carry volume probably later also prop to control it from outside...
    }

    const setPan = (event) => {
        const pan = event.target.value;
        console.log(pan);
        if (channel) channel.set({pan: pan });
    }

    const handleMuted = (event) => {
        const mute = event.target.checked;
        console.log(mute);
        if (channel) channel.set({mute: mute });
        //TODO: kui muuta slaiderit mute ajal, siis peaks mutist lahti võtmine panema channel.volume slaideri väärtuse peale
        //setMuted(mute);
    }

    const handleSolo = (event) => {
        const solo = event.target.checked;
        console.log(solo);
        if (channel) channel.set({solo: solo });
        //setSoloed(solo);
    }


    return (
        <div>
            <div>
                {name}
            </div>
            <div>
                Volume: <Slider  orientation={"vertical"} sx={{height: 60 }}  defaultValue={0}  min={-40} max={12} onChange={setVolume} />
            </div>
            <div>
                Pan: <Slider sx={{width:40}}  min={-1} max={1} step={0.05} type={"range"} onInput={setPan} />
            </div>
            <div>
                Mute: <Checkbox onChange={ handleMuted } />
                Solo: <Checkbox onChange={ handleSolo } />
            </div>

        </div>
    );
}


ChannelControl.defaultProps = {
  name: "üks",
  source:  process.env.PUBLIC_URL+"/sounds/Arpege.mp3",
  stopped: true
};

export default ChannelControl;
