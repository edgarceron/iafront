import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Button, Chip, Divider, TextField } from '@mui/material';
import LinearProgressWithLabel from './LinearProgressWithLevel';
import { Box } from '@mui/system';
import Image from 'mui-image'
import batch from './batch.png';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function FrontPage(){

    const [classLabels, setClassLabels] = React.useState(['grizzly', 'black', 'teddy']);
    const [socketUrl, setSocketUrl] = React.useState('ws://127.0.0.1:8000/ws/server/');
    const [progress, setProgress] = React.useState(0);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    const crateMessage = (m) => {
        console.log(m)
        return `{"message": "${m}"}`
    }

    React.useEffect(() => {
        if (lastMessage !== null) {
            setProgress(lastMessage);
        }
    }, [lastMessage]);

    const handleClickStart = React.useCallback(() => sendMessage(crateMessage(classLabels.toString())), [sendMessage, classLabels]);

    const handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            const label = e.target.value;
            setClassLabels(
                classLabels
                    .filter(cls => cls !== label)
                    .concat([label])
            )
        }
    }

    const handleDelete = (label) => {
        setClassLabels(
            classLabels.filter(cls => cls !== label)
        )
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <Box sx={{ flexGrow: 1, margin: 5 }}>
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <TextField id="class_labels" label="Clases" variant='outlined' onKeyDown={handleKeyPress} />
                    <Button color='primary' variant="contained" size="large" onClick={handleClickStart} sx={{margin: 1}}>Iniciar</Button>
                    <Divider variant="middle" sx={{margin: 1}}/>
                </Grid>
                <Grid item xs={8}>
                    {
                        classLabels.map((cls, index) => {
                            return (<Chip 
                                key={index}
                                label={cls} 
                                color={index % 2 ? 'primary':'secondary'} 
                                onDelete={ () => { handleDelete(cls) } } 
                            />)
                        })
                    }
                </Grid>
                <Grid item xs={8} >
                    <span>The WebSocket is currently {connectionStatus}</span>
                </Grid>
                <Grid item xs={8} >
                    <LinearProgressWithLabel value={progress} />
                    <Divider variant="middle" sx={{margin: 1}}/>
                </Grid>
                <Grid item xs={8} >
                    <Image src={batch} fit='none' />
                </Grid>
            </Grid>
        </Box>
    )
}
/* 
* Progress Var
* Show batch
* Show variants
* Show classification matrix
* Show prediction/actual/loss/probability
* Show ImageClassifierCleaner
* Upload image to classify
*/
export default FrontPage;