import React from 'react';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import initialState from '../../reducers/initialState';
import {fakeStore} from '../../__mocks__/fakeStore';
import {CreateExport} from '../../components/CreateDataPack/CreateExport';
import {BreadcrumbStepper} from '../../components/BreadcrumbStepper';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Help from 'material-ui/svg-icons/action/help';


describe('CreateExport component', () => {
    injectTapEventPlugin();
    const muiTheme = getMuiTheme();
    it('should render the elements', () => {
        // dont render the full component tree
        const content = BreadcrumbStepper.prototype.getStepContent;
        BreadcrumbStepper.prototype.getStepContent = () => {return <div/>};

        const store = fakeStore(initialState);
        const wrapper = mount(<CreateExport><div id='my-child-element'/></CreateExport>, {
            context: {muiTheme, store},
            childContextTypes: {
                muiTheme: React.PropTypes.object,
                store: React.PropTypes.object
            }
        });
        expect(wrapper.find(AppBar)).toHaveLength(1);
        expect(wrapper.find(BreadcrumbStepper)).toHaveLength(1);
        expect(wrapper.find(Help)).toHaveLength(1);
        expect(wrapper.find('#my-child-element')).toHaveLength(1);

        // restore content function
        BreadcrumbStepper.prototype.getStepContent = content;      
    });

    it('handleWalkthroughReset should set state', () => {
        const wrapper = shallow(<CreateExport />);
        const stateSpy = new sinon.spy(CreateExport.prototype, 'setState');
        wrapper.instance().handleWalkthroughReset();
        expect(stateSpy.calledOnce).toBe(true);
        expect(stateSpy.calledWith({walkthroughClicked: false}));
        stateSpy.restore();
    });

    it('handleWalkthroughClick should set state', () => {
        const wrapper = shallow(<CreateExport />);
        const stateSpy = new sinon.spy(CreateExport.prototype, 'setState');
        wrapper.instance().handleWalkthroughClick();
        expect(stateSpy.calledOnce).toBe(true);
        expect(stateSpy.calledWith({walkthroughClicked: true}));
        stateSpy.restore();
    });
});
