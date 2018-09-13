import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Dialog from '@material-ui/core/Dialog';
import * as viewport from '../../utils/viewport';
import { ShareBaseDialog } from '../../components/DataPackShareDialog/ShareBaseDialog';


describe('MembersHeaderRow component', () => {
    const getProps = () => (
        {
            title: 'SHARE',
            children: [<div>hello</div>],
            submitButtonLabel: 'SAVE',
            show: true,
            onClose: () => {},
            handleSave: () => {},
            ...global.eventkit_test_props,
        }
    );

    const getWrapper = props => (
        shallow(<ShareBaseDialog {...props} />)
    );

    it('should render the basic components', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        expect(wrapper.find(Dialog)).toHaveLength(1);
    });

    it('componentDidMount should add an event listener', () => {
        const props = getProps();
        const addStub = sinon.stub(global.window, 'addEventListener');
        const wrapper = getWrapper(props);
        expect(addStub.called).toBe(true);
        expect(addStub.calledWith('resize', wrapper.instance().handleResize)).toBe(true);
        addStub.restore();
    });

    it('componentWillUnmount should remove event listener', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        const func = wrapper.instance().handleResize;
        const removeSpy = sinon.spy(global.window, 'removeEventListener');
        wrapper.unmount();
        expect(removeSpy.called).toBe(true);
        expect(removeSpy.calledWith('resize', func)).toBe(true);
        removeSpy.restore();
    });

    it('handleResize should setState if mobile has changed', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        const { mobile } = wrapper.state();
        const mobileStub = sinon.stub(viewport, 'isViewportS').returns(!mobile);
        const stateStub = sinon.stub(wrapper.instance(), 'setState');
        wrapper.instance().handleResize();
        expect(mobileStub.calledOnce).toBe(true);
        expect(stateStub.calledOnce).toBe(true);
        expect(stateStub.calledWith({ mobile: !mobile })).toBe(true);
        mobileStub.restore();
        stateStub.restore();
    });
});
