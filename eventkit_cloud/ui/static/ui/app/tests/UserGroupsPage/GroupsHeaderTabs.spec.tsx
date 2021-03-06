import * as React from 'react';
import * as sinon from 'sinon';
import {Tab, Tabs} from "@material-ui/core";
import {createShallow} from "@material-ui/core/test-utils";
import {GroupsHeaderTabs} from "../../components/UserGroupsPage/GroupsHeaderTabs";
import FormControlLabel from "@material-ui/core/FormControlLabel";

describe('GroupPanelBody component', () => {
    let shallow: any;

    beforeAll(() => {
        shallow = createShallow();
    });

    const getProps = () => ({
        selectedTab: 'admin',
        totalAdmin: 10,
        totalMember: 1,
        totalOther: 5,
        handleChange: sinon.spy(),
        classes: {},
        ...(global as any).eventkit_test_props,
    });

    const getWrapper = props => shallow(<GroupsHeaderTabs {...props}/>);

    it('should render something', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        expect(wrapper.find(Tabs)).toHaveLength(1);
        expect(wrapper.find(Tab)).toHaveLength(3);
    });

    it('should default the opened tab to "Admin" and disable it so a user cannot click on it while active', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        expect(wrapper.find(Tab).first().props().disabled).toBe(true);
        expect(wrapper.find(Tab).at(1).props().disabled).toBe(false);
        expect(wrapper.find(Tab).at(2).props().disabled).toBe(false);
    });

    it('should show total counts for each group category on the header tabs', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        expect(wrapper.find(Tab).first().html()).toContain(10);
        expect(wrapper.find(Tab).at(1).html()).toContain(1);
        expect(wrapper.find(Tab).at(2).html()).toContain(5);
    });

    it('clicking on "Member" tab should fire handleChange to show Shared Groups', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        const mockedEvent = sinon.spy();
        const mockCallBack = sinon.spy();
        const value = 'member';
        expect(wrapper
            .find(Tab)
            .at(0)
            .props().value)
            .toBe('admin');
        mockCallBack(mockedEvent, value);
        wrapper.find(Tab).at(0).simulate('change');
        expect(mockCallBack.calledOnce).toBe(true);
    });
});
