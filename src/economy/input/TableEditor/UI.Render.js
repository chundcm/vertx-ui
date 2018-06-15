import React from 'react';
import {Button} from 'antd';
import Ux from 'ux';
import Immutable from 'immutable';
import RENDER from '../_internal/UI.Render';

const onAdd = (reference, index) => (event) => {
    const state = reference.state;
    if (state.source) {
        const item = state.source;
        if (index === item.length) {
            item.push({key: Ux.randomUUID()});
        } else {
            item.splice(index + 1, 0, {key: Ux.randomUUID()});
        }
        const source = Immutable.fromJS(state.source).toJS();
        reference.setState({source});
        RENDER.triggerChange(reference, {source})
    } else {
        console.error("[ZERO] Add 'data' in state has not been initialized.");
    }
};

const onRemove = (reference, index) => (event) => {
    const state = reference.state;
    if (state.source) {
        const item = state.source.filter((item, idx) => idx !== index);
        const source = Immutable.fromJS(item).toJS();
        reference.setState({source});
        RENDER.triggerChange(reference, {source})
    } else {
        console.error("[ZERO] Remove 'data' in state has not been initialized.");
    }
};

const renderOp = (reference, config, jsx) => (text, record, index) => {
    return (
        <span>
            <Button.Group style={{width: 80, textAlign: "center"}}>
                <Button icon={"plus"} onClick={onAdd(reference, index)}/>
                <Button disabled={0 === index} icon={"minus"} onClick={onRemove(reference, index)}/>
            </Button.Group>
        </span>
    )
};
const renderColumn = (reference, columns = [], jsx) => {
    columns.forEach((item) => {
        if ("key" === item.dataIndex) {
            item.render = renderOp(reference, item);
        } else {
            const type = item['$type'] ? item['$type'] : "TEXT";
            const render = RENDER[type];
            if (render) {
                item.render = render(reference, item, jsx)
            }
        }
    })
};
export default {
    renderColumn
}