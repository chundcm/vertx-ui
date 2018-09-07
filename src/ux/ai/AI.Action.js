import React from 'react';
import Prop from '../prop/Ux.Prop';
import Rdx from '../fun/Ux.Rdx';
import U from 'underscore';
import E from '../Ux.Error';
import Cv from '../Ux.Constant';
import Value from '../Ux.Value';
import Type from '../Ux.Type';
import Layout from './AI.Layout';
import {Button} from 'antd';
import Immutable from 'immutable';
import Ux from "ux";

const ai2Submit = (Op = {}) => (reference, jsx = {}) => {
    if (!jsx.op) return false;
    return (jsx.op.map(each => (
        <Button key={each} id={each} onClick={E.fxSubmit(reference, Op, each)}/>
    )))
};
const ai2Event = (reference, fnSuccess, fnFailure) => (event) => E.fxForm(reference, (form) => {
    event.preventDefault();
    Rdx.rdxSubmitting(reference, true);
    const {$inited} = reference.props;
    form.validateFieldsAndScroll((error, values) => {
        if (error) {
            Rdx.rdxSubmitting(reference, false);
            if (fnFailure && U.isFunction(fnFailure)) {
                fnFailure(error);
            }
            return;
        }
        const params = Immutable.fromJS(values).toJS();
        params.language = Cv['LANGUAGE'];
        // 应用专用数据
        const {$app} = reference.props;
        if ($app && $app.is()) {
            params.sigma = $app._("sigma");
        }
        params.active = !!values.active;
        if ($inited && $inited.key) params.key = $inited.key;
        Value.valueValid(params);
        if (fnSuccess && U.isFunction(fnSuccess)) {
            const {fnMock} = reference.props;
            if (fnMock) {
                fnSuccess(params, fnMock(params));
            } else {
                fnSuccess(params);
            }
            Ux.D.connectSubmit(reference, params);
        }
    });
});

const aiFormButton = (reference, onClick, id = false, submit = []) => {
    if (onClick) {
        const {$inited = {}} = reference.props;
        const key = (id) ? ($inited.key ? $inited.key : "") : "";
        const buttons = [];
        const $submit = Immutable.fromJS(submit);
        Type.itObject(onClick, (field, fn) => {
            const item = {};
            const clientId = `${field}${key}`;
            item.key = clientId;
            item.id = clientId;
            if ($submit.contains(field)) {
                // 动态绑定raft处理时专用
                item.onClick = (event) => {
                    event.preventDefault();
                    const executor = fn(reference);
                    return Ux.rtSubmit(reference, executor);
                }
            } else {
                item.onClick = fn(reference);
            }
            buttons.push(item);
        });
        return (
            <span>
                {buttons.filter(item => item.key.startsWith("$")).map(item => (<Button {...item}/>))}
            </span>
        )
    } else {
        console.error("未传入'onClick'事件绑定原始数据！")
    }
};

const aiOp = (reference) => (Op) => Object.keys(Op)
    .filter(key => U.isFunction(Op[key])).map(key => (
        <Button className={"ux-hidden"} key={key} id={key} onClick={Op[key](reference)}/>
    ));
const ai2RaftButton = (Op, {id, event = []}) => (cell, reference) => {
    const $event = Immutable.fromJS(event);
    const submit = Object.keys(Op).filter(key => !$event.contains(key));
    const ref = Value.fix(cell, reference);
    return aiFormButton(ref, Op, id, submit);
};
const ai2FormButton = (Op, id = false) => ({
    $button: (cell, reference) => {
        const ref = Value.fix(cell, reference);
        return aiFormButton(ref, Op, id);
    }
});
const ai2FilterButton = (window = 1) => {
    return {
        $button: (cell, reference) => {
            const ref = Value.fix(cell, reference);
            const button = Prop.fromHoc(ref, "button");
            return (1 / 3 === window) ? Layout.aiColumns([5, 14],
                undefined,
                <Button.Group className={"web-button"}>
                    <Button type={"primary"} icon={"search"}
                            onClick={() => Ux.irFilter(ref)}>{button.search}</Button>
                    <Button icon={"reload"} onClick={Ux.irClear(ref)}>{button.clear}</Button>
                </Button.Group>
            ) : false
        }
    }
};
export default {
    // 登录按钮替换RxOp使用
    ai2Submit,
    // Event封装按钮专用
    ai2Event,

    // ComplexList专用
    ai2FormButton,
    ai2FilterButton,
    // 特殊模式动态渲染
    ai2RaftButton,
    // Page中直接按钮生成
    aiOp
}