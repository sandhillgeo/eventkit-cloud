import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { browserHistory } from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { AppBar, CircularProgress } from 'material-ui';
import { DashboardPage } from '../../components/DashboardPage/DashboardPage';
import DataPackShareDialog from '../../components/DataPackShareDialog/DataPackShareDialog';
import DashboardSection from '../../components/DashboardPage/DashboardSection';
import NotificationGridItem from '../../components/Notification/NotificationGridItem';
import DataPackGridItem from '../../components/DataPackPage/DataPackGridItem';
import DataPackFeaturedItem from '../../components/DashboardPage/DataPackFeaturedItem';

const mockNotifications = {
    '1': {
        id: '1',
        verb: 'run_started',
        actor: {
            details: {
                job: {
                    name: 'Test',
                },
            },
        },
        timestamp: '2018-05-04T17:32:04.716806Z',
        unread: false,
    },
    '2': {
        id: '2',
        verb: 'run_completed',
        actor: {
            details: {
                job: {
                    name: 'Test',
                },
            },
        },
        timestamp: '2018-05-04T17:34:04.716806Z',
        unread: true,
    },
};

const mockRuns = [
    {
        user: 'admin2',
        uid: '2',
        job: {
            uid: '2',
            permissions: {
                value: '',
                groups: {},
                members: {},
            },
        },
    },
    {
        user: 'admin',
        uid: '1',
        job: {
            uid: '1',
            permissions: {
                value: '',
                groups: {},
                members: {},
            },
        },
    },
];

