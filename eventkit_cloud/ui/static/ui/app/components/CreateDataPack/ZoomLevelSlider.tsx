import * as React from 'react';
import {createStyles, Theme, withStyles, withTheme} from '@material-ui/core/styles';
import Slider from "@material-ui/lab/Slider";
import TextField from "@material-ui/core/TextField";

const jss = (theme: Theme & Eventkit.Theme) => createStyles({
    container: {
        width: '100%',
    },
    slider: {
        // position: 'absolute',
        width: '100%',
        bottom: 0,
        padding: '10px 0px',
        borderRight: '1px solid #ccc',
        borderLeft: '1px solid #ccc',
        height: '22px',
    },
    levelLabel: {
        border: 'none',
        padding: '0',
        width: '100%',
    },
    textField: {
        fontSize: '16px',
        width: '40px',
    },
    zoomHeader: {
        display: 'inline-flex',
        fontSize: '16px',
        paddingTop: '10px',
        paddingBottom: '5px',
    },
});

interface Props {
    updateZoom: (min: number, max: number) => void;
    maxZoom: number;
    minZoom: number;
    zoom: number;
    theme: Eventkit.Theme & Theme;
    classes: { [className: string]: string };
}

export class ZoomLevelSlider extends React.Component<Props, {}> {

    static defaultProps;

    constructor(props: Props) {
        super(props);

        this.state = {};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event, value) => {
        const zoomValue = Number(value);
        if (zoomValue >= this.props.minZoom && zoomValue <= this.props.maxZoom) {
            this.props.updateZoom(null, zoomValue);
        } else {
            // Send null for min and max zoom to force the prop to reupdate with the last valid value
            this.props.updateZoom(null, null);
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <span style={{ fontSize: '16px' }}>0 to </span>
                <TextField
                    className={classes.textField}
                    type="number"
                    name="zoom-value"
                    value={this.props.zoom}
                    onChange={e => this.handleChange(e, e.target.value)}
                    // MUI uses the case of the i to distinguish between Input component and input html element
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    InputProps={{ style: { bottom: '5px' } }}
                    inputProps={{ style: { textAlign: 'center', fontWeight: 'bold', fontSize: '16px' } }}
                />
                <span style={{ fontSize: '16px' }}>Selected Zoom</span>
                <br />
                <strong className={classes.zoomHeader}>Zoom</strong>
                <div>
                    <Slider
                        className={classes.slider}
                        value={this.props.zoom}
                        aria-labelledby="label"
                        onChange={this.handleChange}
                        max={this.props.maxZoom}
                        step={1}
                    />
                    <div id="labels" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textAlign: 'left' }}>
                            {this.props.minZoom}
                        </span>
                        <span style={{ textAlign: 'right' }}>
                            {this.props.maxZoom}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTheme()(withStyles<any, any>(jss)(ZoomLevelSlider));