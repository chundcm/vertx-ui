import U from 'underscore';
import Immutable from "immutable";
import Type from "../Ux.Type";
import Util from '../util';
import moment from "moment";
import {DataArray, DataObject} from "entity";

const isEmpty = (input) => {
    if (input) {
        if (U.isArray(input)) {
            return 0 === input.length;
        } else {
            return 0 === Object.keys(input).length;
        }
    } else return false;
};
const toJson = (input) => {
    if ("string" === typeof input) {
        try {
            return JSON.parse(input);
        } catch (e) {
            return null;
        }
    } else return input;
};
const clone = (input) => {
    if (input instanceof DataObject || input instanceof DataArray) {
        if (input.is()) {
            return Immutable.fromJS(input.to()).toJS();
        } else {
            if (input instanceof DataObject) {
                return Immutable.fromJS({}).toJS();
            } else {
                return Immutable.fromJS([]).toJS();
            }
        }
    } else {
        return input ? Immutable.fromJS(input).toJS() : input;
    }
};
/**
 * mode = 0：调用原生的Object.assign：直接覆盖
 * mode = 1：将source中的属性追加到target中，深度追加
 * mode = 2：将source中的属性追加到target中，没有时追加
 * @param target
 * @param source
 * @param mode
 */
const assign = (target = {}, source = {}, mode = 0) => {
    if (!target) target = {};
    let result = clone(target);
    if (0 === mode) {
        result = Object.assign(target, source);
    } else {
        Type.itObject(source, (field, value) => {
            // 检查target中是否包含了field
            const targetValue = result[field];
            if (U.isObject(targetValue) && !moment.isMoment(targetValue) &&
                U.isObject(value) && !moment.isMoment(value)) {
                // 当前节点为两个对象，统一方式合并，且mode也相同
                result[field] = assign(targetValue, value, mode);
            } else {
                if (1 === mode) {
                    // 直接覆盖
                    result[field] = value;
                } else if (2 === mode) {
                    // 没有属性才追加
                    if (!target.hasOwnProperty(field)) {
                        result[field] = value;
                    }
                }
            }
        });
    }
    return result;
};
const vector = (item = {}, config = {}) => {
    const target = clone(item);
    Type.itObject(config, (from, to) => {
        if (item.hasOwnProperty(from)) {
            target[to] = item[from];
            delete target[from];
        }
    });
    return target;
};
const expand = (item = {}, mapping = {}, overwrite = false) => {
    const object = {};
    Type.itObject(mapping, (from, to) => {
        // 如果item包含了右边，则直接左边的值的等于右边
        if (item.hasOwnProperty(to)) {
            object[from] = item[to];
        } else if (item.hasOwnProperty(from)) {
            object[to] = item[from];
        }
    });
    return overwrite ? Object.assign(item, object) :
        Object.assign(object, item);
};
const slice = (input, ...keys) => {
    if (0 < keys.length) {
        const fnClone = (item) => {
            const newItem = {};
            keys.filter(each => item.hasOwnProperty(each))
                .forEach(key => newItem[key] = item[key]);
            return newItem;
        };
        if (U.isArray(input)) {
            return input.map(each => fnClone.apply(this, [each].concat(keys)));
        } else if (U.isObject(input)) {
            return fnClone.apply(this, [input].concat(keys));
        } else return {};
    } else return {};
};
const element = (input, fnExecute) => {
    if (U.isFunction(fnExecute)) {
        if (U.isArray(input)) {
            // 数组执行每一个元素
            input.forEach((item, index) => {
                if (U.isObject(item)) {
                    fnExecute(item, index);
                }
            });
        } else {
            if (U.isObject(input)) {
                // 非数组执行当前对象
                fnExecute(input);
            }
        }
    }
};
const matrix = (array = [], object = {}, fnExecute, fnPredicate) => {
    if (!isEmpty(object)) {
        // 是否检查
        const predicate = U.isFunction(fnPredicate) ? fnPredicate : () => true;
        Type.itFull(array, object, (item = {}, key, value) => {
            if (predicate(value)) {
                fnExecute(item, key, value);
            }
        });
    }
};
const cut = (array, ...attr) => {
    const target = clone(array);
    const fnCut = (item = {}) => attr.filter(field => item.hasOwnProperty(field))
        .forEach(field => delete item[field]);
    element(target, fnCut);
};
/**
 * 双遍历
 * @param input
 * @param fnExecute
 */
