import React from 'react'
import Ux from "ux";
import {PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {children, $status = {}} = this.props;
        console.info(this.props, this.state, {
            reference: this,
            ...$status
        });
        return (
            <PageCard reference={this} {...$status}>
                {children}
            </PageCard>
        )
    }
}

export default Component