describe('DashboardPage component', () => {
    const muiTheme = getMuiTheme();

    let props;
    let wrapper;
    let instance;

    beforeEach(() => {
        setup();
    });

    function setup({ propsOverride = {}, mounted = false } = {}) {
        props = {
            user: {
                data: {
                    user: {
                        username: 'admin',
                    },
                },
            },
            runsList: {
                fetching: false,
                fetched: false,
                runs: [],
            },
            featuredRunsList: {
                fetching: false,
                fetched: false,
                runs: [],
            },
            runsDeletion: {
                deleted: false,
            },
            userActivity: {
                viewedJobs: {
                    fetching: false,
                    fetched: true,
                    viewedJobs: [],
                },
            },
            notifications: {
                fetching: false,
                fetched: false,
                notifications: {},
                notificationsSorted: [],
                unreadCount: {
                    fetching: false,
                    fetched: false,
                    unreadCount: 0,
                },
            },
            updatePermission: {
                updating: false,
                updated: false,
            },
            users: {
                fetching: false,
                fetched: false,
            },
            groups: {
                fetching: false,
                fetched: false,
            },
            refresh: () => {},
            getRuns: () => {},
            getFeaturedRuns: () => {},
            getViewedJobs: () => {},
            deleteRuns: () => {},
            getUsers: () => {},
            updateDataCartPermissions: sinon.spy(),
            getGroups: sinon.spy(),
            getProviders: sinon.spy(),
            getNotifications: sinon.spy(),
            ...propsOverride,
        };

        if (mounted) {
            wrapper = mount(<DashboardPage { ...props } />, {
                context: { muiTheme },
                childContextTypes: { muiTheme: React.PropTypes.object },
            });
        } else {
            wrapper = shallow(<DashboardPage { ...props } />);
        }

        instance = wrapper.instance();
        instance.joyride = {
            reset: () => {},
        };
    }

    function loadEmptyData(wrapper) {
        const props = wrapper.instance().props;
        wrapper.setProps({
            ...props,
            runsList: {
                fetching: false,
                fetched: true,
                runs: [],
            },
            featuredRunsList: {
                fetching: false,
                fetched: true,
                runs: [],
            },
            userActivity: {
                ...props.userActivity,
                viewedJobs: {
                    ...props.userActivity.viewedJobs,
                    fetching: false,
                    fetched: true,
                    viewedJobs: [],
                },
            },
            notifications: {
                ...props.notifications,
                fetching: false,
                fetched: true,
                notifications: [],
            },
            users: {
                fetching: false,
                fetched: true,
            },
            groups: {
                fetching: false,
                fetched: true,
                groups: {},
            },
        });
    }

    function loadData(wrapper) {
        const props = wrapper.instance().props;
        wrapper.setProps({
            ...props,
            runsList: {
                fetching: false,
                fetched: true,
                runs: mockRuns,
            },
            featuredRunsList: {
                fetching: false,
                fetched: true,
                runs: mockRuns,
            },
            userActivity: {
                ...props.userActivity,
                viewedJobs: {
                    ...props.userActivity.viewedJobs,
                    fetching: false,
                    fetched: true,
                    viewedJobs: [
                        { last_export_run: mockRuns[0] },
                        { last_export_run: mockRuns[1] },
                    ],
                },
            },
            notifications: {
                ...props.notifications,
                fetching: false,
                fetched: true,
                notifications: mockNotifications,
                notificationsSorted: [
                    mockNotifications['1'],
                    mockNotifications['2'],
                ],
            },
            users: {
                fetching: false,
                fetched: true,
            },
            groups: {
                fetching: false,
                fetched: true,
            },
        });
    }

    it('renders app bar', () => {
        expect(wrapper.find(AppBar)).toHaveLength(1);
    });

    it('joyrideAddSteps sets state for steps in tour', () => {
        const steps = [
            {
                text: 'im the step',
            },
        ];
        const stateStub = sinon.stub(instance, 'setState');
        instance.joyrideAddSteps(steps);
        expect(stateStub.calledOnce).toBe(true);
        expect(stateStub.calledWith({ steps }));
        stateStub.restore();
    });

    it('callback function stops tour if close is clicked', () => {
        const callbackData = {
            action: 'close',
            index: 2,
            step: {
                position: 'bottom',
                selector: '.select',
                style: {},
                text: 'Click here to Navigate to Create a DataPack.',
                title: 'Create DataPack',
            },
            type: 'step:before',
        };
        const stateSpy = sinon.stub(DashboardPage.prototype, 'setState');
        instance.callback(callbackData);
        expect(stateSpy.calledWith({ isRunning: false }));
        stateSpy.restore();
    });

    it('callback sets location hash if step has a scrollToId', () => {
        const callbackData = {
            action: 'next',
            index: 3,
            step: {
                scrollToId: 'test-id',
                position: 'bottom',
                selector: '.select',
                style: {},
                text: 'Click here to Navigate to Create a DataPack.',
                title: 'Create DataPack',
            },
            type: 'step:before',
        };
        expect(window.location.hash).toEqual('');
        instance.callback(callbackData);
        expect(window.location.hash).toEqual('#test-id');
    });

    describe('initial state', () => {
        it('renders loading indicator', () => {
            expect(wrapper.find(CircularProgress)).toHaveLength(1);
        });

        it('does not render any dashboard sections', () => {
            expect(wrapper.find(DashboardSection)).toHaveLength(0);
        });

        it('does not render share dialog', () => {
            expect(wrapper.find(DataPackShareDialog)).toHaveLength(0);
        });
    });

    describe('after data has loaded', () => {
        beforeEach(() => {
            loadData(wrapper);
        });

        it('does not render loading indicator', () => {
            expect(wrapper.find(CircularProgress)).toHaveLength(0);
        });

        it('renders Notifications section', () => {
            expect(wrapper.find('.qa-DashboardSection-Notifications')).toHaveLength(1);
        });

        it('renders Recently Viewed section', () => {
            expect(wrapper.find('.qa-DashboardSection-RecentlyViewed')).toHaveLength(1);
        });

        it('renders Featured section', () => {
            expect(wrapper.find('.qa-DashboardSection-Featured')).toHaveLength(1);
        });

        it('renders My DataPacks section', () => {
            expect(wrapper.find('.qa-DashboardSection-MyDataPacks')).toHaveLength(1);
        });

        it('renders notifications', () => {
            const notificationItems = wrapper.find('.qa-DashboardSection-Notifications').children().find(NotificationGridItem);
            const notificationsSorted = instance.props.notifications.notificationsSorted;
            expect(notificationItems).not.toHaveLength(0);
            expect(notificationItems).toHaveLength(notificationsSorted.length);
            for (let i = 0; i < notificationsSorted.length; i++) {
                expect(notificationItems.at(i).props().notification).toBe(notificationsSorted[i]);
            }
        });

        it('renders recently viewed datapacks', () => {
            const recentlyViewedItems = wrapper.find('.qa-DashboardSection-RecentlyViewed').children().find(DataPackGridItem);
            const viewedJobs = instance.props.userActivity.viewedJobs.viewedJobs;
            expect(recentlyViewedItems).not.toHaveLength(0);
            expect(recentlyViewedItems).toHaveLength(viewedJobs.length);
            for (let i = 0; i < viewedJobs.length; i++) {
                expect(recentlyViewedItems.at(i).props().run).toBe(viewedJobs[i].last_export_run);
            }
        });

        it('renders featured datapacks', () => {
            const featuredItems = wrapper.find('.qa-DashboardSection-Featured').children().find(DataPackFeaturedItem);
            const featuredRuns = instance.props.featuredRunsList.runs;
            expect(featuredItems).not.toHaveLength(0);
            expect(featuredItems).toHaveLength(featuredRuns.length);
            for (let i = 0; i < featuredRuns.length; i++) {
                expect(featuredItems.at(i).props().run).toBe(featuredRuns[i]);
            }
        });

        it('renders my datapacks', () => {
            const myDataPacksItems = wrapper.find('.qa-DashboardSection-MyDataPacks').children().find(DataPackGridItem);
            const runs = instance.props.runsList.runs;
            expect(myDataPacksItems).not.toHaveLength(0);
            expect(myDataPacksItems).toHaveLength(runs.length);
            for (let i = 0; i < runs.length; i++) {
                expect(myDataPacksItems.at(i).props().run).toBe(runs[i]);
            }
        });

        it('does not render Notifications "no data" element', () => {
            const notificationsSection = wrapper.find('.qa-DashboardSection-Notifications').dive();
            expect(notificationsSection.find('.qa-DashboardSection-Notifications-NoData')).toHaveLength(0);
        });

        it('does not render Recently Viewed "no data" element', () => {
            const recentlyViewedSection = wrapper.find('.qa-DashboardSection-RecentlyViewed').dive();
            expect(recentlyViewedSection.find('.qa-DashboardSection-RecentlyViewed-NoData')).toHaveLength(0);
        });

        it('does not render My DataPacks "no data" element', () => {
            const myDataPacksSection = wrapper.find('.qa-DashboardSection-MyDataPacks').dive();
            expect(myDataPacksSection.find('.qa-DashboardSection-MyDataPacks-NoData')).toHaveLength(0);
        });

        it('refreshes the page when deleting a datapack', () => {
            instance.refresh = sinon.spy();
            wrapper.setProps({
                runsDeletion: {
                    deleted: true,
                },
            });
            expect(instance.refresh.callCount).toBe(1);
        });

        it('refreshes the page when updating permissions', () => {
            instance.refresh = sinon.spy();
            wrapper.setProps({
                updatePermission: {
                    updated: true,
                },
            });
            expect(instance.refresh.callCount).toBe(1);
        });

        it('renders loading indicator while deleting a datapack', () => {
            wrapper.setProps({
                runsDeletion: {
                    deleting: true,
                },
            });
            expect(wrapper.find(CircularProgress)).toHaveLength(1);
            wrapper.setProps({
                runsDeletion: {
                    deleting: false,
                },
            });
            expect(wrapper.find(CircularProgress)).toHaveLength(0);
        });

        it('renders loading indicator while updating permissions', () => {
            wrapper.setProps({
                updatePermission: {
                    updating: true,
                },
            });
            expect(wrapper.find(CircularProgress)).toHaveLength(1);
            wrapper.setProps({
                updatePermission: {
                    updating: false,
                },
            });
            expect(wrapper.find(CircularProgress)).toHaveLength(0);
        });

        it('does not render loading indicator when automatically refreshing', () => {
            instance.autoRefresh();
            expect(wrapper.find(CircularProgress)).toHaveLength(0);
        });

        it('navigates to /notifications on Notifications section "View All" click', () => {
            const browserHistoryPushStub = sinon.stub(browserHistory, 'push');
            instance.handleNotificationsViewAll();
            expect(browserHistoryPushStub.callCount).toBe(1);
            expect(browserHistoryPushStub.calledWith('/notifications')).toBe(true);
            browserHistoryPushStub.restore();
        });

        it('navigates to /exports on Featured section "View All" click', () => {
            const browserHistoryPushStub = sinon.stub(browserHistory, 'push');
            instance.handleFeaturedViewAll();
            expect(browserHistoryPushStub.callCount).toBe(1);
            expect(browserHistoryPushStub.calledWith('/exports')).toBe(true);
            browserHistoryPushStub.restore();
        });

        it('navigates to /exports?collection=myDataPacks on My DataPacks "View All" click', () => {
            const browserHistoryPushStub = sinon.stub(browserHistory, 'push');
            instance.handleMyDataPacksViewAll();
            expect(browserHistoryPushStub.callCount).toBe(1);
            expect(browserHistoryPushStub.calledWith('/exports?collection=myDataPacks')).toBe(true);
            browserHistoryPushStub.restore();
        });

        describe('on share open', () => {
            let targetRun;

            beforeEach(() => {
                targetRun = {
                    job: {
                        permissions: {},
                    },
                };
                instance.handleShareOpen(targetRun);
            });

            it('opens the share dialog', () => {
                expect(wrapper.state().shareOpen).toBe(true);
                expect(wrapper.find(DataPackShareDialog)).toHaveLength(1);
            });

            it('passes the share dialog the target run permissions', () => {
                expect(wrapper.find(DataPackShareDialog).props().permissions).toBe(targetRun.job.permissions);
            });

            it('sets the target run', () => {
                expect(wrapper.state().targetRun).toEqual(targetRun);
            });
        });

        describe('on share close', () => {
            beforeEach(() => {
                wrapper.setState({
                    shareOpen: true,
                    run: 'test',
                });
                instance.handleShareClose();
            });

            it('closes the share dialog', () => {
                expect(wrapper.state().shareOpen).toBe(false);
                expect(wrapper.find(DataPackShareDialog)).toHaveLength(0);
            });

            it('nullifies the target run', () => {
                expect(wrapper.state().targetRun).toBe(null);
            });
        });

        describe('on share save', () => {
            let targetRun;
            let permissions;

            beforeEach(() => {
                instance.handleShareClose = sinon.spy();
                targetRun = {
                    job: {
                        uid: 1,
                    },
                };
                wrapper.setState({
                    shareOpen: true,
                    targetRun,
                });
                permissions = { some: 'permissions' };
                instance.handleShareSave(permissions);
            });

            it('closes the share dialog', () => {
                expect(instance.handleShareClose.callCount).toBe(1);
            });

            it('updates datacart permissions', () => {
                expect(instance.props.updateDataCartPermissions.callCount).toBe(1);
                expect(instance.props.updateDataCartPermissions.calledWith(targetRun.job.uid, permissions)).toBe(true);
            });
        });
    });

    describe('after empty data has loaded', () => {
        beforeEach(() => {
            loadEmptyData(wrapper);
        });

        it('does not render loading indicator', () => {
            expect(wrapper.find(CircularProgress)).toHaveLength(0);
        });

        it('renders Notifications section', () => {
            expect(wrapper.find('.qa-DashboardSection-Notifications')).toHaveLength(1);
        });

        it('renders Recently Viewed section', () => {
            expect(wrapper.find('.qa-DashboardSection-RecentlyViewed')).toHaveLength(1);
        });

        it('does not render Featured section', () => {
            expect(wrapper.find('.qa-DashboardSection-Featured')).toHaveLength(0);
        });

        it('renders My DataPacks section', () => {
            expect(wrapper.find('.qa-DashboardSection-MyDataPacks')).toHaveLength(1);
        });

        it('renders Notifications "no data" element', () => {
            const notificationsSection = wrapper.find('.qa-DashboardSection-Notifications').dive();
            expect(notificationsSection.find('.qa-DashboardSection-Notifications-NoData')).toHaveLength(1);
        });

        it('renders Recently Viewed "no data" element', () => {
            const recentlyViewedSection = wrapper.find('.qa-DashboardSection-RecentlyViewed').dive();
            expect(recentlyViewedSection.find('.qa-DashboardSection-RecentlyViewed-NoData')).toHaveLength(1);
        });

        it('renders My DataPacks "no data" element', () => {
            const myDataPacksSection = wrapper.find('.qa-DashboardSection-MyDataPacks').dive();
            expect(myDataPacksSection.find('.qa-DashboardSection-MyDataPacks-NoData')).toHaveLength(1);
        });
    });

    describe('mount', () => {
        let refreshSpy;

        beforeEach(() => {
            refreshSpy = sinon.spy(DashboardPage.prototype, 'refresh');
            jest.useFakeTimers();
            setup();
            instance.componentDidMount();
        });

        afterEach(() => {
            refreshSpy.restore();
        });

        it('requests groups', () => {
            expect(instance.props.getGroups.callCount).toBe(1);
        });

        it('requests providers', () => {
            expect(instance.props.getProviders.callCount).toBe(1);
        });

        it('requests notifications', () => {
            expect(instance.props.getNotifications.callCount).toBe(1);
        });

        it('refreshes the page periodically', () => {
            expect(instance.autoRefreshIntervalId).not.toBe(null);
            expect(refreshSpy.callCount).toBe(1);
            jest.runOnlyPendingTimers();
            expect(refreshSpy.callCount).toBe(2);
            jest.runOnlyPendingTimers();
            expect(refreshSpy.callCount).toBe(3);
            jest.runOnlyPendingTimers();
            expect(refreshSpy.callCount).toBe(4);
        });

        describe('unmount', () => {
            beforeEach(() => {
                instance.componentWillUnmount();
            });

            it('stops auto refreshing', () => {
                expect(instance.autoRefreshIntervalId).toBe(null);
                expect(refreshSpy.callCount).toBe(1);
                jest.runOnlyPendingTimers();
                expect(refreshSpy.callCount).toBe(1);
            });
        });
    });
});