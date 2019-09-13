import * as React from 'react';
import { withTheme, Theme } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';
import CustomTableRow from '../CustomTableRow';
import BaseDialog from '../Dialog/BaseDialog';

export interface Props {
    dataPack: Eventkit.FullRun;
    providers: Eventkit.Provider[];
    theme: Eventkit.Theme & Theme;
}

export interface State {
    providerName: string;
    providerDescription: string;
    providerDialogOpen: boolean;
}

export class DataPackGeneralTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleProviderOpen = this.handleProviderOpen.bind(this);
        this.handleProviderClose = this.handleProviderClose.bind(this);
        this.state = {
            providerName: '',
            providerDescription: '',
            providerDialogOpen: false,
        };
    }

    private handleProviderClose() {
        this.setState({ providerDialogOpen: false });
    }

    private handleProviderOpen(runProviders: Eventkit.ProviderTask) {
        const propsProvider = this.props.providers.find(x => x.slug === runProviders.slug);
        const providerDescription = propsProvider.service_description.toString();
        const providerName = propsProvider.name.toString();
        this.setState({ providerDescription, providerName, providerDialogOpen: true });
    }

    render() {
        const { colors } = this.props.theme.eventkit;

        const providerTasks = this.props.dataPack.provider_tasks.filter(task => (
            task.display
        ));

        const styles = {
            tableRowInfoIcon: {
                marginLeft: '5px',
                height: '18px',
                width: '18px',
                cursor: 'pointer',
                fill: colors.primary,
                verticalAlign: 'middle',
                marginRight: '10px',
            },
            projectionInfoLine: {
                width: '100%',
                marginRight: '8px',
                display: 'inline-block',
            }
        };

        return (
            <div className="qa-DataPackGeneralTable">
                <CustomTableRow
                    className="qa-DataPackGeneralTable-description"
                    title="Description"
                    data={this.props.dataPack.job.description}
                />
                <CustomTableRow
                    className="qa-DataPackGeneralTable-project"
                    title="Project / Category"
                    data={this.props.dataPack.job.event}
                />
                <CustomTableRow
                    className="qa-DataPackGeneralTable-sources"
                    title="Data Sources"
                    dataStyle={{ flexWrap: 'wrap', padding: '5px 10px 5px', display: 'grid' }}
                    data={
                        <div>
                            {providerTasks.map(providerTask => (
                                <div key={providerTask.name} style={{ margin: '5px 0px' }}>
                                    {providerTask.name}
                                    <Info
                                        className="qa-DataPackGeneralTable-Info-source"
                                        onClick={() => this.handleProviderOpen(providerTask)}
                                        key={providerTask.description}
                                        style={styles.tableRowInfoIcon}
                                    />
                                </div>
                            ))}
                            <BaseDialog
                                className="qa-DataPackGeneralTable-BaseDialog-source"
                                show={this.state.providerDialogOpen}
                                title={this.state.providerName}
                                onClose={this.handleProviderClose}
                            >
                                <div style={{ paddingTop: '20px', wordWrap: 'break-word' }}>
                                    {this.state.providerDescription}
                                </div>
                            </BaseDialog>
                        </div>
                    }
                />
                <CustomTableRow
                    className="qa-DataPackGeneralTable-projection"
                    title="Projections"
                    data={this.props.dataPack.job.projections.map((projection) => (
                        <span key={projection.srid} style={styles.projectionInfoLine}>
                            EPSG:{projection.srid} - {projection.name}
                        </span>
                    ))}
                />
            </div>
        );
    }
}

export default withTheme()(DataPackGeneralTable);
