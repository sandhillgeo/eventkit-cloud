import React, { PropTypes, Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import { List, ListItem } from 'material-ui/List';
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';
import SocialGroup from 'material-ui/svg-icons/social/group';
import Lock from 'material-ui/svg-icons/action/lock-outline';
import NotificationSync from 'material-ui/svg-icons/notification/sync';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import AlertError from 'material-ui/svg-icons/alert/error';

import Map from 'ol/map';
import View from 'ol/view';
import interaction from 'ol/interaction';
import VectorSource from 'ol/source/vector';
import XYZ from 'ol/source/xyz';
import GeoJSON from 'ol/format/geojson';
import VectorLayer from 'ol/layer/vector';
import Tile from 'ol/layer/tile';
import Attribution from 'ol/control/attribution';
import Zoom from 'ol/control/zoom';
import ScaleLine from 'ol/control/scaleline';

import BaseDialog from '../Dialog/BaseDialog';
import DeleteDataPackDialog from '../Dialog/DeleteDataPackDialog';
import FeaturedFlag from './FeaturedFlag';
import ol3mapCss from '../../styles/ol3map.css';

export class DataPackGridItem extends Component {
    constructor(props) {
        super(props);
        this.initMap = this.initMap.bind(this);
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.handleExpandChange = this.handleExpandChange.bind(this);
        this.showDeleteDialog = this.showDeleteDialog.bind(this);
        this.hideDeleteDialog = this.hideDeleteDialog.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleProviderOpen = this.handleProviderOpen.bind(this);
        this.handleProviderClose = this.handleProviderClose.bind(this);
        this.state = {
            expanded: false,
            overflow: false,
            providerDescs: {},
            providerDialogOpen: false,
            deleteDialogOpen: false,
        };
    }

    componentDidMount() {
        this.setState({ expanded: true });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.expanded !== this.state.expanded) {
            if (this.state.expanded) {
                this.initMap();
            }
        }
    }

    initMap() {
        const map = new Map({
            target: `${this.props.run.uid}_map`,
            layers: [
                new Tile({
                    source: new XYZ({
                        url: this.context.config.BASEMAP_URL,
                        wrapX: true,
                        attributions: this.context.config.BASEMAP_COPYRIGHT,
                    }),
                }),
            ],
            view: new View({
                projection: 'EPSG:3857',
                center: [110, 0],
                zoom: 2,
                minZoom: 2,
                maxZoom: 22,
            }),
            interactions: interaction.defaults({ mouseWheelZoom: false }),
            controls: [
                new Attribution({
                    className: ['ol-attribution', ol3mapCss['ol-attribution']].join(' '),
                    collapsible: false,
                    collapsed: false,
                }),
                new Zoom({
                    className: [ol3mapCss.olZoom, ol3mapCss.olControlTopLeft].join(' '),
                }),
                new ScaleLine({
                    className: ol3mapCss.olScaleLine,
                }),
            ],
        });

        const source = new VectorSource({ wrapX: true });

        const geojson = new GeoJSON();
        const feature = geojson.readFeature(this.props.run.job.extent, {
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326',
        });
        source.addFeature(feature);
        const layer = new VectorLayer({
            source,
        });
        map.addLayer(layer);
        map.getView().fit(source.getExtent(), map.getSize());
    }

    handleExpandChange(expanded) {
        this.setState({ expanded });
    }

    handleProviderClose() {
        this.setState({ providerDialogOpen: false });
    }

    handleProviderOpen() {
        const runProviders = this.props.run.provider_tasks
            .filter(provider => (provider.display !== false));
        const providerDescs = {};
        runProviders.forEach((runProvider) => {
            const a = this.props.providers.find(x => x.slug === runProvider.slug);
            providerDescs[a.name] = a.service_description;
        });
        this.setState({ providerDescs, providerDialogOpen: true });
    }

    toggleExpanded() {
        this.setState({ expanded: !this.state.expanded });
    }

    showDeleteDialog() {
        this.setState({ deleteDialogOpen: true });
    }

    hideDeleteDialog() {
        this.setState({ deleteDialogOpen: false });
    }

    handleDelete() {
        this.hideDeleteDialog();
        this.props.onRunDelete(this.props.run.uid);
    }

    render() {
        const providersList = Object.entries(this.state.providerDescs).map(([key, value], ix) => {
            return (
                <ListItem
                    key={key}
                    style={{
                        backgroundColor: ix % 2 === 0 ? 'whitesmoke' : 'white',
                        fontWeight: 'bold',
                        width: '100%',
                        zIndex: 0,
                    }}
                    nestedListStyle={{ padding: '0px' }}
                    primaryText={key}
                    initiallyOpen={false}
                    primaryTogglesNestedList={false}
                    nestedItems={[
                        <ListItem
                            key={1}
                            primaryText={<div style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>{value}</div>}
                            style={{
                                backgroundColor: ix % 2 === 0 ? 'whitesmoke' : 'white',
                                fontSize: '14px',
                                width: '100%',
                                zIndex: 0,
                            }}
                        />,
                    ]}
                />

            );
        });

        const cardTextFontSize = window.innerWidth < 768 ? 10 : 12;
        const titleFontSize = 22;
        const styles = {
            card: {
                backgroundColor: '#f7f8f8',
                position: 'relative',
            },
            cardTitle: {
                wordWrap: 'break-word',
                padding: '15px 10px 10px',
            },
            cardTitle2: {
                fontSize: titleFontSize,
                height: '36px',
            },
            cardSubtitle: {
                fontSize: cardTextFontSize,
            },
            completeIcon: {
                float: 'left',
                color: '#bcdfbb',
                fontSize: '20px',
            },
            errorIcon: {
                float: 'left',
                color: '#ce4427',
                fontSize: '20px',
                opacity: '0.6',
            },
            runningIcon: {
                float: 'left',
                color: '#f4D225',
                fontSize: '22px',
            },
            unpublishedIcon: {
                float: 'right',
                color: 'grey',
                fontSize: '18px',
                marginRight: '5px',
            },
            publishedIcon: {
                float: 'right',
                color: 'grey',
                fontSize: '20px',
                marginRight: '5px',
            },
            ownerLabel: {
                float: 'right',
                color: 'grey',
                paddingTop: '5px',
                margin: '0px',
                fontSize: cardTextFontSize,
            },
            cardTextMinimized: {
                position: 'absolute',
                wordWrap: 'break-word',
                width: '100%',
                backgroundColor: '#f7f8f8',
                zIndex: 2,
                padding: '0px 10px 5px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 3,
                height: window.innerWidth < 768 ? '47px' : '56px',
            },
            cardText: {
                position: 'absolute',
                wordWrap: 'break-word',
                width: '100%',
                backgroundColor: '#f7f8f8',
                zIndex: 2,
                padding: '0px 10px 5px',

            },
            cardTextContainer: {
                fontSize: cardTextFontSize,
                padding: '0px',
                marginBottom: '10px',
                height: window.innerWidth < 768 ? '42px' : '51px',
                overflow: this.state.overflow ? 'visible' : 'hidden',
                position: 'relative',
            },
            titleLink: {
                color: 'inherit',
                display: 'block',
                width: '100%',
                height: '36px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: '0px',
            },
            iconMenu: {
                padding: '0px',
                width: '24px',
                height: '24px',
                verticalAlign: 'middle',
            },
        };

        return (
            <Card
                className="qa-DataPackGridItem-Card"
                style={styles.card}
                key={this.props.run.uid}
                expanded={this.state.expanded}
                onExpandChange={this.handleExpandChange}
            >
                <FeaturedFlag show={this.props.run.job.featured} />
                <CardTitle
                    className="qa-DataPackGridItem-CardTitle"
                    titleColor="#4598bf"
                    style={styles.cardTitle}
                    titleStyle={styles.cardTitle2}
                    subtitleStyle={styles.cardSubtitle}
                    title={
                        <div>
                            <div className="qa-DataPackGridItem-div-cardTitleLink" style={{ display: 'inline-block', width: 'calc(100% - 24px)', height: '36px' }}>
                                <Link
                                    className="qa-DataPackGridItem-Link"
                                    to={`/status/${this.props.run.job.uid}`}
                                    href={`/status/${this.props.run.job.uid}`}
                                    style={styles.titleLink}
                                >
                                    {this.props.run.job.name}
                                </Link>
                            </div>
                            <IconMenu
                                className="qa-DataPackGridItem-IconMenu"
                                style={{ float: 'right', width: '24px', height: '100%' }}
                                iconButtonElement={
                                    <IconButton
                                        style={styles.iconMenu}
                                        iconStyle={{ color: '#4598bf' }}
                                    >
                                        <NavigationMoreVert />
                                    </IconButton>}
                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                            >
                                <MenuItem
                                    className="qa-DataPackGridItem-MenuItem-showHideMap"
                                    style={{ fontSize: cardTextFontSize }}
                                    primaryText={this.state.expanded ? 'Hide Map' : 'Show Map'}
                                    onClick={this.toggleExpanded}
                                />
                                <MenuItem
                                    className="qa-DataPackGridItem-MenuItem-goToStatus"
                                    style={{ fontSize: cardTextFontSize }}
                                    primaryText="Go to Status & Download"
                                    onClick={() => { browserHistory.push(`/status/${this.props.run.job.uid}`); }}
                                />
                                <MenuItem
                                    className="qa-DataPackGridItem-MenuItem-viewProviders"
                                    style={{ fontSize: cardTextFontSize }}
                                    primaryText="View Data Sources"
                                    onClick={this.handleProviderOpen}
                                />
                                {this.props.adminPermission ?
                                    [
                                        <MenuItem
                                            key="delete"
                                            className="qa-DataPackGridItem-MenuItem-delete"
                                            style={{ fontSize: cardTextFontSize }}
                                            primaryText="Delete Export"
                                            onClick={this.showDeleteDialog}
                                        />,
                                        <MenuItem
                                            key="share"
                                            className="qa-DataPackGridItem-MenuItem-share"
                                            style={{ fontSize: cardTextFontSize }}
                                            primaryText="Share"
                                            onClick={() => this.props.openShare(this.props.run)}
                                        />,
                                    ]
                                    :
                                    null
                                }
                            </IconMenu>
                            <BaseDialog
                                className="qa-DataPackGridItem-BaseDialog"
                                show={this.state.providerDialogOpen}
                                title="DATA SOURCES"
                                onClose={this.handleProviderClose}
                            >
                                <List>{providersList}</List>
                            </BaseDialog>
                            <DeleteDataPackDialog
                                className="qa-DataPackGridItem-DeleteDialog"
                                show={this.state.deleteDialogOpen}
                                onCancel={this.hideDeleteDialog}
                                onDelete={this.handleDelete}
                            />
                        </div>
                    }
                    subtitle={
                        <div>
                            <div
                                className="qa-DataPackGridItem-div-subtitle"
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                                {`Event: ${this.props.run.job.event}`}
                            </div>
                            <span>{`Added: ${moment(this.props.run.started_at).format('YYYY-MM-DD')}`}</span><br />
                            <span>{`Expires: ${moment(this.props.run.expiration).format('YYYY-MM-DD')}`}</span><br />
                        </div>
                    }
                />
                <CardText
                    className="qa-DataPackGridItem-CardText"
                    style={styles.cardTextContainer}
                    onMouseEnter={() => { this.setState({ overflow: true }); }}
                    onMouseLeave={() => { this.setState({ overflow: false }); }}
                    onTouchTap={() => { this.setState({ overflow: !this.state.overflow }); }}
                >
                    <span className="qa-DataPackGridItem-span-description" style={this.state.overflow ? styles.cardText : styles.cardTextMinimized}>
                        {this.props.run.job.description}
                    </span>
                </CardText>
                <CardMedia className="qa-DataPackGridItem-CardMedia" expandable>
                    <div id={`${this.props.run.uid}_map`} style={{ padding: '0px 2px', backgroundColor: 'none', maxHeight: '200px' }} />
                </CardMedia>
                <CardActions className="qa-DataPackGridItem-CardActions" style={{ height: '45px' }}>
                    <span>
                        {this.props.run.status == "SUBMITTED" ?
                            <NotificationSync style={styles.runningIcon} />
                            :
                            this.props.run.status == "INCOMPLETE" ?
                                <AlertError style={styles.errorIcon} />
                                :
                                <NavigationCheck style={styles.completeIcon} />
                        }
                        {this.props.run.user === this.props.user.data.user.username ?
                            <p style={styles.ownerLabel}>My DataPack</p>
                            :
                            <p style={styles.ownerLabel}>{this.props.run.user}</p>
                        }
                        {this.props.run.job.permissions.value !== 'PRIVATE' ?
                            <SocialGroup style={styles.publishedIcon} />
                            :

                            <Lock style={styles.unpublishedIcon} />
                        }
                    </span>
                </CardActions>
            </Card>
        );
    }
}

DataPackGridItem.contextTypes = {
    config: React.PropTypes.object,
};

DataPackGridItem.propTypes = {
    run: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onRunDelete: PropTypes.func.isRequired,
    providers: PropTypes.array.isRequired,
    openShare: PropTypes.func.isRequired,
    adminPermission: PropTypes.bool.isRequired,
};

export default DataPackGridItem;
