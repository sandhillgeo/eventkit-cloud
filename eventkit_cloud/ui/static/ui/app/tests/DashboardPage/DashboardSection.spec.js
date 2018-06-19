import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { Tab, Tabs } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SwipeableViews from 'react-swipeable-views';
import DashboardSection from '../../components/DashboardPage/DashboardSection';

describe('DashboardSection component', () => {
    const muiTheme = getMuiTheme();
    let props;
    let wrapper;
    let instance;

    beforeEach(() => {
        setup();
    });

    function setup({ propsOverride = {}, mounted = false, children = [] } = {}) {
        props = {
            title: 'Test',
            name: 'test',
            columns: 3,
            providers: [],
            noDataElement: <div className={'qa-DashboardSection-NoDataElement'} />,
            ...propsOverride,
        };

        if (mounted) {
            wrapper = mount(
                <DashboardSection { ...props }>
                    {children}
                </DashboardSection>,
                {
                    context: { muiTheme },
                    childContextTypes: { muiTheme: React.PropTypes.object },
                }
            );
        } else {
            wrapper = shallow(
                <DashboardSection { ...props }>
                    {children}
                </DashboardSection>
            );
        }

        instance = wrapper.instance();
    }

    function generateChildren(count) {
        const children = [];
        for (let i = 0; i < count; i++) {
            children.push(<div className={'qa-DashboardSection-Child'} />);
        }

        return children;
    }

    it('renders header', () => {
        expect(wrapper.find('.qa-DashboardSection-Header')).toHaveLength(1);
    });

    it('renders header title', () => {
        expect(wrapper.find('.qa-DashboardSection-Header-Title').text()).toBe(props.title);
    });

    it('limits the number of pages to maxPages', () => {
        setup({
            propsOverride: {
                columns: 1,
                rows: 1,
            },
            children: generateChildren(10),
        });
        expect(wrapper.find('.qa-DashboardSection-Page-Item')).toHaveLength(instance.itemsPerPage * instance.maxPages);
    });

    it('constructs the correct number of pages, each with the correct number of children', () => {
        setup({
            propsOverride: {
                columns: 3,
                rows: 2,
            },
            children: generateChildren(8),
        });
        expect(instance.maxPages).toBe(3);
        const pages = instance.getPages();
        expect(pages).toHaveLength(2);
        expect(pages[0]).toHaveLength(6);
        expect(pages[1]).toHaveLength(2);
    });

    describe('no children', () => {
        it('renders "no data" element', () => {
            expect(wrapper.find('.qa-DashboardSection-NoDataElement')).toHaveLength(1);
        });
    });

    describe('3 columns, 3 children (1 page)', () => {
        beforeEach(() => {
            setup({
                propsOverride: {
                    columns: 3,
                },
                children: generateChildren(3),
            });
        });

        it('renders a single page', () => {
            expect(wrapper.find('.qa-DashboardSection-Page')).toHaveLength(1);
        });

        it('constructs a single page of items', () => {
            expect(instance.getPages().length).toBe(1);
        });

        it('renders a tab group', () => {
            expect(wrapper.find(Tabs)).toHaveLength(1);
        });

        it('renders 3 tab buttons (maxPages = 3)', () => {
            expect(wrapper.find(Tab)).toHaveLength(3);
        });

        it('enables the first tab button', () => {
            const tabButton = wrapper.find(Tab).at(0);
            expect(tabButton.props().style.pointerEvents).not.toBe('none');
            expect(tabButton.props().buttonStyle.backgroundColor).toBe('white');
        });

        it('disables the second tab button', () => {
            const tabButton = wrapper.find(Tab).at(1);
            expect(tabButton.props().style.pointerEvents).toBe('none');
            expect(tabButton.props().buttonStyle.backgroundColor).not.toBe('white');
        });

        it('disables the third tab button', () => {
            const tabButton = wrapper.find(Tab).at(2);
            expect(wrapper.find(Tab).at(2).props().style.pointerEvents).toBe('none');
            expect(tabButton.props().buttonStyle.backgroundColor).not.toBe('white');
        });

        it('renders SwipeableViews component', () => {
            expect(wrapper.find(SwipeableViews)).toHaveLength(1);
        });

        it('syncs page index with SwipeableViews component', () => {
            const swipeableViews = wrapper.find(SwipeableViews);
            expect(swipeableViews.props().index).toBe(instance.state.pageIndex);
            expect(swipeableViews.props().onChangeIndex).toBe(instance.handlePageChange);
        });

        it('renders children', () => {
            expect(wrapper.find('.qa-DashboardSection-Child')).toHaveLength(3);
        });
    });

    describe('when rowMajor is true', () => {
        beforeEach(() => {
            setup({
                propsOverride: {
                    rowMajor: true,
                    columns: 3,
                    rows: 3,
                },
                children: generateChildren(9)
            });
        });

        it('renders children in a row-major grid', () => {
            expect(wrapper.find('.qa-DashboardSection-Page-Column')).toHaveLength(0);
        });
    });

    describe('when rowMajor is false', () => {
        beforeEach(() => {
            setup({
                propsOverride: {
                    rowMajor: false,
                    columns: 3,
                    rows: 3,
                },
                children: generateChildren(9)
            });
        });

        it('renders children in a column-major grid', () => {
            expect(wrapper.find('.qa-DashboardSection-Page-Column')).toHaveLength(3);
        });
    });

    describe('when onViewAll handler is not passed in', () => {
        it('does not render "View All" button', () => {
            expect(wrapper.find('.qa-DashboardSection-ViewAll')).toHaveLength(0);
        });
    });

    describe('when onViewAll handler is passed in', () => {
        beforeEach(() => {
            setup({
                propsOverride: {
                    onViewAll: sinon.spy(),
                },
                children: generateChildren(1),
            });
        });

        it('renders "View All" button', () => {
            expect(wrapper.find('.qa-DashboardSection-ViewAll')).toHaveLength(1);
        });

        it('calls onViewAll() when "View All" button is clicked', () => {
            wrapper.find('.qa-DashboardSection-ViewAll').simulate('click');
            expect(instance.props.onViewAll.callCount).toBe(1);
        });
    });

    it('updates the page index on a page change', () => {
        expect(wrapper.state().pageIndex).not.toBe(1);
        instance.handlePageChange(1);
        expect(wrapper.state().pageIndex).toBe(1);
    });
});