const each = (input, fnExecute) => {
    if (input) {
        if (U.isArray(input)) {
            input.forEach((item, index) => fnExecute(item, index, input));
        } else if (U.isObject(input)) {
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    fnExecute(key, input[key], input);
                }
            }
        }
    }
};
const field = (instance, name, value) => {
    if (instance && "string" === typeof name) {
        let $instance = Immutable.fromJS(instance);
        // 如果value为undefined（2参数，读取）
        if (value) {
            // 【二义性处理】Function和值
            value = to(value);
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.setIn(path, value);
            } else {
                $instance = $instance.set(name, value);
            }
        } else {
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.getIn(path);
            } else {
                $instance = $instance.get(name);
            }
        }
        // 返回读取的最终结果
        return U.isFunction($instance.toJS) ? $instance.toJS() : $instance;
    }
};
const to = (value) => {
    if (value) {
        if (U.isFunction(value)) {
            const result = value();
            return result ? result : {};
        } else {
            return value;
        }
    } else return {};
};
const extract = (dataItem = {}, path, field, fnCond = () => true) => {
    const $path = U.isArray(path) ? path : path.split(".");
    const $data = Immutable.fromJS(dataItem);
    const value = $data.getIn($path);
    if (value && value.toJS) {
        const object = value.toJS();
        if (object) {
            if (U.isArray(object)) {
                return object.filter(item => fnCond(item)).map(item => item[field]);
            } else if (U.isObject(object)) {
                return object[field];
            }
        } else return null;
    } else return null;
};
// --- 子节点处理
const _childrenByField = (array = [], config = {}) => {
    const {key, item, field, zero = true, sorter} = config;
    if (!key) return [];
    const pValue = item[key];
    let childrenArray = array.filter(each => each[field] === pValue);
    childrenArray = clone(childrenArray);
    if (0 < childrenArray.length) {
        childrenArray.forEach(each => {
            each.children = _childrenByField(array, {
                key, item: each, field, zero, sorter,
            });
            normalizeData(each, config);
        });
    }
    return childrenArray;
};
const normalizeData = (each = {}, config = {}) => {
    const {zero = true, sorter} = config;
    if (!zero && 0 === each.children.length) {
        // 是否处理zero信息
        delete each.children;
    } else {
        // 再执行排序
        if (sorter) {
            each.children = each.children.sort(Util.sorterAscFn(sorter));
        }
    }
};
const isDiff = (left, right) => {
    const leftValue = (left instanceof DataObject ||
        left instanceof DataArray) ? left.to() : left;
    const rightValue = (right instanceof DataObject ||
        right instanceof DataArray) ? right.to() : right;
    if (leftValue && rightValue) {
        const $left = Immutable.fromJS(left);
        const $right = Immutable.fromJS(right);
        return !Immutable.is($left, $right);
    } else return leftValue !== rightValue;
};
const Child = {
    byField: _childrenByField,
    normalizeData,
};
const Letter = {
    UPPER: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
    LOWER: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']
};
const sequence = (input, mode = "DIGEST") => {
    if ("UPPER" === mode) {
        return Letter.UPPER[input - 1];
    } else if ("LOWER" === mode) {
        return Letter.LOWER[input - 1];
    } else return input;
};
/**
 * 读取第一个非undefined项目
 * @param input
 * @returns {*}
 */
const flowable = (...input) => {
    let item;
    for (let idx = 0; idx < input.length; idx++) {
        const each = input[idx];
        if (undefined !== each) {
            item = each;
            break;
        }
    }
    return item;
};
export default {
    isEmpty, // 判断是否为空
    isDiff, // 判断两个对象是否相同
    sequence, // 序号处理
    flowable, // 从第一个开始读取第一个非undefined的项
    extract,
    // 安全转换
    toJson,
    // 三种模式的合并
    assign,
    // 拷贝
    clone,
    // 直接转换
    vector,
    // 设置合并方法
    expand,
    // 子对象
    slice,
    // 遍历
    element,
    // 全遍历
    matrix,
    // 双遍历
    each,
    // field双意函数
    field,
    // 移除
    cut,
    // 二义性函数
    to,
    // 不可变处理
    immutable: Immutable.fromJS,
    // 子节点检索
    Child,
};