import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {getRuns, deleteRuns, setPageOrder, setPageView} from '../../actions/DataPackPageActions';
import {getProviders} from '../../actions/exportsActions'
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import DataPackGrid from './DataPackGrid';
import DataPackList from './DataPackList';
import MapView from './MapView';
import DataPackSearchbar from './DataPackSearchbar';
import DataPackViewButtons from './DataPackViewButtons';
import DataPackSortDropDown from './DataPackSortDropDown';
import DataPackFilterButton from './DataPackFilterButton';
import DataPackOwnerSort from './DataPackOwnerSort';
import DataPackLinkButton from './DataPackLinkButton';
import FilterDrawer from './FilterDrawer';
import {getGeocode} from '../../actions/searchToolbarActions';
import {processGeoJSONFile, resetGeoJSONFile} from '../../actions/mapToolActions';
import {isGeoJSONValid} from '../../utils/mapUtils';
import Help from 'material-ui/svg-icons/action/help';
import Joyride from 'react-joyride';

export class DataPackPage extends React.Component {

    constructor(props) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.checkForEmptySearch = this.checkForEmptySearch.bind(this);
        this.handleOwnerFilter = this.handleOwnerFilter.bind(this);
        this.handleFilterApply = this.handleFilterApply.bind(this);
        this.handleFilterClear = this.handleFilterClear.bind(this);
        this.changeView = this.changeView.bind(this);
        this.makeRunRequest = this.makeRunRequest.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.loadLess = this.loadLess.bind(this);
        this.getView = this.getView.bind(this);
        this.callback = this.callback.bind(this);
        this.handleSpatialFilter = this.handleSpatialFilter.bind(this);
        this.state = {
            open: window.innerWidth < 1200 ? false: true,
            search: '',
            published: null,
            minDate: null,
            maxDate: null,
            status: {
                completed: false,
                submitted: false,
                incomplete: false,
            },
            providers: {},
            view: props.runsList.view || 'map',
            pageLoading: true,
            order: props.runsList.order || '-job__featured',
            ownerFilter: '',
            pageSize: 12,
            loading: false,
            geojson_geometry: null,
            steps: [],
            isRunning: false,
        }
    }

    componentWillReceiveProps(nextProps) { 
        if(nextProps.runsList.fetched != this.props.runsList.fetched) { 
            if (nextProps.runsList.fetched == true) {
                if (this.state.pageLoading) {
                    this.setState({pageLoading: false});
                }
                if (this.state.loading) {
                    this.setState({loading: false});
                }
            }
        }
        if (nextProps.runsDeletion.deleted != this.props.runsDeletion.deleted) {
            if(nextProps.runsDeletion.deleted) {
                this.setState({loading: true}, this.makeRunRequest);
            }
        }
    }

    componentDidMount() {
        const steps = this.setJoyRideSteps();
        this.joyrideAddSteps(steps);

        this.props.getProviders();
        this.makeRunRequest();
        this.fetch = setInterval(this.makeRunRequest, 10000);
        // make sure no geojson upload is in the state
        this.props.resetGeoJSONFile();
    }

    componentWillUnmount() {
        clearInterval(this.fetch);
        // save view and order to redux state so it can be set next time the page is visited
        if (this.props.runsList.order != this.state.order) {this.props.setOrder(this.state.order)};
        if (this.props.runsList.view != this.state.view) {this.props.setView(this.state.view)};
    }

    setJoyRideSteps() {
        const tooltipStyle = {
            backgroundColor: 'white',
            borderRadius: '0',
            color: 'black',
            mainColor: '#ff4456',
            textAlign: 'left',
            header: {
                textAlign: 'left',
                fontSize: '20px',
                borderColor: '#4598bf'
            },
            main: {
                paddingTop: '20px',
                paddingBottom: '20px',
            },

            button: {
                color: 'white',
                backgroundColor: '#4598bf'
            },
            skip: {
                color: '#8b9396'
            },
            back: {
                color: '#8b9396'
            },
            hole: {
                backgroundColor: 'rgba(226,226,226, 0.2)',
            }
        };

        switch (this.state.view) {
            case 'map':
                return [
                {
                    title: 'Create DataPack',
                    text: 'Click here to Navigate to Create a DataPack.',
                    selector: '.qa-DataPackLinkButton-RaisedButton',
                    position: 'bottom',
                    style: tooltipStyle,

                },
                {
                    title: 'Search DataPacks',
                    text: 'Search and Sort the existing DataPack Library.',
                    selector: '.qa-DataPackSearchBar-TextField',
                    position: 'bottom',
                    style: tooltipStyle,
                },
                {
                    title: 'Filter DataPacks',
                    text: 'Filter the DataPack Library by Permission, Status, Dates and Data Sources.',
                    selector: '.qa-FilterDrawer-Drawer > div',
                    position: 'bottom',
                    style: tooltipStyle,
                },
                {
                    title: 'DataPack Status',
                    text: 'Check the status of previously created DataPacks',
                    selector: '.qa-DataPackListItem-subtitle-date',
                    position: 'bottom',
                    style: tooltipStyle,
                },
                {
                    title: 'Status and Download',
                    text: 'Navigate to the “Status & Download” page of an existing DataPack, where you can download the data.',
                    selector: '.qa-DataPackListItem-IconMenu',
                    position: 'bottom',
                    style: tooltipStyle,
                },
            ];
            case 'grid':
                return [
                    {
                        title: 'Create DataPack',
                        text: 'Click here to Navigate to Create a DataPack.',
                        selector: '.qa-DataPackLinkButton-RaisedButton',
                        position: 'bottom',
                        style: tooltipStyle,

                    },
                    {
                        title: 'Search DataPacks',
                        text: 'Search and Sort the existing DataPack Library.',
                        selector: '.qa-DataPackSearchBar-TextField',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                    {
                        title: 'Filter DataPacks',
                        text: 'Filter the DataPack Library by Permission, Status, Dates and Data Sources.',
                        selector: '.qa-FilterDrawer-Drawer > div',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                    {
                        title: 'DataPack Status',
                        text: 'Check the status of previously created DataPacks',
                        selector: '.qa-DataPackGridItem-CardActions',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                    {
                        title: 'Status and Download',
                        text: 'Navigate to the “Status & Download” page of an existing DataPack, where you can download the data.',
                        selector: '.qa-DataPackGridItem-IconMenu',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                ];
            case 'list':
                return [
                    {
                        title: 'Create DataPack',
                        text: 'Click here to Navigate to Create a DataPack.',
                        selector: '.qa-DataPackLinkButton-RaisedButton',
                        position: 'bottom',
                        style: tooltipStyle,

                    },
                    {
                        title: 'Search DataPacks',
                        text: 'Search and Sort the existing DataPack Library.',
                        selector: '.qa-DataPackSearchBar-TextField',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                    {
                        title: 'Filter DataPacks',
                        text: 'Filter the DataPack Library by Permission, Status, Dates and Data Sources.',
                        selector: '.qa-FilterDrawer-Drawer > div',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                    {
                        title: 'DataPack Status',
                        text: 'Check the status of previously created DataPacks',
                        selector: '.qa-DataPackTableItem-TableRowColumn-status',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                    {
                        title: 'Status and Download',
                        text: 'Navigate to the “Status & Download” page of an existing DataPack, where you can download the data.',
                        selector: '.qa-DataPackTableItem-IconMenu',
                        position: 'bottom',
                        style: tooltipStyle,
                    },
                ];
        }

    }

    onSearch(searchText) { 
        this.setState({search: searchText, loading: true}, this.makeRunRequest);
    }

    checkForEmptySearch(searchText) {
        if(searchText == '' && this.state.search) {
            this.setState({search: '', loading: true}, this.makeRunRequest);
        }
    }

    handleSortChange(value) {
        this.setState({order: value, loading: true}, this.makeRunRequest);
    }

    makeRunRequest() {
        let status = []
        Object.keys(this.state.status).forEach((key, ix) => {
            if(this.state.status[key]) {status.push(key.toUpperCase())};
        });

        const order = this.state.order.includes('featured') ? this.state.order + ',-started_at' : this.state.order;

        const minDate = this.state.minDate ? `&min_date=${this.state.minDate.toISOString().substring(0, 10)}` : '';
        let maxDate = ''
        if(this.state.maxDate) {
            maxDate = new Date(this.state.maxDate.getTime());
            maxDate.setDate(maxDate.getDate() + 1);
            maxDate = `&max_date=${maxDate.toISOString().substring(0, 10)}`;
        }

        const providers = Object.keys(this.state.providers);

        let params = '';
        params += `page_size=${this.state.pageSize}`;
        params += order ? `&ordering=${order}`: '';
        params += this.state.ownerFilter ? `&user=${this.state.ownerFilter}`: '';
        params += this.state.published ? `&published=${this.state.published}` : '';
        params += status.length ? `&status=${status.join(',')}` : '';
        params += minDate;
        params += maxDate;
        params += this.state.search ? `&search_term=${this.state.search.slice(0, 1000)}` : '';
        params += providers.length ? `&providers=${providers.join(',')}` : '';
        return this.props.getRuns(params, this.state.geojson_geometry);
    }

    handleOwnerFilter(event, index, value) {
        this.setState({ownerFilter: value, loading: true}, this.makeRunRequest);
    }

    handleFilterApply(state) {
        this.setState({...this.state, ...state, loading: true}, this.makeRunRequest);
        if(window.innerWidth < 1200) {
            this.setState({open: false});
        }
    }

    handleFilterClear() {
        this.setState({
            published: null,
            minDate: null,
            maxDate: null,
            status: {
                completed: false,
                incomplete: false,
                submitted: false,
            },
            loading: true
        }, this.makeRunRequest);
        if(window.innerWidth < 1200) {
            this.setState({open: false});
        }
    }

    handleSpatialFilter(geojson) {
        this.setState({geojson_geometry: geojson, loading: true}, this.makeRunRequest);
    }

    changeView(view) {
        if (['started_at', '-started_at', 'job__name', '-job__name', '-job__featured', 'job__featured'].indexOf(this.state.order) < 0) {
            this.setState({order: '-started_at', loading: true}, () => {
                let promise = this.makeRunRequest();
                promise.then(() => this.setState({view: view}));
            });
        }
        else {
            this.setState({view: view},
            function () {
                const steps = this.setJoyRideSteps();
                this.joyrideAddSteps(steps);
            });
        }

    }

    handleToggle() {
        this.setState({open: !this.state.open});
    }

    loadMore() {
        if (this.props.runsList.nextPage) {
            this.setState(
                {pageSize: this.state.pageSize + 12, loading: true}, 
                this.makeRunRequest
            );
        }
    }

    loadLess() {
        if (this.state.pageSize > 12) {
            this.setState(
                {pageSize: this.state.pageSize - 12, loading: true},
                this.makeRunRequest
            );
        }
    }

    getView(view) {
        switch(view) {
            case 'list':
                return <DataPackList
                    runs={this.props.runsList.runs}
                    user={this.props.user}
                    onRunDelete={this.props.deleteRuns}
                    onSort={this.handleSortChange}
                    order={this.state.order}
                    range={this.props.runsList.range}
                    handleLoadLess={this.loadLess}
                    handleLoadMore={this.loadMore}
                    loadLessDisabled={this.props.runsList.runs.length <= 12}
                    loadMoreDisabled={!this.props.runsList.nextPage}
                    providers={this.props.providers}
                />;
            case 'grid':
                return <DataPackGrid
                    runs={this.props.runsList.runs}
                    user={this.props.user}
                    onRunDelete={this.props.deleteRuns}
                    range={this.props.runsList.range}
                    handleLoadLess={this.loadLess}
                    handleLoadMore={this.loadMore}
                    loadLessDisabled={this.props.runsList.runs.length <= 12}
                    loadMoreDisabled={!this.props.runsList.nextPage}
                    providers={this.props.providers}
                />
            case 'map':
                return <MapView
                    runs={this.props.runsList.runs}
                    user={this.props.user}
                    onRunDelete={this.props.deleteRuns}
                    range={this.props.runsList.range}
                    handleLoadLess={this.loadLess}
                    handleLoadMore={this.loadMore}
                    loadLessDisabled={this.props.runsList.runs.length <= 12}
                    loadMoreDisabled={!this.props.runsList.nextPage}
                    providers={this.props.providers}
                    geocode={this.props.geocode}
                    getGeocode={this.props.getGeocode}
                    importGeom={this.props.importGeom}
                    processGeoJSONFile={this.props.processGeoJSONFile}
                    resetGeoJSONFile={this.props.resetGeoJSONFile}
                    onMapFilter={this.handleSpatialFilter}
                />;
            default: return null;
        }
    }

    joyrideAddSteps(steps) {
        let newSteps = steps;

        if (!Array.isArray(newSteps)) {
            newSteps = [newSteps];
        }

        if (!newSteps.length) return;

        this.setState({steps:newSteps});
    }
    
    callback(data) {
        if(data.action === 'close' || data.action === 'skip' || data.type === 'finished'){
            // This explicitly stops the tour (otherwise it displays a "beacon" to resume the tour)
            this.setState({ isRunning: false });
            this.refs.joyride.reset(true);
        }
        if(data.index === 2 && data.type === 'step:before') {
            if (this.state.open == false){
                this.setState({open: true})
            }
        }
    }

    handleJoyride() {
        if(this.state.isRunning === true){
            this.setState({isRunning: false})
            this.refs.joyride.reset(true);
        }
        else {
            this.setState({isRunning: true})
        }
    }

    render() {
        const {steps, isRunning} = this.state;
        const pageTitle = <div style={{display: 'inline-block', paddingRight: '10px'}}>DataPack Library</div>
        const iconElementRight = <div onTouchTap={this.handleJoyride.bind(this)} style={{color: '#4598bf', cursor:'pointer', display: 'inline-block', marginRight:'30px', fontSize:'16px'}}><Help onTouchTap={this.handleJoyride.bind(this)} style={{color: '#4598bf', cursor:'pointer', height:'18px', width:'18px', verticalAlign:'middle', marginRight:'5px', marginBottom:'5px'}}/>Page Tour</div>
        const styles = {
            wholeDiv: {
                height: window.innerWidth > 575 ? window.innerHeight - 231 : window.innerHeight - 223,
                backgroundRepeat: 'repeat repeat',
                marginRight: this.state.open && window.innerWidth >= 1200 ? '200px' : '0px',
                marginTop: window.innerWidth > 575 ? '10px' : '2px',
            },
            appBar: {
                backgroundColor: '#161e2e',
                height: '35px',
                color: 'white',
                fontSize: '14px',
            },
            pageTitle: {
                fontSize: '18px',
                lineHeight: '35px',
                paddingLeft: '10px',
                height: '35px'
            },
            toolbarSearch: {
                backgroundColor: '#253447',
            },
            toolbarSort: {
                backgroundColor: '#253447',
                height: '35px',
                display: 'inline-block',
                width: '100%'
            },
            containerStyle: {
                backgroundColor: '#fff',
                top: '221px',
                height: window.innerHeight - 221,
                overflowY: 'hidden',
                overflowX: 'hidden'
            },
            backgroundStyle: {
                backgroundImage: 'url('+require('../../../images/ek_topo_pattern.png')+')'
            },
            range: window.innerWidth < 768 ?
                {color: '#a59c9c', lineHeight: '36px', fontSize: '12px'}
                :
                {display: 'inline-block', position: 'absolute', color: '#a59c9c', lineHeight: '36px', right: '10px', fontSize: '12px'}
        };

        return (
            <div style={styles.backgroundStyle}>
                <Joyride
                    callback={this.callback}
                    ref={'joyride'}
                    debug={false}
                    steps={steps}
                    autoStart={true}
                    type={'continuous'}
                    disableOverlay
                    showSkipButton={true}
                    showStepsProgress={true}
                    locale={{
                        back: (<span>Back</span>),
                        close: (<span>Close</span>),
                        last: (<span>Done</span>),
                        next: (<span>Next</span>),
                        skip: (<span>Skip</span>),
                    }}
                    run={isRunning}/>
                <AppBar
                    className={'qa-DataPackPage-AppBar'}
                    style={styles.appBar}
                    title={pageTitle}
                    titleStyle={styles.pageTitle}
                    iconElementRight={iconElementRight}
                    iconElementLeft={<p></p>}
                >
                    <DataPackLinkButton />
                </AppBar>
                
                <Toolbar className={'qa-DataPackPage-Toolbar-search'} style={styles.toolbarSearch}>
                    <ToolbarGroup className={'qa-DataPackPage-ToolbarGroup-search'}  style={{width: '100%'}}>
                        <DataPackSearchbar
                            onSearchChange={this.checkForEmptySearch}
                            onSearchSubmit={this.onSearch}
                        />
                    </ToolbarGroup>
                </Toolbar>

                <Toolbar className={'qa-DataPackPage-Toolbar-sort'} style={styles.toolbarSort}>
                        <DataPackOwnerSort handleChange={this.handleOwnerFilter} value={this.state.ownerFilter} owner={this.props.user.data.user.username} />
                        <DataPackFilterButton 
                            handleToggle={this.handleToggle}
                            active={this.state.open}
                        />
                        {this.state.view == 'list' && window.innerWidth >= 768 ?
                            null
                            : 
                            <DataPackSortDropDown handleChange={(e, i, v) => {this.handleSortChange(v)}} value={this.state.order} />
                        }
                        <DataPackViewButtons 
                            handleViewChange={this.changeView}
                            view={this.state.view}
                        />
                </Toolbar>
                
                <div style={styles.wholeDiv}>
                    <FilterDrawer 
                        onFilterApply={this.handleFilterApply} 
                        onFilterClear={this.handleFilterClear}
                        open={this.state.open}
                        providers={this.props.providers}/>

                    {this.state.pageLoading ? 
                        <div style={{width: '100%', height: '100%', display: 'inline-flex'}}>
                            <CircularProgress 
                                style={{margin: 'auto', display: 'block'}} 
                                color={'#4598bf'}
                                size={50}
                            />
                        </div>
                        :
                        <div style={{position: 'relative'}}  className={'qa-DataPackPage-view'}>
                            {this.state.loading || this.props.runsDeletion.deleting || this.props.importGeom.processing ? 
                            <div style={{zIndex: 10, position: 'absolute', width: '100%', height: '100%',  backgroundColor: 'rgba(0,0,0,0.2)'}}>
                                <div style={{width: '100%', height: '100%', display: 'inline-flex'}}>
                                    <CircularProgress 
                                        style={{margin: 'auto', display: 'block'}} 
                                        color={'#4598bf'}
                                        size={50}
                                    />
                                </div>
                            </div>
                            : null}
                            {this.getView(this.state.view)}
                        </div>
                    }
                </div>
                
            </div>
        );
    }
}

DataPackPage.propTypes = {
    runsList: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    getRuns: PropTypes.func.isRequired,
    deleteRuns: PropTypes.func.isRequired,
    getProviders: PropTypes.func.isRequired,
    runsDeletion: PropTypes.object.isRequired,
    drawer: PropTypes.string.isRequired,
    importGeom: PropTypes.object.isRequired,
    geocode: PropTypes.object.isRequired,
    getGeocode: PropTypes.func.isRequired,
    processGeoJSONFile: PropTypes.func.isRequired,
    resetGeoJSONFile: PropTypes.func.isRequired,
    setOrder: PropTypes.func.isRequired,
    setView: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        runsList: state.runsList,
        user: state.user,
        runsDeletion: state.runsDeletion,
        drawer: state.drawer,
        providers: state.providers,
        importGeom: state.importGeom,
        geocode: state.geocode,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getRuns: (params, geojson) => {
            return dispatch(getRuns(params, geojson));
        },
        deleteRuns: (uid) => {
            dispatch(deleteRuns(uid));
        },
        getProviders: () => {
            dispatch(getProviders())
        },
        getGeocode: (query) => {
            dispatch(getGeocode(query));
        },
        processGeoJSONFile: (file) => {
            dispatch(processGeoJSONFile(file));
        },
        resetGeoJSONFile: (file) => {
            dispatch(resetGeoJSONFile());
        },
        setOrder: (order) => {
            dispatch(setPageOrder(order));
        },
        setView: (view) => {
            dispatch(setPageView(view));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DataPackPage);
