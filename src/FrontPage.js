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
    const [socketUrl, setSocketUrl] = React.useState('wss://echo.websocket.org');
    const [progress, setProgress] = React.useState(0);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    React.useEffect(() => {
        const timer = setInterval(() => {
            const message = progress===100 ? 0: progress + 10
            sendMessage(message);
        }, 800);
        return () => {
          clearInterval(timer);
        };
    }, []);

    React.useEffect(() => {
        if (lastMessage !== null) {
            setProgress(lastMessage);
        }
    }, [lastMessage]);

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

    return (
        <Box sx={{ flexGrow: 1, margin: 5 }}>
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <TextField id="class_labels" label="Clases" variant='outlined' onKeyDown={handleKeyPress} />
                    <Button color='primary' variant="contained" size="large" sx={{margin: 1}}>Iniciar</Button>
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