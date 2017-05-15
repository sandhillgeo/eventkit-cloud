import React, {Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import ol from 'openlayers';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import '../tap_events'
import Paper from 'material-ui/Paper'
import DataCartDetails from './DataCartDetails'
import cssStyles from '../../styles/StatusDownload.css'
import { getDatacartDetails, deleteRun, rerunExport, clearReRunInfo} from '../../actions/statusDownloadActions'
import { updateAoiInfo, updateExportInfo } from '../../actions/exportsActions'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'
import CustomScrollbar from '../../components/CustomScrollbar';

class StatusDownload extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datacartDetails: [],
        }
    }

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    }

    expandedChange(expanded) {
        this.setState({expanded: expanded});
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.runDeletion.deleted != this.props.runDeletion.deleted) {
            if(nextProps.runDeletion.deleted) {
                browserHistory.push('/exports/');
            }
        }
        if (nextProps.exportReRun.fetched != this.props.exportReRun.fetched){
            if(nextProps.exportReRun.fetched == true) {
                let datacartDetails = [];
                datacartDetails[0] = nextProps.exportReRun.data;
                this.setState({datacartDetails: datacartDetails});
                this._startTimer();
            }
        }
        if (nextProps.datacartDetails.fetched != this.props.datacartDetails.fetched) {
            if (nextProps.datacartDetails.fetched == true) {
                let datacartDetails = nextProps.datacartDetails.data;
                this.setState({datacartDetails: datacartDetails});

                if (datacartDetails[0].status == "COMPLETED") {
                    TimerMixin.clearInterval(this.timer);
                }
            }
        }

    }
    _startTimer() {
        this.timer = TimerMixin.setInterval(() => {
            this.props.getDatacartDetails(this.props.params.jobuid);
        }, 3000);
    }

    componentDidMount(){
        this._startTimer();

    }
    componentWillUnmount() {
        TimerMixin.clearInterval(this.timer);
    }

    render() {

        const styles = {
            root: {
                height: window.innerHeight - 95,
                width: '100%',
                margin: 'auto',
                overflowY: 'hidden',
                backgroundImage: 'url("../../images/ek_topo_pattern.png")',
                backgroundRepeat: 'repeat repeat'
            },
            content: {
                padding: '30px',
                margin: 'auto',
                maxWidth: '1100px'
            }
        }

        return (
            <div style={styles.root}>
                <CustomScrollbar style={{height: window.innerHeight - 95, width: '100%'}}>
                <div style={styles.content}>
                    <form>
                        <Paper style={{padding: '20px'}} zDepth={2} >
                            
                                <div id='mainHeading' className={cssStyles.heading}>Status & Download</div>
                                    {this.state.datacartDetails.map((cartDetails) => (
                                        <DataCartDetails key={cartDetails.uid}
                                                        cartDetails={cartDetails}
                                                        onRunDelete={this.props.deleteRun}
                                                        onRunRerun={this.props.rerunExport}
                                                        onClone={this.props.cloneExport}/>
                                    ))}
                                
                        </Paper>
                    </form>
                </div>
                </CustomScrollbar>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        jobuid: state.submitJob.jobuid,
        datacartDetails: state.datacartDetails,
        runDeletion: state.runDeletion,
        exportReRun: state.exportReRun,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getDatacartDetails: (jobuid) => {
            dispatch(getDatacartDetails(jobuid))
        },
        deleteRun: (jobuid) => {
            dispatch(deleteRun(jobuid))
        },
        rerunExport: (jobuid) => {
            dispatch(rerunExport(jobuid))
        },
        clearReRunInfo: () => {
            dispatch(clearReRunInfo())
        },
        cloneExport: (cartDetails, providerArray) => {
            dispatch(updateAoiInfo({type: "FeatureCollection", features: [cartDetails.job.extent]}, 'Polygon', 'Custom Polygon', 'Box'));
            dispatch(updateExportInfo(cartDetails.job.name, cartDetails.job.description, cartDetails.job.event, cartDetails.job.published, providerArray, 'Geopackage'))
            browserHistory.push('/create/')
        }
    }
}

StatusDownload.propTypes = {
    datacartDetails: PropTypes.object.isRequired,
    getDatacartDetails: PropTypes.func.isRequired,
    runDeletion: PropTypes.object.isRequired,
    rerunExport: PropTypes.func.isRequired,
    cloneExport: PropTypes.func.isRequired,
};

StatusDownload.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};

reactMixin(StatusDownload.prototype, TimerMixin);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StatusDownload);

